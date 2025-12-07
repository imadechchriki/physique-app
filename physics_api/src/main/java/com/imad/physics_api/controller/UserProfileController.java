package com.imad.physics_api.controller;

import com.imad.physics_api.dto.request.UpdateProfileRequest;
import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.dto.response.UserProfileDto;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.service.UserProfileService;
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
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
@Tag(name = "User Profile", description = "User profile management operations")
public class UserProfileController {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class);

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/me")
    @Operation(
            summary = "Get Current User Profile",
            description = "Get the profile information of the currently authenticated user"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Profile retrieved successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            )
    })
    public ResponseEntity<ApiResponse<UserProfileDto>> getCurrentUserProfile(
            @AuthenticationPrincipal User currentUser) {

        UserProfileDto profile = userProfileService.getCurrentUserProfile(currentUser);

        return ResponseEntity.ok(
                ApiResponse.success("Profile retrieved successfully", profile)
        );
    }

    @PutMapping("/me")
    @Operation(
            summary = "Update User Profile",
            description = "Update the profile information of the currently authenticated user"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Profile updated successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid input or email already exists"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            )
    })
    public ResponseEntity<ApiResponse<UserProfileDto>> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal User currentUser,
            HttpServletRequest httpRequest) {

        logger.info("Profile update requested for user: {}", currentUser.getEmail());

        UserProfileDto updatedProfile = userProfileService.updateProfile(currentUser, request, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Profile updated successfully", updatedProfile)
        );
    }

    @PostMapping("/avatar/upload")
    @Operation(
            summary = "Upload User Avatar",
            description = "Upload an avatar image file for the currently authenticated user"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Avatar uploaded successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid file or file too large"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "401",
                    description = "Authentication required"
            )
    })
    public ResponseEntity<ApiResponse<UserProfileDto>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal User currentUser,
            HttpServletRequest httpRequest) {

        logger.info("Avatar upload requested for user: {}", currentUser.getEmail());

        UserProfileDto updatedProfile = userProfileService.uploadAvatar(currentUser, file, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Avatar uploaded successfully", updatedProfile)
        );
    }

    @PutMapping("/avatar")
    @Operation(
            summary = "Update User Avatar URL",
            description = "Update the avatar URL for the currently authenticated user (for external URLs)"
    )
    public ResponseEntity<ApiResponse<UserProfileDto>> updateAvatarUrl(
            @RequestParam String avatarUrl,
            @AuthenticationPrincipal User currentUser,
            HttpServletRequest httpRequest) {

        logger.info("Avatar URL update requested for user: {}", currentUser.getEmail());

        UserProfileDto updatedProfile = userProfileService.updateAvatarUrl(currentUser, avatarUrl, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Avatar updated successfully", updatedProfile)
        );
    }

    @DeleteMapping("/avatar")
    @Operation(
            summary = "Remove User Avatar",
            description = "Remove the avatar for the currently authenticated user"
    )
    public ResponseEntity<ApiResponse<String>> deleteAvatar(
            @AuthenticationPrincipal User currentUser,
            HttpServletRequest httpRequest) {

        logger.info("Avatar removal requested for user: {}", currentUser.getEmail());

        userProfileService.deleteAvatar(currentUser, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Avatar removed successfully")
        );
    }
}