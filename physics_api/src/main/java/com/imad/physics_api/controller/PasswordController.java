package com.imad.physics_api.controller;

import com.imad.physics_api.dto.request.ChangePasswordRequest;
import com.imad.physics_api.dto.request.ForgotPasswordRequest;
import com.imad.physics_api.dto.request.ResetPasswordRequest;
import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.service.PasswordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth/password")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
@Tag(name = "Password Management", description = "Password reset and change operations")
public class PasswordController {

    private static final Logger logger = LoggerFactory.getLogger(PasswordController.class);

    @Autowired
    private PasswordService passwordService;

    @PostMapping("/forgot")
    @Operation(
            summary = "Request Password Reset",
            description = "Send password reset email to user"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Password reset email sent successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "Email address not found"
            )
    })
    public ResponseEntity<ApiResponse<String>> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request,
            HttpServletRequest httpRequest) {

        logger.info("Password reset requested for email: {}", request.getEmail());

        passwordService.requestPasswordReset(request, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Password reset email sent successfully. Please check your inbox.")
        );
    }

    @PostMapping("/reset")
    @Operation(
            summary = "Reset Password",
            description = "Reset password using reset token"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Password reset successful"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid or expired reset token"
            )
    })
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request,
            HttpServletRequest httpRequest) {

        logger.info("Password reset attempt with token: {}", request.getToken().substring(0, 8) + "...");

        passwordService.resetPassword(request, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Password reset successful. You can now login with your new password.")
        );
    }

    @PostMapping("/change")
    @Operation(
            summary = "Change Password",
            description = "Change password for authenticated user"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Password changed successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid current password"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            )
    })
    public ResponseEntity<ApiResponse<String>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal User currentUser, // Direct User object
            HttpServletRequest httpRequest) {

        logger.info("Password change requested for user: {}", currentUser.getEmail());

        passwordService.changePassword(request, currentUser, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Password changed successfully.")
        );
    }
}