package com.imad.physics_api.model.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preferences")
public class UserPreferences extends BaseEntity {

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "language", nullable = false, length = 5)
    private String language = "fr";

    @Column(name = "timezone", nullable = false, length = 50)
    private String timezone = "Africa/Casablanca";

    @Column(name = "email_notifications", nullable = false)
    private Boolean emailNotifications = true;

    @Column(name = "push_notifications", nullable = false)
    private Boolean pushNotifications = true;

    @Column(name = "theme", nullable = false, length = 10)
    private String theme = "light";

    @Column(name = "receive_marketing_emails", nullable = false)
    private Boolean receiveMarketingEmails = false;

    @Column(name = "auto_save_progress", nullable = false)
    private Boolean autoSaveProgress = true;

    // Constructors
    public UserPreferences() {}

    public UserPreferences(User user) {
        this.user = user;
    }

    // Getters and Setters
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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