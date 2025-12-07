// Updated UserDto.java - Add these fields to your existing UserDto
package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.enums.UserRole;

import java.time.LocalDateTime;
import java.util.UUID;

public class UserDto {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private UserRole role;
    private String avatarUrl;
    private Boolean isActive;
    private Boolean emailVerified;
    private LocalDateTime lastLoginAt;
    private LocalDateTime createdAt;

    // NEW FIELDS - Add these to your existing UserDto
    private UserProfileOnlyDto profile;
    private UserPreferencesDto preferences;

    // Constructors
    public UserDto() {}

    // Existing getters and setters (keep all your existing ones)
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getFullName() { return firstName + " " + lastName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }

    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getEmailVerified() { return emailVerified; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

    public LocalDateTime getLastLoginAt() { return lastLoginAt; }
    public void setLastLoginAt(LocalDateTime lastLoginAt) { this.lastLoginAt = lastLoginAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    // NEW GETTERS/SETTERS - Add these
    public UserProfileOnlyDto getProfile() { return profile; }
    public void setProfile(UserProfileOnlyDto profile) { this.profile = profile; }

    public UserPreferencesDto getPreferences() { return preferences; }
    public void setPreferences(UserPreferencesDto preferences) { this.preferences = preferences; }
}