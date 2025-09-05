// ExamController.java - CORRECTED VERSION
package com.imad.physics_api.controller;

import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.dto.response.ExamDto;
import com.imad.physics_api.dto.response.FileAccessResponse;
import com.imad.physics_api.model.entity.Exam;
import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ExamStatus;
import com.imad.physics_api.model.enums.ExamType;
import com.imad.physics_api.service.ExamService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.NotBlank;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/exams")
@Tag(name = "Exams", description = "Exam management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class ExamController {

    private static final Logger logger = LoggerFactory.getLogger(ExamController.class);

    @Autowired
    private ExamService examService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload a new exam", description = "Upload a PDF exam (Admin only)")
    public ResponseEntity<ApiResponse<ExamDto>> uploadExam(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") @NotBlank String title,
            @RequestParam("description") String description,
            @RequestParam("examType") ExamType examType,
            @RequestParam("academicLevel") AcademicLevel academicLevel,
            @RequestParam("branch") Branch branch,
            @RequestParam(value = "academicYear", required = false) String academicYear,
            @RequestParam(value = "tags", required = false) String tags) {

        try {
            Exam exam = examService.uploadExam(file, title, description, examType, academicLevel, branch, academicYear, tags);
            ExamDto examDto = ExamDto.fromEntity(exam);

            return ResponseEntity.ok(ApiResponse.success("Exam uploaded successfully", examDto));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error uploading exam: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload exam: " + e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Get all exams", description = "Get exams with filtering and pagination")
    public ResponseEntity<ApiResponse<Page<ExamDto>>> getAllExams(
            @Parameter(description = "Exam type filter")
            @RequestParam(required = false) ExamType examType,
            @Parameter(description = "Academic level filter")
            @RequestParam(required = false) AcademicLevel academicLevel,
            @Parameter(description = "Branch filter")
            @RequestParam(required = false) Branch branch,
            @Parameter(description = "Status filter")
            @RequestParam(required = false) ExamStatus status,
            @Parameter(description = "Academic year filter")
            @RequestParam(required = false) String academicYear,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field")
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction")
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
            Pageable pageable = PageRequest.of(page, size, sort);

            Page<Exam> exams = examService.getAllExams(examType, academicLevel, branch, status, academicYear, pageable);
            Page<ExamDto> examDtos = exams.map(ExamDto::fromEntity);

            return ResponseEntity.ok(ApiResponse.success("Exams retrieved successfully", examDtos));
        } catch (Exception e) {
            logger.error("Error retrieving exams: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve exams"));
        }
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get exams for student", description = "Get exams filtered by student's profile")
    public ResponseEntity<ApiResponse<Page<ExamDto>>> getExamsForStudent(
            @Parameter(description = "Exam type filter")
            @RequestParam(required = false) ExamType examType,
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<Exam> exams = examService.getExamsForStudent(examType, pageable);
            Page<ExamDto> examDtos = exams.map(ExamDto::fromEntity);

            return ResponseEntity.ok(ApiResponse.success("Student exams retrieved successfully", examDtos));
        } catch (Exception e) {
            logger.error("Error retrieving student exams: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve exams"));
        }
    }

    @GetMapping("/{examId}")
    @Operation(summary = "Get exam by ID", description = "Get a specific exam by its ID")
    public ResponseEntity<ApiResponse<ExamDto>> getExamById(@PathVariable UUID examId) {
        try {
            Optional<Exam> examOpt = examService.getExamById(examId);

            if (examOpt.isPresent()) {
                ExamDto examDto = ExamDto.fromEntity(examOpt.get());
                return ResponseEntity.ok(ApiResponse.success("Exam retrieved successfully", examDto));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Exam not found or access denied"));
            }
        } catch (Exception e) {
            logger.error("Error retrieving exam {}: {}", examId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve exam"));
        }
    }


    @PutMapping("/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update exam", description = "Update exam details (Admin only)")
    public ResponseEntity<ApiResponse<ExamDto>> updateExam(
            @PathVariable UUID examId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) ExamType examType,
            @RequestParam(required = false) AcademicLevel academicLevel,
            @RequestParam(required = false) Branch branch,
            @RequestParam(required = false) String academicYear,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) ExamStatus status) {

        try {
            Exam exam = examService.updateExam(examId, title, description, examType, academicLevel, branch, academicYear, tags, status);
            ExamDto examDto = ExamDto.fromEntity(exam);

            return ResponseEntity.ok(ApiResponse.success("Exam updated successfully", examDto));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating exam {}: {}", examId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update exam"));
        }
    }

    @DeleteMapping("/{examId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete exam", description = "Delete an exam (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteExam(@PathVariable UUID examId) {
        try {
            examService.deleteExam(examId);
            return ResponseEntity.ok(ApiResponse.success("Exam deleted successfully"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting exam {}: {}", examId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete exam"));
        }
    }
}