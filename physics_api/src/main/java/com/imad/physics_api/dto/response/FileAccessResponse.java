// Enhanced FileAccessResponse.java with viewing restrictions
package com.imad.physics_api.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

public class FileAccessResponse {
    private String accessUrl;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime generatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime expiresAt;

    private String viewingInstructions;
    private SecurityNotice securityNotice;

    public FileAccessResponse(String accessUrl, int expirySeconds) {
        this.accessUrl = accessUrl;
        this.generatedAt = LocalDateTime.now();
        this.expiresAt = this.generatedAt.plusSeconds(expirySeconds);
        this.viewingInstructions = "This PDF must be viewed in your browser. Downloads are not permitted.";
        this.securityNotice = new SecurityNotice();
    }

    public FileAccessResponse() {}

    // Inner class for security notice
    public static class SecurityNotice {
        private String message;
        private String[] protections;

        public SecurityNotice() {
            this.message = "This content is protected and monitored";
            this.protections = new String[]{
                    "Temporary access only - link expires in 5 minutes",
                    "View-only access - downloads disabled",
                    "Access is logged and monitored",
                    "Sharing this link is prohibited"
            };
        }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }

        public String[] getProtections() { return protections; }
        public void setProtections(String[] protections) { this.protections = protections; }
    }

    // Getters and Setters
    public String getAccessUrl() { return accessUrl; }
    public void setAccessUrl(String accessUrl) { this.accessUrl = accessUrl; }

    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }

    public LocalDateTime getExpiresAt() { return expiresAt; }
    public void setExpiresAt(LocalDateTime expiresAt) { this.expiresAt = expiresAt; }

    public String getViewingInstructions() { return viewingInstructions; }
    public void setViewingInstructions(String viewingInstructions) { this.viewingInstructions = viewingInstructions; }

    public SecurityNotice getSecurityNotice() { return securityNotice; }
    public void setSecurityNotice(SecurityNotice securityNotice) { this.securityNotice = securityNotice; }
}