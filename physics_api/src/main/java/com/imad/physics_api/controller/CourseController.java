// CourseController.java - CORRECTED VERSION
package com.imad.physics_api.controller;

import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.dto.response.CourseDto;
import com.imad.physics_api.dto.response.FileAccessResponse;
import com.imad.physics_api.model.entity.Course;
import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.CourseStatus;
import com.imad.physics_api.service.CourseService;
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
@RequestMapping("/courses")
@Tag(name = "Courses", description = "Course management endpoints")
@SecurityRequirement(name = "bearerAuth")
public class CourseController {

    private static final Logger logger = LoggerFactory.getLogger(CourseController.class);

    @Autowired
    private CourseService courseService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Upload a new course", description = "Upload a PDF course (Admin only)")
    public ResponseEntity<ApiResponse<CourseDto>> uploadCourse(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") @NotBlank String title,
            @RequestParam("description") String description,
            @RequestParam("academicLevel") AcademicLevel academicLevel,
            @RequestParam("branch") Branch branch,
            @RequestParam(value = "tags", required = false) String tags) {

        try {
            Course course = courseService.uploadCourse(file, title, description, academicLevel, branch, tags);
            CourseDto courseDto = CourseDto.fromEntity(course);

            return ResponseEntity.ok(ApiResponse.success("Course uploaded successfully", courseDto));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error uploading course: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to upload course: " + e.getMessage()));
        }
    }

    @GetMapping
    @Operation(summary = "Get all courses", description = "Get courses with filtering and pagination")
    public ResponseEntity<ApiResponse<Page<CourseDto>>> getAllCourses(
            @Parameter(description = "Academic level filter")
            @RequestParam(required = false) AcademicLevel academicLevel,
            @Parameter(description = "Branch filter")
            @RequestParam(required = false) Branch branch,
            @Parameter(description = "Status filter")
            @RequestParam(required = false) CourseStatus status,
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

            Page<Course> courses = courseService.getAllCourses(academicLevel, branch, status, pageable);
            Page<CourseDto> courseDtos = courses.map(CourseDto::fromEntity);

            return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courseDtos));
        } catch (Exception e) {
            logger.error("Error retrieving courses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve courses"));
        }
    }

    @GetMapping("/student")
    @PreAuthorize("hasRole('STUDENT')")
    @Operation(summary = "Get courses for student", description = "Get courses filtered by student's profile")
    public ResponseEntity<ApiResponse<Page<CourseDto>>> getCoursesForStudent(
            @Parameter(description = "Page number (0-based)")
            @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size")
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
            Page<Course> courses = courseService.getCoursesForStudent(pageable);
            Page<CourseDto> courseDtos = courses.map(CourseDto::fromEntity);

            return ResponseEntity.ok(ApiResponse.success("Student courses retrieved successfully", courseDtos));
        } catch (Exception e) {
            logger.error("Error retrieving student courses: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve courses"));
        }
    }

    @GetMapping("/{courseId}")
    @Operation(summary = "Get course by ID", description = "Get a specific course by its ID")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseById(@PathVariable UUID courseId) {
        try {
            Optional<Course> courseOpt = courseService.getCourseById(courseId);

            if (courseOpt.isPresent()) {
                CourseDto courseDto = CourseDto.fromEntity(courseOpt.get());
                return ResponseEntity.ok(ApiResponse.success("Course retrieved successfully", courseDto));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("Course not found or access denied"));
            }
        } catch (Exception e) {
            logger.error("Error retrieving course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to retrieve course"));
        }
    }

    // In CourseController.java
    @GetMapping("/{courseId}/access")
    public ResponseEntity<ApiResponse<FileAccessResponse>> getCourseAccessUrl(
            @PathVariable UUID courseId, HttpServletRequest request) {
        try {
            FileAccessResponse response = courseService.generateCourseAccessUrl(courseId, request);
            return ResponseEntity.ok(ApiResponse.success("Protected access URL generated", response));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to generate access URL"));
        }
    }

    @PutMapping("/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Update course", description = "Update course details (Admin only)")
    public ResponseEntity<ApiResponse<CourseDto>> updateCourse(
            @PathVariable UUID courseId,
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) AcademicLevel academicLevel,
            @RequestParam(required = false) Branch branch,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) CourseStatus status) {

        try {
            Course course = courseService.updateCourse(courseId, title, description, academicLevel, branch, tags, status);
            CourseDto courseDto = CourseDto.fromEntity(course);

            return ResponseEntity.ok(ApiResponse.success("Course updated successfully", courseDto));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error updating course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to update course"));
        }
    }

    @DeleteMapping("/{courseId}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete course", description = "Delete a course (Admin only)")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable UUID courseId) {
        try {
            courseService.deleteCourse(courseId);
            return ResponseEntity.ok(ApiResponse.success("Course deleted successfully"));
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(ApiResponse.error("Access denied: " + e.getMessage()));
        } catch (Exception e) {
            logger.error("Error deleting course {}: {}", courseId, e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to delete course"));
        }
    }
}
