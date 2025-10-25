package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.Course;
import com.imad.physics_api.model.enums.AcademicLevel;
import com.imad.physics_api.model.enums.Branch;
import com.imad.physics_api.model.enums.ContentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CourseRepository extends JpaRepository<Course, UUID> {

    Page<Course> findByStatus(ContentStatus status, Pageable pageable);

    Page<Course> findByAcademicLevel(AcademicLevel academicLevel, Pageable pageable);

    Page<Course> findByBranch(Branch branch, Pageable pageable);

    Page<Course> findByAcademicLevelAndBranch(AcademicLevel academicLevel, Branch branch, Pageable pageable);

    Page<Course> findByAuthorId(UUID authorId, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.isDeleted = false AND " +
            "(LOWER(c.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    Page<Course> searchByTitleOrDescription(@Param("query") String query, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = :status AND c.isDeleted = false " +
            "ORDER BY c.viewCount DESC")
    Page<Course> findPopularCourses(@Param("status") ContentStatus status, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND c.isDeleted = false " +
            "AND c.academicLevel = :level AND c.branch = :branch " +
            "ORDER BY c.chapterNumber ASC, c.orderIndex ASC")
    List<Course> findByLevelAndBranchOrdered(@Param("level") AcademicLevel level,
                                             @Param("branch") Branch branch);

    Long countByStatus(ContentStatus status);

    Long countByAuthorId(UUID authorId);
}
