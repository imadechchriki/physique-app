// Updated ActivityLogService.java
package com.imad.physics_api.service;

import com.imad.physics_api.model.entity.ActivityLog;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.enums.EventType;
import com.imad.physics_api.repository.ActivityLogRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    /**
     * Log activity with just description
     */
    public void logActivity(User user, EventType eventType, String description) {
        logActivity(user, eventType, description, null, null, null, true, null);
    }

    /**
     * Log activity with description and HTTP request
     */
    public void logActivity(User user, EventType eventType, String description, HttpServletRequest request) {
        logActivity(user, eventType, description, null, null, request, true, null);
    }

    /**
     * Log activity with description, entity type and entity ID
     */
    public void logActivity(User user, EventType eventType, String description, String entityType, String entityId) {
        logActivity(user, eventType, description, entityType, entityId, null, true, null);
    }

    /**
     * Log activity with description, success flag and error message
     */
    public void logActivity(User user, EventType eventType, String description, boolean success, String errorMessage) {
        logActivity(user, eventType, description, null, null, null, success, errorMessage);
    }

    /**
     * Log activity with HTTP request, success flag and error message
     */
    public void logActivity(User user, EventType eventType, String description,
                            HttpServletRequest request, boolean success, String errorMessage) {
        logActivity(user, eventType, description, null, null, request, success, errorMessage);
    }

    /**
     * Log activity with entity details and HTTP request
     */
    public void logActivity(User user, EventType eventType, String description,
                            String entityType, String entityId, HttpServletRequest request) {
        logActivity(user, eventType, description, entityType, entityId, request, true, null);
    }

    /**
     * Complete log activity method with all parameters
     */
    public void logActivity(User user, EventType eventType, String description,
                            String entityType, String entityId, HttpServletRequest request,
                            boolean success, String errorMessage) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setEventType(eventType);
        log.setDescription(description);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setSuccess(success);
        log.setErrorMessage(errorMessage);
        log.setTimestamp(LocalDateTime.now());

        if (request != null) {
            log.setUserAgent(request.getHeader("User-Agent"));
            log.setIpAddress(getClientIpAddress(request));
        }

        activityLogRepository.save(log);
    }

    /**
     * Log activity for specific entity with success/error handling
     */
    public void logEntityActivity(User user, EventType eventType, String description,
                                  String entityType, String entityId, boolean success, String errorMessage) {
        logActivity(user, eventType, description, entityType, entityId, null, success, errorMessage);
    }

    /**
     * Log failed activity with error message
     */
    public void logFailedActivity(User user, EventType eventType, String description, String errorMessage) {
        logActivity(user, eventType, description, null, null, null, false, errorMessage);
    }

    /**
     * Log failed activity with entity details
     */
    public void logFailedEntityActivity(User user, EventType eventType, String description,
                                        String entityType, String entityId, String errorMessage) {
        logActivity(user, eventType, description, entityType, entityId, null, false, errorMessage);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}