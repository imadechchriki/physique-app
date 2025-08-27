package com.imad.physics_api.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User preferences")
public class UserPreferencesDto {

    @Schema(description = "Preferred language", example = "fr")
    private String language;

    @Schema(description = "Timezone", example = "Africa/Casablanca")
    private String timezone;

    @Schema(description = "Email notifications enabled")
    private Boolean emailNotifications;

    @Schema(description = "Push notifications enabled")
    private Boolean pushNotifications;

    @Schema(description = "Theme preference", example = "light")
    private String theme;

    @Schema(description = "Receive marketing emails")
    private Boolean receiveMarketingEmails;

    @Schema(description = "Auto-save progress")
    private Boolean autoSaveProgress;

    // Getters and Setters
    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public Boolean getPushNotifications() { return pushNotifications; }
    public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public Boolean getReceiveMarketingEmails() { return receiveMarketingEmails; }
    public void setReceiveMarketingEmails(Boolean receiveMarketingEmails) { this.receiveMarketingEmails = receiveMarketingEmails; }

    public Boolean getAutoSaveProgress() { return autoSaveProgress; }
    public void setAutoSaveProgress(Boolean autoSaveProgress) { this.autoSaveProgress = autoSaveProgress; }
}