// PDFProtectionService.java - Additional layer for PDF protection
package com.imad.physics_api.service;

import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.enums.EventType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class PDFProtectionService {

    private static final Logger logger = LoggerFactory.getLogger(PDFProtectionService.class);

    @Autowired
    private ActivityLogService activityLogService;

    @Value("${app.pdf.max-access-per-hour:10}")
    private int maxAccessPerHour;

    @Value("${app.pdf.suspicious-threshold:5}")
    private int suspiciousThreshold;

    // Track access frequency per user per hour
    private final Map<String, UserAccessTracker> accessTrackers = new ConcurrentHashMap<>();

    /**
     * Generate protected PDF access with rate limiting and monitoring
     */
    public String generateProtectedAccess(User user, String originalUrl,
                                          String entityType, String entityId,
                                          HttpServletRequest request) {

        String userKey = user.getId().toString();
        UserAccessTracker tracker = accessTrackers.computeIfAbsent(userKey, k -> new UserAccessTracker());

        // Check rate limiting
        if (!tracker.canAccess()) {
            logger.warn("Rate limit exceeded for user: {} ({})", user.getEmail(), userKey);
            activityLogService.logActivity(user, EventType.SUSPICIOUS_ACTIVITY,
                    "PDF access rate limit exceeded", entityType, entityId, request, false, "Too many requests");
            throw new SecurityException("Too many PDF access requests. Please wait before trying again.");
        }

        // Track this access
        tracker.recordAccess();

        // Check for suspicious activity
        if (tracker.getAccessCount() > suspiciousThreshold) {
            logger.warn("Suspicious PDF access pattern detected for user: {} ({})", user.getEmail(), userKey);
            activityLogService.logActivity(user, EventType.SUSPICIOUS_ACTIVITY,
                    "Unusual PDF access pattern detected", entityType, entityId, request);
        }

        // Log the access
        activityLogService.logActivity(user, EventType.FILE_ACCESS,
                "Protected PDF access granted", entityType, entityId, request);

        // Add protection parameters to the URL
        return addProtectionParameters(originalUrl, user.getId().toString());
    }

    /**
     * Add protection parameters to the Supabase URL
     */
    private String addProtectionParameters(String originalUrl, String userId) {
        // Add custom headers that can be checked by frontend
        String protectedUrl = originalUrl;

        // Add user context and timestamp for additional verification
        String separator = originalUrl.contains("?") ? "&" : "?";
        protectedUrl += separator + "viewer=protected&t=" + System.currentTimeMillis();

        return protectedUrl;
    }

    /**
     * Get viewing instructions for the frontend
     */
    public ViewingInstructions getViewingInstructions() {
        return new ViewingInstructions();
    }

    /**
     * Clean up old access trackers (call periodically)
     */
    public void cleanupOldTrackers() {
        accessTrackers.entrySet().removeIf(entry ->
                entry.getValue().getLastAccess().isBefore(LocalDateTime.now().minusHours(2))
        );
    }

    // Inner class to track user access patterns
    private static class UserAccessTracker {
        private int accessCount = 0;
        private LocalDateTime hourStart = LocalDateTime.now();
        private LocalDateTime lastAccess = LocalDateTime.now();

        public boolean canAccess() {
            LocalDateTime now = LocalDateTime.now();

            // Reset counter if hour has passed
            if (now.isAfter(hourStart.plusHours(1))) {
                accessCount = 0;
                hourStart = now;
            }

            return accessCount < 10; // Max 10 accesses per hour
        }

        public void recordAccess() {
            accessCount++;
            lastAccess = LocalDateTime.now();
        }

        public int getAccessCount() { return accessCount; }
        public LocalDateTime getLastAccess() { return lastAccess; }
    }

    // Viewing instructions for frontend
    public static class ViewingInstructions {
        private final String viewerType = "inline";
        private final boolean downloadDisabled = true;
        private final boolean printDisabled = true;
        private final boolean rightClickDisabled = true;
        private final boolean textSelectionDisabled = true;
        private final String[] securityMeasures = {
                "PDF.js viewer with disabled download",
                "Right-click context menu disabled",
                "Print functionality disabled",
                "Text selection disabled",
                "DevTools access monitoring",
                "Temporary URL with expiration"
        };
        private final String frontendImplementation = "Use PDF.js with toolbar='false' and download='false'";

        // Getters
        public String getViewerType() { return viewerType; }
        public boolean isDownloadDisabled() { return downloadDisabled; }
        public boolean isPrintDisabled() { return printDisabled; }
        public boolean isRightClickDisabled() { return rightClickDisabled; }
        public boolean isTextSelectionDisabled() { return textSelectionDisabled; }
        public String[] getSecurityMeasures() { return securityMeasures; }
        public String getFrontendImplementation() { return frontendImplementation; }
    }
}