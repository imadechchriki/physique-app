// ========== StudentProgressRepository.java ==========
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Course;
import com.imad.physics_api.model.entity.StudentProgress;
import com.imad.physics_api.model.entity.User;
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
public interface StudentProgressRepository extends JpaRepository<StudentProgress, UUID> {

    Optional<StudentProgress> findByStudentIdAndCourseId(UUID studentId, UUID courseId);

    Optional<StudentProgress> findByStudentAndCourse(User student, Course course);

    List<StudentProgress> findByStudent(User student);

    List<StudentProgress> findByCourse(Course course);

    Page<StudentProgress> findByStudentId(UUID studentId, Pageable pageable);

    @Query("SELECT sp FROM StudentProgress sp WHERE sp.student.id = :studentId " +
            "AND sp.isCompleted = true")
    List<StudentProgress> findCompletedCoursesByStudent(@Param("studentId") UUID studentId);

    @Query("SELECT sp FROM StudentProgress sp WHERE sp.student.id = :studentId " +
            "AND sp.isCompleted = false ORDER BY sp.lastAccessed DESC")
    List<StudentProgress> findInProgressCoursesByStudent(@Param("studentId") UUID studentId);

    @Query("SELECT sp FROM StudentProgress sp WHERE sp.student.id = :studentId " +
            "AND sp.isFavorite = true")
    List<StudentProgress> findFavoriteCoursesByStudent(@Param("studentId") UUID studentId);

    Long countByStudentAndIsCompleted(User student, Boolean isCompleted);

    @Query("SELECT AVG(sp.progressPercentage) FROM StudentProgress sp WHERE sp.student.id = :studentId")
    Double getAverageProgressByStudent(@Param("studentId") UUID studentId);
}