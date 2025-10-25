package com.imad.physics_api.service;

import com.imad.physics_api.exception.BadRequestException;
import com.imad.physics_api.exception.ResourceNotFoundException;
import com.imad.physics_api.model.entity.*;
import com.imad.physics_api.model.enums.*;
import com.imad.physics_api.repository.*;
import com.imad.physics_api.dto.request.CreateCourseRequest;
import com.imad.physics_api.dto.request.UpdateCourseRequest;
import com.imad.physics_api.dto.response.CourseDetailResponse;
import com.imad.physics_api.dto.response.CourseListResponse;
import com.imad.physics_api.dto.response.CourseSectionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
public class CourseService {

    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseSectionRepository courseSectionRepository;

    @Autowired
    private CourseImageRepository courseImageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentProgressRepository studentProgressRepository;

    @Autowired
    private LaTeXProcessorService latexProcessor;

    @Autowired
    private SecureImageService imageService;

    @Autowired
    private ActivityLogService activityLogService;

    /**
     * Crée un nouveau cours avec traitement du LaTeX
     */
    public CourseDetailResponse createCourse(CreateCourseRequest request, UUID authorId) {
        logger.info("Creating new course: {}", request.getTitle());

        // Récupérer l'auteur
        User author = userRepository.findById(authorId)
                .orElseThrow(() -> new ResourceNotFoundException("Author not found"));

        // Créer l'entité Course
        Course course = new Course();
        course.setTitle(request.getTitle());
        course.setDescription(request.getDescription());
        course.setRawLatexContent(request.getLatexContent());
        course.setAcademicLevel(request.getAcademicLevel());
        course.setBranch(request.getBranch());
        course.setChapterNumber(request.getChapterNumber());
        course.setOrderIndex(request.getOrderIndex() != null ? request.getOrderIndex() : 0);
        course.setStatus(ContentStatus.DRAFT);
        course.setAuthor(author);
        course.setTags(request.getTags());

        // Traiter le contenu LaTeX
        LaTeXProcessorService.ProcessedLatexContent processed =
                latexProcessor.processLatexContent(request.getLatexContent());

        // Stocker le contenu traité
        course.setLatexContent(processed.getRawContent());
        course.setEstimatedReadingTime(processed.getStatistics().getEstimatedReadingTime());

        // Sauvegarder le cours
        course = courseRepository.save(course);

        // Créer les sections
        createCourseSections(course, processed.getSections());

        // Gérer les images
        handleCourseImages(course, processed.getImages());

        // Vérifier la disponibilité des images
        validateImages(course);

        // Logger l'activité
        activityLogService.logActivity(author, EventType.COURSE_VIEW,
                "Created course: " + course.getTitle(), true);

        return toCourseDetailResponse(course);
    }

