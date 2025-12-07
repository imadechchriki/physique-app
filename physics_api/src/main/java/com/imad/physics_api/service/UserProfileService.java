package com.imad.physics_api.service;

import com.imad.physics_api.dto.request.UpdateProfileRequest;
import com.imad.physics_api.dto.response.UserProfileDto;
import com.imad.physics_api.exception.BadRequestException;
import com.imad.physics_api.exception.ResourceNotFoundException;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.entity.UserProfile;
import com.imad.physics_api.model.enums.EventType;
import com.imad.physics_api.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile; // ADD THIS IMPORT
import java.util.UUID;

@Service
@Transactional
public class UserProfileService {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserMapperService userMapperService;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private FileUploadService fileUploadService; // ADD THIS FIELD

    public UserProfileDto getCurrentUserProfile(User currentUser) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userMapperService.toUserProfileDto(user);
    }

    public UserProfileDto updateProfile(User currentUser, UpdateProfileRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Check if email is being changed and if it already exists
        String newEmail = request.getEmail().toLowerCase().trim();
        if (!user.getEmail().equals(newEmail)) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new BadRequestException("Email address is already in use");
            }
            user.setEmail(newEmail);
        }

        // Update user basic information
        user.setFirstName(request.getFirstName().trim());
        user.setLastName(request.getLastName().trim());

        // Update or create user profile
        UserProfile profile = user.getProfile();
        if (profile == null) {
            profile = new UserProfile(user);
            user.setProfile(profile);
        }

        profile.setSchoolName(request.getSchoolName() != null ? request.getSchoolName().trim() : null);
        profile.setCity(request.getCity() != null ? request.getCity().trim() : null);
        profile.setAcademicLevel(request.getAcademicLevel());
        profile.setBranch(request.getBranch());
        profile.setBio(request.getBio() != null ? request.getBio().trim() : null);
        profile.setPhoneNumber(request.getPhoneNumber() != null ? request.getPhoneNumber().trim() : null);
        profile.setBirthDate(request.getBirthDate());

        user = userRepository.save(user);

        // Log activity
        activityLogService.logActivity(user, EventType.PROFILE_UPDATE,
                "User profile updated", httpRequest);

        logger.info("Profile updated for user: {}", user.getEmail());

        return userMapperService.toUserProfileDto(user);
    }

    public UserProfileDto updateAvatar(User currentUser, String avatarUrl, HttpServletRequest httpRequest) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setAvatarUrl(avatarUrl);
        user = userRepository.save(user);

        // Log activity
        activityLogService.logActivity(user, EventType.PROFILE_UPDATE,
                "Avatar updated", httpRequest);

        logger.info("Avatar updated for user: {}", user.getEmail());

        return userMapperService.toUserProfileDto(user);
    }

    // ADD THESE TWO NEW METHODS:

    public UserProfileDto uploadAvatar(User currentUser, MultipartFile file, HttpServletRequest httpRequest) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Delete old avatar file if exists
        if (user.getAvatarUrl() != null) {
            fileUploadService.deleteAvatar(user.getAvatarUrl());
        }

        // Upload new avatar
        String avatarUrl = fileUploadService.uploadAvatar(file);
        user.setAvatarUrl(avatarUrl);
        user = userRepository.save(user);

        // Log activity
        activityLogService.logActivity(user, EventType.PROFILE_UPDATE,
                "Avatar uploaded", httpRequest);

        logger.info("Avatar uploaded for user: {}", user.getEmail());

        return userMapperService.toUserProfileDto(user);
    }

    public UserProfileDto updateAvatarUrl(User currentUser, String avatarUrl, HttpServletRequest httpRequest) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setAvatarUrl(avatarUrl);
        user = userRepository.save(user);

        // Log activity
        activityLogService.logActivity(user, EventType.PROFILE_UPDATE,
                "Avatar updated", httpRequest);

        logger.info("Avatar updated for user: {}", user.getEmail());

        return userMapperService.toUserProfileDto(user);
    }


    public void deleteAvatar(User currentUser, HttpServletRequest httpRequest) {
        User user = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setAvatarUrl(null);
        userRepository.save(user);

        // Log activity
        activityLogService.logActivity(user, EventType.PROFILE_UPDATE,
                "Avatar removed", httpRequest);

        logger.info("Avatar removed for user: {}", user.getEmail());
    }
}