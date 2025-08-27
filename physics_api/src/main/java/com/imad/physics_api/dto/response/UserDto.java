package com.imad.physics_api.dto.response;

import com.imad.physics_api.model.enums.UserRole;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;
import java.util.UUID;

@Schema(description = "User data transfer object")
public class UserDto {

    @Schema(description = "User unique identifier")
    private UUID id;

    @Schema(description = "User first name")
    private String firstName;

    @Schema(description = "User last name")
    private String lastName;

    @Schema(description = "User email address")
    private String email;

    @Schema(description = "User role")
    private UserRole role;

    @Schema(description = "Avatar URL")
    private String avatarUrl;

    @Schema(description = "Account active status")
    private Boolean isActive;

    @Schema(description = "Email verification status")
    private Boolean emailVerified;

    @Schema(description = "Last login timestamp")
    private LocalDateTime lastLoginAt;

    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;

    @Schema(description = "User profile information")
    private UserProfileDto profile;

    @Schema(description = "User preferences")
    private UserPreferencesDto preferences;

    // Constructors
    public UserDto() {}

    // Getters and Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

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

    public UserProfileDto getProfile() { return profile; }
    public void setProfile(UserProfileDto profile) { this.profile = profile; }

    public UserPreferencesDto getPreferences() { return preferences; }
    public void setPreferences(UserPreferencesDto preferences) { this.preferences = preferences; }

    public String getFullName() {
        return firstName + " " + lastName;
    }
}