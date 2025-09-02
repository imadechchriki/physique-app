// dto/response/UserPreferencesDto.java
package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.enums.Language;
import com.imad.physics_api.model.enums.Theme;

public class UserPreferencesDto {

    private Language language;
    private String timezone;
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Theme theme;
    private Boolean receiveMarketingEmails;
    private Boolean autoSaveProgress;

    // Constructors
    public UserPreferencesDto() {}

    // Getters and Setters
    public Language getLanguage() { return language; }
    public void setLanguage(Language language) { this.language = language; }

    public String getTimezone() { return timezone; }
    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Boolean getEmailNotifications() { return emailNotifications; }
    public void setEmailNotifications(Boolean emailNotifications) { this.emailNotifications = emailNotifications; }

    public Boolean getPushNotifications() { return pushNotifications; }
    public void setPushNotifications(Boolean pushNotifications) { this.pushNotifications = pushNotifications; }

    public Theme getTheme() { return theme; }
    public void setTheme(Theme theme) { this.theme = theme; }

    public Boolean getReceiveMarketingEmails() { return receiveMarketingEmails; }
    public void setReceiveMarketingEmails(Boolean receiveMarketingEmails) { this.receiveMarketingEmails = receiveMarketingEmails; }

    public Boolean getAutoSaveProgress() { return autoSaveProgress; }
    public void setAutoSaveProgress(Boolean autoSaveProgress) { this.autoSaveProgress = autoSaveProgress; }
}