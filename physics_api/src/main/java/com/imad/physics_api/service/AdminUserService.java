package com.imad.physics_api.service;

import com.imad.physics_api.dto.response.UserDto;
import com.imad.physics_api.dto.response.UserProfileDto;
import com.imad.physics_api.exception.BadRequestException;
import com.imad.physics_api.exception.ResourceNotFoundException;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.enums.EventType;
import com.imad.physics_api.model.enums.UserRole;
import com.imad.physics_api.repository.RefreshTokenRepository;
import com.imad.physics_api.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AdminUserService {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private UserMapperService userMapperService;

    @Autowired
    private ActivityLogService activityLogService;

    public Page<UserDto> getAllUsers(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ?
                Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<User> users = userRepository.findByIsDeletedFalse(pageable);

        return users.map(userMapperService::toUserDto);
    }

    public Page<UserDto> getStudents(int page, int size, String sortBy, String sortDirection) {
        Sort.Direction direction = sortDirection.equalsIgnoreCase("desc") ?
                Sort.Direction.DESC : Sort.Direction.ASC;

        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<User> students = userRepository.findByRoleAndIsDeletedFalse(UserRole.STUDENT, pageable);

        return students.map(userMapperService::toUserDto);
    }

    public UserProfileDto getUserById(UUID userId) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return userMapperService.toUserProfileDto(user);
    }

    public void toggleUserStatus(UUID userId, User admin, HttpServletRequest httpRequest) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("Cannot modify admin user status");
        }

        boolean wasActive = user.getIsActive();
        user.setIsActive(!wasActive);
        userRepository.save(user);

        // If deactivating user, revoke all refresh tokens
        if (!user.getIsActive()) {
            refreshTokenRepository.revokeAllUserTokens(user);
        }

        String action = user.getIsActive() ? "activated" : "deactivated";

        // Log activity for both admin and the affected user
        activityLogService.logActivity(admin, EventType.USER_MANAGEMENT,
                String.format("User %s %s by admin", user.getEmail(), action), httpRequest);

        activityLogService.logActivity(user, EventType.ACCOUNT_STATUS_CHANGE,
                String.format("Account %s by admin %s", action, admin.getEmail()), httpRequest);

        logger.info("User {} {} by admin {}", user.getEmail(), action, admin.getEmail());
    }

    public void deleteUser(UUID userId, User admin, HttpServletRequest httpRequest) {
        User user = userRepository.findByIdAndIsDeletedFalse(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("Cannot delete admin user");
        }

        // Soft delete the user
        user.setIsDeleted(true);
        user.setIsActive(false);

        // Revoke all refresh tokens
        refreshTokenRepository.revokeAllUserTokens(user);

        userRepository.save(user);

        // Log activity for admin
        activityLogService.logActivity(admin, EventType.USER_MANAGEMENT,
                String.format("User %s deleted by admin", user.getEmail()), httpRequest);

        // Log activity for the deleted user
        activityLogService.logActivity(user, EventType.ACCOUNT_DELETED,
                String.format("Account deleted by admin %s", admin.getEmail()), httpRequest);

        logger.warn("User {} deleted by admin {}", user.getEmail(), admin.getEmail());
    }

    public void permanentlyDeleteUser(UUID userId, User admin, HttpServletRequest httpRequest) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == UserRole.ADMIN) {
            throw new BadRequestException("Cannot permanently delete admin user");
        }

        String userEmail = user.getEmail();

        // Log before deletion (since we won't be able to log after)
        activityLogService.logActivity(admin, EventType.USER_MANAGEMENT,
                String.format("User %s permanently deleted by admin", userEmail), httpRequest);

        // This will cascade and delete all related records due to CascadeType.ALL
        userRepository.delete(user);

        logger.warn("User {} permanently deleted by admin {}", userEmail, admin.getEmail());
    }

    public long getTotalStudentsCount() {
        return userRepository.countByRoleAndIsDeletedFalse(UserRole.STUDENT);
    }

    public long getActiveStudentsCount() {
        return userRepository.countByRoleAndIsActiveTrueAndIsDeletedFalse(UserRole.STUDENT);
    }

    public long getInactiveStudentsCount() {
        return userRepository.countByRoleAndIsActiveFalseAndIsDeletedFalse(UserRole.STUDENT);
    }
}