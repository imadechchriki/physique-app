// ExamService.java - Updated with PDF protection
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
public class ExamService {

    private static final Logger logger = LoggerFactory.getLogger(ExamService.class);
    private static final String EXAMS_FOLDER = "exams";

    @Autowired
    private ExamRepository examRepository;

    @Autowired
    private ExamAccessRepository examAccessRepository;

    @Autowired
    private SupabaseStorageService supabaseStorageService;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private PDFProtectionService pdfProtectionService;

    @Value("${app.supabase.signed-url-expiry:300}")
    private int signedUrlExpirySeconds;

    /**
     * Upload a new exam (Admin only)
     */
    public Exam uploadExam(MultipartFile file, String title, String description,
                           ExamType examType, AcademicLevel academicLevel, Branch branch,
                           String academicYear, String tags) {
        User currentUser = getCurrentUser();

        if (!currentUser.isAdmin()) {
            throw new SecurityException("Only admins can upload exams");
        }

        // Upload file to Supabase
        SupabaseUploadResult uploadResult = supabaseStorageService.uploadFile(file, EXAMS_FOLDER);

        if (!uploadResult.isSuccess()) {
            activityLogService.logActivity(currentUser, EventType.EXAM_UPLOAD,
                    "Failed to upload exam: " + uploadResult.getErrorMessage(), false, uploadResult.getErrorMessage());
            throw new RuntimeException("Failed to upload file: " + uploadResult.getErrorMessage());
        }

        // Create exam entity
        Exam exam = new Exam(title, description, examType, academicLevel, branch,
                uploadResult.getFilePath(), file.getOriginalFilename(),
                uploadResult.getFileSize(), file.getContentType());
        exam.setAcademicYear(academicYear);
        exam.setTags(tags);

        Exam savedExam = examRepository.save(exam);

        // Log activity
        activityLogService.logActivity(currentUser, EventType.EXAM_UPLOAD,
                "Exam uploaded: " + title, "Exam", savedExam.getId().toString());

        logger.info("Exam uploaded successfully: {} by user: {}", title, currentUser.getEmail());
        return savedExam;
    }

    /**
     * Get all exams with filtering and pagination
     */
    @Transactional(readOnly = true)
    public Page<Exam> getAllExams(ExamType examType, AcademicLevel academicLevel,
                                  Branch branch, ExamStatus status, String academicYear, Pageable pageable) {
        return examRepository.findExamsWithFilters(examType, academicLevel, branch, status, academicYear, pageable);
    }

    /**
     * Get exam by ID (with permission check)
     */
    @Transactional(readOnly = true)
    public Optional<Exam> getExamById(UUID examId) {
        User currentUser = getCurrentUser();

        Optional<Exam> examOpt = examRepository.findByIdAndIsDeletedFalse(examId);

        if (examOpt.isPresent()) {
            Exam exam = examOpt.get();

            // Check if user can access this exam
            if (!canUserAccessExam(currentUser, exam)) {
                return Optional.empty();
            }
        }

        return examOpt;
    }

    /**
     * Generate protected signed URL for exam access with enhanced security
     */
    public FileAccessResponse generateExamAccessUrl(UUID examId, HttpServletRequest request) {
        User currentUser = getCurrentUser();

        Optional<Exam> examOpt = getExamById(examId);
        if (examOpt.isEmpty()) {
            throw new RuntimeException("Exam not found or access denied");
        }

        Exam exam = examOpt.get();

        // Generate signed URL from Supabase
        String signedUrl = supabaseStorageService.generateSignedUrl(exam.getFilePath());
        if (signedUrl == null) {
            throw new RuntimeException("Failed to generate access URL");
        }

        // Apply additional protection layers
        String protectedUrl = pdfProtectionService.generateProtectedAccess(
                currentUser, signedUrl, "Exam", exam.getId().toString(), request
        );

        // Log access
        logExamAccess(currentUser, exam, request);

        // Increment view count
        exam.incrementViewCount();
        examRepository.save(exam);

        // Return enhanced response with protection details
        return new FileAccessResponse(protectedUrl, signedUrlExpirySeconds);
    }

