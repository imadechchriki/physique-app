// CourseAccessRepository.java
package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.CourseAccess;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.entity.Course;
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
public interface CourseAccessRepository extends JpaRepository<CourseAccess, UUID> {

    // Find access logs by user
    Page<CourseAccess> findByUserAndIsDeletedFalse(User user, Pageable pageable);

    // Find access logs by course
    Page<CourseAccess> findByCourseAndIsDeletedFalse(Course course, Pageable pageable);

    // Find access logs by user and course
    List<CourseAccess> findByUserAndCourseAndIsDeletedFalseOrderByAccessedAtDesc(User user, Course course);

    // Find recent accesses
    @Query("SELECT ca FROM CourseAccess ca WHERE " +
            "ca.isDeleted = false AND " +
            "ca.accessedAt >= :since " +
            "ORDER BY ca.accessedAt DESC")
    Page<CourseAccess> findRecentAccesses(@Param("since") LocalDateTime since, Pageable pageable);

    // Count unique users who accessed a course
    @Query("SELECT COUNT(DISTINCT ca.user) FROM CourseAccess ca WHERE " +
            "ca.course = :course AND ca.isDeleted = false")
    long countUniqueUsersByCourse(@Param("course") Course course);

    // Get most accessed courses
    @Query("SELECT ca.course, COUNT(ca) as accessCount FROM CourseAccess ca WHERE " +
            "ca.isDeleted = false AND " +
            "ca.accessedAt >= :since " +
            "GROUP BY ca.course " +
            "ORDER BY accessCount DESC")
    List<Object[]> findMostAccessedCoursesSince(@Param("since") LocalDateTime since, Pageable pageable);

    // Count total accesses by date range
    long countByAccessedAtBetweenAndIsDeletedFalse(LocalDateTime start, LocalDateTime end);

    // Find user's last access to a course
    @Query("SELECT ca FROM CourseAccess ca WHERE " +
            "ca.user = :user AND ca.course = :course AND ca.isDeleted = false " +
            "ORDER BY ca.accessedAt DESC")
    List<CourseAccess> findUserLastAccessToCourse(@Param("user") User user, @Param("course") Course course, Pageable pageable);
}