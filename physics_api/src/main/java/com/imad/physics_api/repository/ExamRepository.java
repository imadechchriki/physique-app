// ========== ExamRepository.java ==========
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Exam;
import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ContentStatus;
import com.imad.physics_api.model.enums.ExamType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExamRepository extends JpaRepository<Exam, UUID> {

    Page<Exam> findByStatus(ContentStatus status, Pageable pageable);

    Page<Exam> findByExamType(ExamType examType, Pageable pageable);

    Page<Exam> findByAcademicLevel(AcademicLevel academicLevel, Pageable pageable);

    Page<Exam> findByBranch(Branch branch, Pageable pageable);

    Page<Exam> findByAcademicLevelAndBranch(AcademicLevel academicLevel, Branch branch, Pageable pageable);

    Page<Exam> findByAuthorId(UUID authorId, Pageable pageable);

    @Query("SELECT e FROM Exam e WHERE e.isDeleted = false AND " +
            "(LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Exam> searchByTitleOrDescription(@Param("query") String query, Pageable pageable);

    @Query("SELECT e FROM Exam e WHERE e.academicYear = :year AND e.session = :session " +
            "AND e.status = 'PUBLISHED' AND e.isDeleted = false")
    List<Exam> findByAcademicYearAndSession(@Param("year") String year,
                                            @Param("session") String session);

    Long countByStatus(ContentStatus status);

    Long countByAuthorId(UUID authorId);
}