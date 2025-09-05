// ExamRepository.java
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Exam;
import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ExamStatus;
import com.imad.physics_api.model.enums.ExamType;
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
public interface ExamRepository extends JpaRepository<Exam, UUID> {

    // Find exam by ID (not deleted)
    Optional<Exam> findByIdAndIsDeletedFalse(UUID id);

    // Find exams by type and status
    Page<Exam> findByExamTypeAndStatusAndIsDeletedFalse(
            ExamType examType, ExamStatus status, Pageable pageable);

    // Find exams by academic level, branch and status
    Page<Exam> findByExamTypeAndAcademicLevelAndBranchAndStatusAndIsDeletedFalse(
            ExamType examType, AcademicLevel academicLevel, Branch branch,
            ExamStatus status, Pageable pageable);

    // Find exams by academic level
    Page<Exam> findByAcademicLevelAndStatusAndIsDeletedFalse(
            AcademicLevel academicLevel, ExamStatus status, Pageable pageable);

    // Find exams by branch
    Page<Exam> findByBranchAndStatusAndIsDeletedFalse(
            Branch branch, ExamStatus status, Pageable pageable);

    // Find exams by academic year
    Page<Exam> findByAcademicYearAndStatusAndIsDeletedFalse(
            String academicYear, ExamStatus status, Pageable pageable);

    // Search exams by title
    @Query("SELECT e FROM Exam e WHERE " +
            "e.isDeleted = false AND " +
            "e.status = :status AND " +
            "LOWER(e.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<Exam> findByTitleContainingIgnoreCaseAndStatusAndIsDeletedFalse(
            @Param("title") String title, @Param("status") ExamStatus status, Pageable pageable);

    // Complex filtering query
    @Query("SELECT e FROM Exam e WHERE " +
            "e.isDeleted = false AND " +
            "(:examType IS NULL OR e.examType = :examType) AND " +
            "(:academicLevel IS NULL OR e.academicLevel = :academicLevel) AND " +
            "(:branch IS NULL OR e.branch = :branch) AND " +
            "(:status IS NULL OR e.status = :status) AND " +
            "(:academicYear IS NULL OR e.academicYear = :academicYear)")
    Page<Exam> findExamsWithFilters(
            @Param("examType") ExamType examType,
            @Param("academicLevel") AcademicLevel academicLevel,
            @Param("branch") Branch branch,
            @Param("status") ExamStatus status,
            @Param("academicYear") String academicYear,
            Pageable pageable);

    // Find most viewed exams
    @Query("SELECT e FROM Exam e WHERE " +
            "e.isDeleted = false AND " +
            "e.status = :status " +
            "ORDER BY e.viewCount DESC")
    Page<Exam> findMostViewedExams(@Param("status") ExamStatus status, Pageable pageable);

    // Count exams by type and status
    long countByExamTypeAndStatusAndIsDeletedFalse(ExamType examType, ExamStatus status);

    // Count exams by academic level and branch
    long countByAcademicLevelAndBranchAndStatusAndIsDeletedFalse(
            AcademicLevel academicLevel, Branch branch, ExamStatus status);

    // Find exams with tags
    @Query("SELECT e FROM Exam e WHERE " +
            "e.isDeleted = false AND " +
            "e.status = :status AND " +
            "e.tags IS NOT NULL AND " +
            "LOWER(e.tags) LIKE LOWER(CONCAT('%', :tag, '%'))")
    Page<Exam> findByTagsContainingIgnoreCaseAndStatusAndIsDeletedFalse(
            @Param("tag") String tag, @Param("status") ExamStatus status, Pageable pageable);

    // Find exams by multiple academic years
    @Query("SELECT e FROM Exam e WHERE " +
            "e.isDeleted = false AND " +
            "e.status = :status AND " +
            "e.academicYear IN :academicYears")
    Page<Exam> findByAcademicYearInAndStatusAndIsDeletedFalse(
            @Param("academicYears") List<String> academicYears,
            @Param("status") ExamStatus status,
            Pageable pageable);
}
