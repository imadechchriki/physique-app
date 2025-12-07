package com.imad.physics_api.service;

import com.imad.physics_api.dto.response.UserDto;
import com.imad.physics_api.dto.response.UserProfileDto;
import com.imad.physics_api.dto.response.UserProfileOnlyDto;
import com.imad.physics_api.dto.response.UserPreferencesDto;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.entity.UserProfile;
import com.imad.physics_api.model.entity.UserPreferences;
import com.imad.physics_api.model.enums.Language;
import com.imad.physics_api.model.enums.Theme;
import org.springframework.stereotype.Service;

@Service
public class UserMapperService {

    public UserDto toUserDto(User user) {
        if (user == null) return null;

        UserDto dto = new UserDto();
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setIsActive(user.getIsActive());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setCreatedAt(user.getCreatedAt());

        if (user.getProfile() != null) {
            dto.setProfile(toUserProfileOnlyDto(user.getProfile()));
        }

        if (user.getPreferences() != null) {
            dto.setPreferences(toUserPreferencesDto(user.getPreferences()));
        }

        return dto;
    }

    // This method returns the FULL profile DTO (User + Profile data combined) for profile management
    public UserProfileDto toUserProfileDto(User user) {
        if (user == null) return null;

        UserProfileDto dto = new UserProfileDto();

        // Basic user information
        dto.setId(user.getId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setRole(user.getRole());
        dto.setAvatarUrl(user.getAvatarUrl());
        dto.setIsActive(user.getIsActive());
        dto.setEmailVerified(user.getEmailVerified());
        dto.setLastLoginAt(user.getLastLoginAt());
        dto.setCreatedAt(user.getCreatedAt());

        // Profile information
        UserProfile profile = user.getProfile();
        if (profile != null) {
            dto.setSchoolName(profile.getSchoolName());
            dto.setCity(profile.getCity());
            dto.setAcademicLevel(profile.getAcademicLevel());
            dto.setBranch(profile.getBranch());
            dto.setBio(profile.getBio());
            dto.setPhoneNumber(profile.getPhoneNumber());
            dto.setBirthDate(profile.getBirthDate());
        }

        return dto;
    }

    // This method returns ONLY profile data for nested use in UserDto
    public UserProfileOnlyDto toUserProfileOnlyDto(UserProfile profile) {
        if (profile == null) return null;

        UserProfileOnlyDto dto = new UserProfileOnlyDto();
        dto.setSchoolName(profile.getSchoolName());
        dto.setCity(profile.getCity());
        dto.setAcademicLevel(profile.getAcademicLevel());
        dto.setBranch(profile.getBranch());
        dto.setBio(profile.getBio());
        dto.setPhoneNumber(profile.getPhoneNumber());
        dto.setBirthDate(profile.getBirthDate());

        return dto;
    }

    public UserPreferencesDto toUserPreferencesDto(UserPreferences preferences) {
        if (preferences == null) return null;

        UserPreferencesDto dto = new UserPreferencesDto();

        // Convert String to Language enum using the utility method
        dto.setLanguage(Language.fromCode(preferences.getLanguage()));

        dto.setTimezone(preferences.getTimezone());
        dto.setEmailNotifications(preferences.getEmailNotifications());
        dto.setPushNotifications(preferences.getPushNotifications());

        // Convert String to Theme enum using the utility method
        dto.setTheme(Theme.fromValue(preferences.getTheme()));

        dto.setReceiveMarketingEmails(preferences.getReceiveMarketingEmails());
        dto.setAutoSaveProgress(preferences.getAutoSaveProgress());

        return dto;
    }
}