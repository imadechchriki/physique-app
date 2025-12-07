package com.imad.physics_api.service;

import com.imad.physics_api.dto.request.ChangePasswordRequest;
import com.imad.physics_api.dto.request.ForgotPasswordRequest;
import com.imad.physics_api.dto.request.ResetPasswordRequest;
import com.imad.physics_api.exception.BadRequestException;
import com.imad.physics_api.exception.ResourceNotFoundException;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.enums.EventType;
import com.imad.physics_api.repository.UserRepository;
import com.imad.physics_api.util.TokenGenerator;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
public class PasswordService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ActivityLogService activityLogService;

    @Value("${app.password-reset.token-expiry}")
    private long tokenExpiryMs;

    public void requestPasswordReset(ForgotPasswordRequest request, HttpServletRequest httpRequest) {
        String email = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(email)
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email address"));

        // Generate reset token
        String resetToken = TokenGenerator.generateResetToken();
        LocalDateTime expiryTime = LocalDateTime.now().plusSeconds(tokenExpiryMs / 1000);

        // Save reset token
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(expiryTime);
        userRepository.save(user);

        // Send reset email
        emailService.sendPasswordResetEmail(user, resetToken);

        // Log activity
        activityLogService.logActivity(user, EventType.PASSWORD_CHANGE,
                "Password reset requested", httpRequest);

        logger.info("Password reset requested for user: {}", email);
    }

    public void resetPassword(ResetPasswordRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByValidResetToken(request.getToken(), LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException("Invalid or expired reset token"));

        // Update password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);

        // Reset failed login attempts
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);

        userRepository.save(user);

        // Send confirmation email
        emailService.sendPasswordChangeConfirmationEmail(user);

        // Log activity
        activityLogService.logActivity(user, EventType.PASSWORD_CHANGE,
                "Password reset completed", httpRequest);

        logger.info("Password reset completed for user: {}", user.getEmail());
    }

    public void changePassword(ChangePasswordRequest request, User currentUser, HttpServletRequest httpRequest) {
        // Verify current password
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        // Check if new password is different
        if (passwordEncoder.matches(request.getNewPassword(), currentUser.getPasswordHash())) {
            throw new BadRequestException("New password must be different from current password");
        }

        // Update password
        currentUser.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);

        // Send confirmation email
        emailService.sendPasswordChangeConfirmationEmail(currentUser);

        // Log activity
        activityLogService.logActivity(currentUser, EventType.PASSWORD_CHANGE,
                "Password changed successfully", httpRequest);

        logger.info("Password changed for user: {}", currentUser.getEmail());
    }
}