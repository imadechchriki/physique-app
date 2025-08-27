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

    public void logActivity(User user, EventType eventType, String description) {
        logActivity(user, eventType, description, null, true, null);
    }

    public void logActivity(User user, EventType eventType, String description, HttpServletRequest request) {
        logActivity(user, eventType, description, request, true, null);
    }

    public void logActivity(User user, EventType eventType, String description,
                            HttpServletRequest request, boolean success, String errorMessage) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setEventType(eventType);
        log.setDescription(description);
        log.setSuccess(success);
        log.setErrorMessage(errorMessage);
        log.setTimestamp(LocalDateTime.now());

        if (request != null) {
            log.setUserAgent(request.getHeader("User-Agent"));
            log.setIpAddress(getClientIpAddress(request));
        }

        activityLogRepository.save(log);
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