    /**
     * Met à jour un cours existant
     */
    public CourseDetailResponse updateCourse(UUID courseId, UpdateCourseRequest request, UUID userId) {
        logger.info("Updating course: {}", courseId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Vérifier les permissions
        if (!course.getAuthor().getId().equals(userId)) {
            throw new BadRequestException("You can only edit your own courses");
        }

        // Mettre à jour les champs
        if (request.getTitle() != null) {
            course.setTitle(request.getTitle());
        }
        if (request.getDescription() != null) {
            course.setDescription(request.getDescription());
        }
        if (request.getAcademicLevel() != null) {
            course.setAcademicLevel(request.getAcademicLevel());
        }
        if (request.getBranch() != null) {
            course.setBranch(request.getBranch());
        }
        if (request.getTags() != null) {
            course.setTags(request.getTags());
        }

        // Si le contenu LaTeX a changé, retraiter
        if (request.getLatexContent() != null &&
                !request.getLatexContent().equals(course.getRawLatexContent())) {

            course.setRawLatexContent(request.getLatexContent());

            // Supprimer les anciennes sections
            courseSectionRepository.deleteAllByCourse(course);
            courseImageRepository.deleteAllByCourse(course);

            // Retraiter le contenu
            LaTeXProcessorService.ProcessedLatexContent processed =
                    latexProcessor.processLatexContent(request.getLatexContent());

            course.setLatexContent(processed.getRawContent());
            course.setEstimatedReadingTime(processed.getStatistics().getEstimatedReadingTime());

            // Recréer les sections
            createCourseSections(course, processed.getSections());

            // Gérer les nouvelles images
            handleCourseImages(course, processed.getImages());
        }

        course = courseRepository.save(course);

        return toCourseDetailResponse(course);
    }

    /**
     * Publie un cours
     */
    public CourseDetailResponse publishCourse(UUID courseId, UUID userId) {
        logger.info("Publishing course: {}", courseId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Vérifier les permissions
        if (!course.getAuthor().getId().equals(userId)) {
            throw new BadRequestException("You can only publish your own courses");
        }

        // Vérifier que toutes les images sont disponibles
        SecureImageService.ValidationResult validation = validateImages(course);
        if (!validation.isAllImagesAvailable()) {
            throw new BadRequestException("Cannot publish course with missing images: " +
                    String.join(", ", validation.getMissingImages()));
        }

        course.publish();
        course = courseRepository.save(course);

        activityLogService.logActivity(course.getAuthor(), EventType.COURSE_VIEW,
                "Published course: " + course.getTitle(), true);

        return toCourseDetailResponse(course);
    }

    /**
     * Récupère un cours avec ses sections
     */
    @Transactional(readOnly = true)
    public CourseDetailResponse getCourse(UUID courseId, UUID userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Incrémenter le compteur de vues
        course.incrementViewCount();
        courseRepository.save(course);

        // Mettre à jour ou créer le progrès de l'étudiant
        if (userId != null) {
            User student = userRepository.findById(userId).orElse(null);
            if (student != null && student.getRole() == UserRole.STUDENT) {
                updateStudentProgress(student, course);
            }
        }

        return toCourseDetailResponse(course);
    }

    /**
     * Récupère la liste des cours avec pagination et filtres
     */
    @Transactional(readOnly = true)
    public Page<CourseListResponse> getCourses(AcademicLevel level, Branch branch,
                                               ContentStatus status, Pageable pageable) {

        Page<Course> courses;

        if (level != null && branch != null) {
            courses = courseRepository.findByAcademicLevelAndBranch(level, branch, pageable);
        } else if (level != null) {
            courses = courseRepository.findByAcademicLevel(level, pageable);
        } else if (branch != null) {
            courses = courseRepository.findByBranch(branch, pageable);
        } else if (status != null) {
            courses = courseRepository.findByStatus(status, pageable);
        } else {
            // Par défaut, ne montrer que les cours publiés
            courses = courseRepository.findByStatus(ContentStatus.PUBLISHED, pageable);
        }

        return courses.map(this::toCourseListResponse);
    }

    /**
     * Recherche de cours
     */
    @Transactional(readOnly = true)
    public Page<CourseListResponse> searchCourses(String query, Pageable pageable) {
        Page<Course> courses = courseRepository.searchByTitleOrDescription(query, pageable);
        return courses.map(this::toCourseListResponse);
    }

    /**
     * Supprime un cours
     */
    public void deleteCourse(UUID courseId, UUID userId) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found"));

        // Vérifier les permissions
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!course.getAuthor().getId().equals(userId) && user.getRole() != UserRole.ADMIN) {
            throw new BadRequestException("You don't have permission to delete this course");
        }

        // Soft delete
        course.setIsDeleted(true);
        courseRepository.save(course);

        activityLogService.logActivity(user, EventType.COURSE_VIEW,
                "Deleted course: " + course.getTitle(), true);
    }

    /**
     * Récupère les cours d'un auteur
     */
    @Transactional(readOnly = true)
    public Page<CourseListResponse> getCoursesByAuthor(UUID authorId, Pageable pageable) {
        Page<Course> courses = courseRepository.findByAuthorId(authorId, pageable);
        return courses.map(this::toCourseListResponse);
    }

    /**
     * Récupère le progrès d'un étudiant
     */
    @Transactional(readOnly = true)
    public StudentProgress getStudentProgress(UUID studentId, UUID courseId) {
        return studentProgressRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElse(null);
    }

    // Méthodes privées helper

    private void createCourseSections(Course course, List<LaTeXProcessorService.SectionData> sectionDataList) {
        for (LaTeXProcessorService.SectionData data : sectionDataList) {
            CourseSection section = new CourseSection();
            section.setCourse(course);
            section.setTitle(data.getTitle());
            section.setContent(data.getContent());
            section.setSectionType(data.getSectionType());
            section.setLevel(data.getLevel());
            section.setOrderIndex(data.getOrderIndex());
            section.setHasEquations(data.getHasEquations());
            section.setHasFigures(data.getHasFigures());
            section.setEquationCount(data.getEquationCount());
            section.setFigureCount(data.getFigureCount());

            courseSectionRepository.save(section);
        }
    }