    /**
     * Update exam (Admin only)
     */
    public Exam updateExam(UUID examId, String title, String description,
                           ExamType examType, AcademicLevel academicLevel, Branch branch,
                           String academicYear, String tags, ExamStatus status) {
        User currentUser = getCurrentUser();

        if (!currentUser.isAdmin()) {
            throw new SecurityException("Only admins can update exams");
        }

        Exam exam = examRepository.findByIdAndIsDeletedFalse(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Update fields
        if (title != null) exam.setTitle(title);
        if (description != null) exam.setDescription(description);
        if (examType != null) exam.setExamType(examType);
        if (academicLevel != null) exam.setAcademicLevel(academicLevel);
        if (branch != null) exam.setBranch(branch);
        if (academicYear != null) exam.setAcademicYear(academicYear);
        if (tags != null) exam.setTags(tags);
        if (status != null) exam.setStatus(status);

        Exam updatedExam = examRepository.save(exam);

        // Log activity
        activityLogService.logActivity(currentUser, EventType.EXAM_UPDATE,
                "Exam updated: " + exam.getTitle(), "Exam", examId.toString());

        return updatedExam;
    }

    /**
     * Delete exam (Admin only)
     */
    public void deleteExam(UUID examId) {
        User currentUser = getCurrentUser();

        if (!currentUser.isAdmin()) {
            throw new SecurityException("Only admins can delete exams");
        }

        Exam exam = examRepository.findByIdAndIsDeletedFalse(examId)
                .orElseThrow(() -> new RuntimeException("Exam not found"));

        // Soft delete
        exam.setIsDeleted(true);
        examRepository.save(exam);

        // Log activity
        activityLogService.logActivity(currentUser, EventType.EXAM_DELETE,
                "Exam deleted: " + exam.getTitle(), "Exam", examId.toString());

        logger.info("Exam deleted: {} by user: {}", exam.getTitle(), currentUser.getEmail());
    }

    /**
     * Get exams for student based on their profile
     */
    @Transactional(readOnly = true)
    public Page<Exam> getExamsForStudent(ExamType examType, Pageable pageable) {
        User currentUser = getCurrentUser();

        if (currentUser.getProfile() != null &&
                currentUser.getProfile().getAcademicLevel() != null &&
                currentUser.getProfile().getBranch() != null) {

            return examRepository.findByExamTypeAndAcademicLevelAndBranchAndStatusAndIsDeletedFalse(
                    examType,
                    currentUser.getProfile().getAcademicLevel(),
                    currentUser.getProfile().getBranch(),
                    ExamStatus.ACTIVE,
                    pageable
            );
        } else {
            // Return all active exams if profile incomplete
            return examRepository.findByExamTypeAndStatusAndIsDeletedFalse(examType, ExamStatus.ACTIVE, pageable);
        }
    }

    private boolean canUserAccessExam(User user, Exam exam) {
        // Admin can access all exams
        if (user.isAdmin()) {
            return true;
        }

        // Exam must be active for students
        if (exam.getStatus() != ExamStatus.ACTIVE) {
            return false;
        }

        return true;
    }

    private void logExamAccess(User user, Exam exam, HttpServletRequest request) {
        try {
            // Create exam access record
            ExamAccess examAccess = new ExamAccess(user, exam);
            examAccess.setIpAddress(getClientIpAddress(request));
            examAccess.setUserAgent(request.getHeader("User-Agent"));
            examAccessRepository.save(examAccess);

            // Log in activity log
            activityLogService.logActivity(user, EventType.EXAM_VIEW,
                    "Accessed exam: " + exam.getTitle(), "Exam", exam.getId().toString());

        } catch (Exception e) {
            logger.error("Error logging exam access: {}", e.getMessage(), e);
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