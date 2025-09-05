// CourseRepository.java
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Course;
import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    // Find course by ID (not deleted)
    Optional<Course> findByIdAndIsDeletedFalse(UUID id);

    // Find courses by status
    Page<Course> findByStatusAndIsDeletedFalse(CourseStatus status, Pageable pageable);

    // Find courses by academic level and branch
    Page<Course> findByAcademicLevelAndBranchAndStatusAndIsDeletedFalse(
            AcademicLevel academicLevel, Branch branch, CourseStatus status, Pageable pageable);

    // Find courses by academic level
    Page<Course> findByAcademicLevelAndStatusAndIsDeletedFalse(
            AcademicLevel academicLevel, CourseStatus status, Pageable pageable);

    // Find courses by branch
    Page<Course> findByBranchAndStatusAndIsDeletedFalse(
            Branch branch, CourseStatus status, Pageable pageable);

    // Search courses by title
    @Query("SELECT c FROM Course c WHERE " +
            "c.isDeleted = false AND " +
            "c.status = :status AND " +
            "LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<Course> findByTitleContainingIgnoreCaseAndStatusAndIsDeletedFalse(
            @Param("title") String title, @Param("status") CourseStatus status, Pageable pageable);

    // Complex filtering query
    @Query("SELECT c FROM Course c WHERE " +
            "c.isDeleted = false AND " +
            "(:academicLevel IS NULL OR c.academicLevel = :academicLevel) AND " +
            "(:branch IS NULL OR c.branch = :branch) AND " +
            "(:status IS NULL OR c.status = :status)")
    Page<Course> findCoursesWithFilters(
            @Param("academicLevel") AcademicLevel academicLevel,
            @Param("branch") Branch branch,
            @Param("status") CourseStatus status,
            Pageable pageable);

    // Find most viewed courses
    @Query("SELECT c FROM Course c WHERE " +
            "c.isDeleted = false AND " +
            "c.status = :status " +
            "ORDER BY c.viewCount DESC")
    Page<Course> findMostViewedCourses(@Param("status") CourseStatus status, Pageable pageable);

    // Count courses by status
    long countByStatusAndIsDeletedFalse(CourseStatus status);

    // Count courses by academic level and branch
    long countByAcademicLevelAndBranchAndStatusAndIsDeletedFalse(
            AcademicLevel academicLevel, Branch branch, CourseStatus status);

    // Find courses with tags
    @Query("SELECT c FROM Course c WHERE " +
            "c.isDeleted = false AND " +
            "c.status = :status AND " +
            "c.tags IS NOT NULL AND " +
            "LOWER(c.tags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    Page<Course> findByTagsContainingIgnoreCaseAndStatusAndIsDeletedFalse(
            @Param("tag") String tag, @Param("status") CourseStatus status, Pageable pageable);
}