    private void handleCourseImages(Course course, List<LaTeXProcessorService.ImageReference> imageRefs) {
        // Mapper les images LaTeX avec les fichiers sur le serveur
        List<SecureImageService.ImageMapping> mappings =
                imageService.mapLatexImages(imageRefs, SecureImageService.ImageContext.COURSE);

        for (SecureImageService.ImageMapping mapping : mappings) {
            CourseImage image = new CourseImage();
            image.setCourse(course);
            image.setFilename(mapping.getFilename());
            image.setOriginalFilename(mapping.getOriginalPath());
            image.setLatexReference(mapping.getLatexReference());
            image.setFilePath(mapping.getServerPath());
            image.setIsAvailable(mapping.isAvailable());

            if (mapping.isAvailable()) {
                // Récupérer les infos de l'image
                SecureImageService.ImageInfo info =
                        imageService.findImage(mapping.getFilename(), SecureImageService.ImageContext.COURSE);
                if (info != null) {
                    image.setMimeType(info.getMimeType());
                    image.setFileSize(info.getFileSize());
                    image.setChecksum(info.getChecksum());
                }
            }

            courseImageRepository.save(image);
        }
    }

    private SecureImageService.ValidationResult validateImages(Course course) {
        List<String> imageFilenames = courseImageRepository.findByCourse(course)
                .stream()
                .map(CourseImage::getFilename)
                .collect(Collectors.toList());

        return imageService.validateImagesAvailability(
                imageFilenames,
                SecureImageService.ImageContext.COURSE
        );
    }

    private void updateStudentProgress(User student, Course course) {
        StudentProgress progress = studentProgressRepository
                .findByStudentIdAndCourseId(student.getId(), course.getId())
                .orElseGet(() -> new StudentProgress(student, course));

        progress.setLastAccessed(LocalDateTime.now());

        // Compter les sections
        List<CourseSection> sections = courseSectionRepository.findByCourse(course);
        progress.setTotalSections(sections.size());

        studentProgressRepository.save(progress);
    }

    private CourseDetailResponse toCourseDetailResponse(Course course) {
        CourseDetailResponse response = new CourseDetailResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setLatexContent(course.getLatexContent());
        response.setAcademicLevel(course.getAcademicLevel());
        response.setBranch(course.getBranch());
        response.setChapterNumber(course.getChapterNumber());
        response.setStatus(course.getStatus());
        response.setPublishedAt(course.getPublishedAt());
        response.setAuthorName(course.getAuthor().getFullName());
        response.setAuthorId(course.getAuthor().getId());
        response.setViewCount(course.getViewCount());
        response.setEstimatedReadingTime(course.getEstimatedReadingTime());
        response.setTags(course.getTags());
        response.setCreatedAt(course.getCreatedAt());
        response.setUpdatedAt(course.getUpdatedAt());

        // Ajouter les sections
        List<CourseSection> sections = courseSectionRepository.findByCourse(course);
        List<CourseSectionResponse> sectionResponses = sections.stream()
                .map(this::toSectionResponse)
                .collect(Collectors.toList());
        response.setSections(sectionResponses);

        // Ajouter les images
        List<CourseImage> images = courseImageRepository.findByCourse(course);
        List<CourseDetailResponse.ImageInfo> imageInfos = images.stream()
                .map(img -> {
                    CourseDetailResponse.ImageInfo info = new CourseDetailResponse.ImageInfo();
                    info.setFilename(img.getFilename());
                    info.setUrl("/api/images/course/" + img.getFilename());
                    info.setAvailable(img.getIsAvailable());
                    info.setCaption(img.getCaption());
                    return info;
                })
                .collect(Collectors.toList());
        response.setImages(imageInfos);

        return response;
    }

    private CourseListResponse toCourseListResponse(Course course) {
        CourseListResponse response = new CourseListResponse();
        response.setId(course.getId());
        response.setTitle(course.getTitle());
        response.setDescription(course.getDescription());
        response.setAcademicLevel(course.getAcademicLevel());
        response.setBranch(course.getBranch());
        response.setChapterNumber(course.getChapterNumber());
        response.setStatus(course.getStatus());
        response.setPublishedAt(course.getPublishedAt());
        response.setAuthorName(course.getAuthor().getFullName());
        response.setViewCount(course.getViewCount());
        response.setEstimatedReadingTime(course.getEstimatedReadingTime());
        response.setTags(course.getTags());

        // Compter les sections
        Long sectionCount = courseSectionRepository.countByCourse(course);
        response.setSectionCount(sectionCount.intValue());

        return response;
    }

    private CourseSectionResponse toSectionResponse(CourseSection section) {
        CourseSectionResponse response = new CourseSectionResponse();
        response.setId(section.getId());
        response.setTitle(section.getTitle());
        response.setContent(section.getContent());
        response.setSectionType(section.getSectionType());
        response.setLevel(section.getLevel());
        response.setOrderIndex(section.getOrderIndex());
        response.setHasEquations(section.getHasEquations());
        response.setHasFigures(section.getHasFigures());
        response.setEquationCount(section.getEquationCount());
        response.setFigureCount(section.getFigureCount());
        response.setEstimatedReadingTime(section.getEstimatedReadingTime());
        return response;
    }
}