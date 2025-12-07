package com.imad.physics_api.repository;

import com.imad.physics_api.model.entity.ActivityLog;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.enums.EventType;
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
public interface ActivityLogRepository extends JpaRepository<ActivityLog, UUID> {

    Page<ActivityLog> findByUser(User user, Pageable pageable);

    Page<ActivityLog> findByEventType(EventType eventType, Pageable pageable);

    @Query("SELECT al FROM ActivityLog al WHERE al.user = :user AND al.eventType = :eventType")
    Page<ActivityLog> findByUserAndEventType(@Param("user") User user,
                                             @Param("eventType") EventType eventType,
                                             Pageable pageable);

    @Query("SELECT al FROM ActivityLog al WHERE al.timestamp >= :startDate AND al.timestamp <= :endDate")
    Page<ActivityLog> findByTimestampBetween(@Param("startDate") LocalDateTime startDate,
                                             @Param("endDate") LocalDateTime endDate,
                                             Pageable pageable);

    @Query("SELECT al FROM ActivityLog al WHERE al.user = :user AND al.success = false")
    List<ActivityLog> findFailedActivitiesByUser(@Param("user") User user);

    @Query("SELECT COUNT(al) FROM ActivityLog al WHERE al.eventType = :eventType AND al.timestamp >= :startDate")
    long countByEventTypeAfterDate(@Param("eventType") EventType eventType,
                                   @Param("startDate") LocalDateTime startDate);
}