// ========== CourseImageRepository.java ==========
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Course;
import com.imad.physics_api.model.entity.CourseImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CourseImageRepository extends JpaRepository<CourseImage, UUID> {

    List<CourseImage> findByCourse(Course course);

    Optional<CourseImage> findByCourseAndFilename(Course course, String filename);

    @Query("SELECT ci FROM CourseImage ci WHERE ci.course.id = :courseId")
    List<CourseImage> findByCourseId(@Param("courseId") UUID courseId);

    @Query("SELECT ci FROM CourseImage ci WHERE ci.isAvailable = false")
    List<CourseImage> findUnavailableImages();

    @Modifying
    @Query("DELETE FROM CourseImage ci WHERE ci.course = :course")
    void deleteAllByCourse(@Param("course") Course course);
}
