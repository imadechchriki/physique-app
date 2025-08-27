package com.imad.physics_api.service;

import com.imad.physics_api.dto.response.UserDto;
import com.imad.physics_api.dto.response.UserPreferencesDto;
import com.imad.physics_api.dto.response.UserProfileDto;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.entity.UserPreferences;
import com.imad.physics_api.model.entity.UserProfile;
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
            dto.setProfile(toUserProfileDto(user.getProfile()));
        }

        if (user.getPreferences() != null) {
            dto.setPreferences(toUserPreferencesDto(user.getPreferences()));
        }

        return dto;
    }

    public UserProfileDto toUserProfileDto(UserProfile profile) {
        if (profile == null) return null;

        UserProfileDto dto = new UserProfileDto();
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
        dto.setLanguage(preferences.getLanguage());
        dto.setTimezone(preferences.getTimezone());
        dto.setEmailNotifications(preferences.getEmailNotifications());
        dto.setPushNotifications(preferences.getPushNotifications());
        dto.setTheme(preferences.getTheme());
        dto.setReceiveMarketingEmails(preferences.getReceiveMarketingEmails());
        dto.setAutoSaveProgress(preferences.getAutoSaveProgress());

        return dto;
    }
}