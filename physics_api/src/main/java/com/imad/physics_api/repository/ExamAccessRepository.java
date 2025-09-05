// ExamAccessRepository.java
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.ExamAccess;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.entity.Exam;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface ExamAccessRepository extends JpaRepository<ExamAccess, UUID> {

    // Find access logs by user
    Page<ExamAccess> findByUserAndIsDeletedFalse(User user, Pageable pageable);

    // Find access logs by exam
    Page<ExamAccess> findByExamAndIsDeletedFalse(Exam exam, Pageable pageable);

    // Find access logs by user and exam
    List<ExamAccess> findByUserAndExamAndIsDeletedFalseOrderByAccessedAtDesc(User user, Exam exam);

    // Find recent accesses
    @Query("SELECT ea FROM ExamAccess ea WHERE " +
            "ea.isDeleted = false AND " +
            "ea.accessedAt >= :since " +
            "ORDER BY ea.accessedAt DESC")
    Page<ExamAccess> findRecentAccesses(@Param("since") LocalDateTime since, Pageable pageable);

    // Count unique users who accessed an exam
    @Query("SELECT COUNT(DISTINCT ea.user) FROM ExamAccess ea WHERE " +
            "ea.exam = :exam AND ea.isDeleted = false")
    long countUniqueUsersByExam(@Param("exam") Exam exam);

    // Get most accessed exams
    @Query("SELECT ea.exam, COUNT(ea) as accessCount FROM ExamAccess ea WHERE " +
            "ea.isDeleted = false AND " +
            "ea.accessedAt >= :since " +
            "GROUP BY ea.exam " +
            "ORDER BY accessCount DESC")
    List<Object[]> findMostAccessedExamsSince(@Param("since") LocalDateTime since, Pageable pageable);

    // Count total accesses by date range
    long countByAccessedAtBetweenAndIsDeletedFalse(LocalDateTime start, LocalDateTime end);

    // Find user's last access to an exam
    @Query("SELECT ea FROM ExamAccess ea WHERE " +
            "ea.user = :user AND ea.exam = :exam AND ea.isDeleted = false " +
            "ORDER BY ea.accessedAt DESC")
    List<ExamAccess> findUserLastAccessToExam(@Param("user") User user, @Param("exam") Exam exam, Pageable pageable);
}