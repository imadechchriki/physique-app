// ========== ExamSectionRepository.java ==========
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Exam;
import com.imad.physics_api.model.entity.ExamSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ExamSectionRepository extends JpaRepository<ExamSection, UUID> {

    List<ExamSection> findByExam(Exam exam);

    List<ExamSection> findByExamOrderByOrderIndexAsc(Exam exam);

    @Query("SELECT es FROM ExamSection es WHERE es.exam.id = :examId " +
            "ORDER BY es.orderIndex ASC")
    List<ExamSection> findByExamId(@Param("examId") UUID examId);

    Long countByExam(Exam exam);

    @Modifying
    @Query("DELETE FROM ExamSection es WHERE es.exam = :exam")
    void deleteAllByExam(@Param("exam") Exam exam);
}