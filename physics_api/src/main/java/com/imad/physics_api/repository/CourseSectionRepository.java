// ========== CourseSectionRepository.java ==========
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Course;
import com.imad.physics_api.model.entity.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, UUID> {

    List<CourseSection> findByCourse(Course course);

    List<CourseSection> findByCourseOrderByOrderIndexAsc(Course course);

    @Query("SELECT cs FROM CourseSection cs WHERE cs.course.id = :courseId " +
            "ORDER BY cs.orderIndex ASC")
    List<CourseSection> findByCourseId(@Param("courseId") UUID courseId);

    Long countByCourse(Course course);

    @Modifying
    @Query("DELETE FROM CourseSection cs WHERE cs.course = :course")
    void deleteAllByCourse(@Param("course") Course course);
}