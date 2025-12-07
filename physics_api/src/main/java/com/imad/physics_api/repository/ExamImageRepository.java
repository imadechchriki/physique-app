// ========== ExamImageRepository.java ==========
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Exam;
import com.imad.physics_api.model.entity.ExamImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExamImageRepository extends JpaRepository<ExamImage, UUID> {

    List<ExamImage> findByExam(Exam exam);

    Optional<ExamImage> findByExamAndFilename(Exam exam, String filename);

    @Query("SELECT ei FROM ExamImage ei WHERE ei.exam.id = :examId")
    List<ExamImage> findByExamId(@Param("examId") UUID examId);

    @Query("SELECT ei FROM ExamImage ei WHERE ei.isAvailable = false")
    List<ExamImage> findUnavailableImages();

    @Modifying
    @Query("DELETE FROM ExamImage ei WHERE ei.exam = :exam")
    void deleteAllByExam(@Param("exam") Exam exam);
}