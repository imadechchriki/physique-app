
// Updated CourseService.java with PDF protection
package com.imad.physics_api.service;

import com.imad.physics_api.dto.response.FileAccessResponse;
import com.imad.physics_api.model.entity.*;
import com.imad.physics_api.model.enums.*;
import com.imad.physics_api.repository.*;
import com.imad.physics_api.service.SupabaseStorageService.SupabaseUploadResult;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class CourseService {

    private static final Logger logger = LoggerFactory.getLogger(CourseService.class);
    private static final String COURSES_FOLDER = "courses";

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseAccessRepository courseAccessRepository;

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private PDFProtectionService pdfProtectionService;

    @Value("${app.supabase.signed-url-expiry:300}")
    private int signedUrlExpirySeconds;

    /**
     * Upload a new course (Admin only)
     */
    public Course uploadCourse(MultipartFile file, String title, String description,
                               AcademicLevel academicLevel, Branch branch, String tags) {
        User currentUser = getCurrentUser();

        if (!currentUser.isAdmin()) {
            throw new SecurityException("Only admins can upload courses");
        }

        // Upload file to Supabase
        SupabaseUploadResult uploadResult = supabaseStorageService.uploadFile(file, COURSES_FOLDER);

        if (!uploadResult.isSuccess()) {
            activityLogService.logActivity(currentUser, EventType.COURSE_UPLOAD,
                    "Failed to upload course: " + uploadResult.getErrorMessage(), false, uploadResult.getErrorMessage());
            throw new RuntimeException("Failed to upload file: " + uploadResult.getErrorMessage());
        }

        // Create course entity
        Course course = new Course(title, description, academicLevel, branch,
                uploadResult.getFilePath(), file.getOriginalFilename(),
                uploadResult.getFileSize(), file.getContentType());
        course.setTags(tags);

        Course savedCourse = courseRepository.save(course);

        // Log activity
        activityLogService.logActivity(currentUser, EventType.COURSE_UPLOAD,
                "Course uploaded: " + title, "Course", savedCourse.getId().toString());

        logger.info("Course uploaded successfully: {} by user: {}", title, currentUser.getEmail());
        return savedCourse;
    }

    /**
     * Get all courses with filtering and pagination
     */
    @Transactional(readOnly = true)
    public Page<Course> getAllCourses(AcademicLevel academicLevel, Branch branch,
                                      CourseStatus status, Pageable pageable) {
        return courseRepository.findCoursesWithFilters(academicLevel, branch, status, pageable);
    }

    /**
     * Get course by ID (with permission check)
     */
    @Transactional(readOnly = true)
    public Optional<Course> getCourseById(UUID courseId) {
        User currentUser = getCurrentUser();

        Optional<Course> courseOpt = courseRepository.findByIdAndIsDeletedFalse(courseId);

        if (courseOpt.isPresent()) {
            Course course = courseOpt.get();

            // Check if user can access this course
            if (!canUserAccessCourse(currentUser, course)) {
                return Optional.empty();
            }
        }

        return courseOpt;
    }

    /**
     * Generate protected signed URL for course access with enhanced security
     */
    public FileAccessResponse generateCourseAccessUrl(UUID courseId, HttpServletRequest request) {
        User currentUser = getCurrentUser();

        Optional<Course> courseOpt = getCourseById(courseId);
        if (courseOpt.isEmpty()) {
            throw new RuntimeException("Course not found or access denied");
        }

        Course course = courseOpt.get();

        // Generate signed URL from Supabase
        String signedUrl = supabaseStorageService.generateSignedUrl(course.getFilePath());
        if (signedUrl == null) {
            throw new RuntimeException("Failed to generate access URL");
        }

        // Apply additional protection layers
        String protectedUrl = pdfProtectionService.generateProtectedAccess(
                currentUser, signedUrl, "Course", course.getId().toString(), request
        );

        // Log access
        logCourseAccess(currentUser, course, request);

        // Increment view count
        course.incrementViewCount();
        courseRepository.save(course);

        // Return enhanced response with protection details
        return new FileAccessResponse(protectedUrl, signedUrlExpirySeconds);
    }

    /**
     * Update course (Admin only)
     */
    public Course updateCourse(UUID courseId, String title, String description,
                               AcademicLevel academicLevel, Branch branch, String tags, CourseStatus status) {
        User currentUser = getCurrentUser();

        if (!currentUser.isAdmin()) {
            throw new SecurityException("Only admins can update courses");
        }

        Course course = courseRepository.findByIdAndIsDeletedFalse(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Update fields
        if (title != null) course.setTitle(title);
        if (description != null) course.setDescription(description);
        if (academicLevel != null) course.setAcademicLevel(academicLevel);
        if (branch != null) course.setBranch(branch);
        if (tags != null) course.setTags(tags);
        if (status != null) course.setStatus(status);

        Course updatedCourse = courseRepository.save(course);

        // Log activity
        activityLogService.logActivity(currentUser, EventType.COURSE_UPDATE,
                "Course updated: " + course.getTitle(), "Course", courseId.toString());

        return updatedCourse;
    }

    /**
     * Delete course (Admin only)
     */
    public void deleteCourse(UUID courseId) {
        User currentUser = getCurrentUser();

        if (!currentUser.isAdmin()) {
            throw new SecurityException("Only admins can delete courses");
        }

        Course course = courseRepository.findByIdAndIsDeletedFalse(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        // Soft delete
        course.setIsDeleted(true);
        courseRepository.save(course);

        // Log activity
        activityLogService.logActivity(currentUser, EventType.COURSE_DELETE,
                "Course deleted: " + course.getTitle(), "Course", courseId.toString());

        logger.info("Course deleted: {} by user: {}", course.getTitle(), currentUser.getEmail());
    }

    /**
     * Get courses for student based on their profile
     */
    @Transactional(readOnly = true)
    public Page<Course> getCoursesForStudent(Pageable pageable) {
        User currentUser = getCurrentUser();

        if (currentUser.getProfile() != null &&
                currentUser.getProfile().getAcademicLevel() != null &&
                currentUser.getProfile().getBranch() != null) {

            return courseRepository.findByAcademicLevelAndBranchAndStatusAndIsDeletedFalse(
                    currentUser.getProfile().getAcademicLevel(),
                    currentUser.getProfile().getBranch(),
                    CourseStatus.ACTIVE,
                    pageable
            );
        } else {
            // Return all active courses if profile incomplete
            return courseRepository.findByStatusAndIsDeletedFalse(CourseStatus.ACTIVE, pageable);
        }
    }

    private boolean canUserAccessCourse(User user, Course course) {
        // Admin can access all courses
        if (user.isAdmin()) {
            return true;
        }

        // Course must be active for students
        if (course.getStatus() != CourseStatus.ACTIVE) {
            return false;
        }

        return true;
    }

    private void logCourseAccess(User user, Course course, HttpServletRequest request) {
        try {
            // Create course access record
            CourseAccess courseAccess = new CourseAccess(user, course);
            courseAccess.setIpAddress(getClientIpAddress(request));
            courseAccess.setUserAgent(request.getHeader("User-Agent"));
            courseAccessRepository.save(courseAccess);

            // Log in activity log
            activityLogService.logActivity(user, EventType.COURSE_VIEW,
                    "Accessed course: " + course.getTitle(), "Course", course.getId().toString());

        } catch (Exception e) {
            logger.error("Error logging course access: {}", e.getMessage(), e);
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            return (User) authentication.getPrincipal();
        }
        throw new SecurityException("User not authenticated");
    }
}