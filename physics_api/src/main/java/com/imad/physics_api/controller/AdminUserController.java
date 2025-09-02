package com.imad.physics_api.controller;

import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.dto.response.UserDto;
import com.imad.physics_api.dto.response.UserProfileDto;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
@Tag(name = "Admin - User Management", description = "Admin operations for user management")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserController.class);

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    @Operation(
            summary = "Get All Users",
            description = "Get paginated list of all users (Admin only)"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Users retrieved successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "403",
                    description = "Access denied - Admin role required"
            )
    })
    public ResponseEntity<ApiResponse<Page<UserDto>>> getAllUsers(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDirection) {

        Page<UserDto> users = adminUserService.getAllUsers(page, size, sortBy, sortDirection);

        return ResponseEntity.ok(
                ApiResponse.success("Users retrieved successfully", users)
        );
    }

    @GetMapping("/students")
    @Operation(
            summary = "Get All Students",
            description = "Get paginated list of student users (Admin only)"
    )
    public ResponseEntity<ApiResponse<Page<UserDto>>> getStudents(
            @Parameter(description = "Page number (0-based)") @RequestParam(defaultValue = "0") int page,
            @Parameter(description = "Page size") @RequestParam(defaultValue = "10") int size,
            @Parameter(description = "Sort field") @RequestParam(defaultValue = "createdAt") String sortBy,
            @Parameter(description = "Sort direction") @RequestParam(defaultValue = "desc") String sortDirection) {

        Page<UserDto> students = adminUserService.getStudents(page, size, sortBy, sortDirection);

        return ResponseEntity.ok(
                ApiResponse.success("Students retrieved successfully", students)
        );
    }

    @GetMapping("/{userId}")
    @Operation(
            summary = "Get User by ID",
            description = "Get detailed user information by ID (Admin only)"
    )
    public ResponseEntity<ApiResponse<UserProfileDto>> getUserById(
            @Parameter(description = "User ID") @PathVariable UUID userId) {

        UserProfileDto user = adminUserService.getUserById(userId);

        return ResponseEntity.ok(
                ApiResponse.success("User retrieved successfully", user)
        );
    }

    @PutMapping("/{userId}/toggle-status")
    @Operation(
            summary = "Toggle User Status",
            description = "Activate or deactivate a user account (Admin only)"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "User status updated successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Cannot modify admin user"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "User not found"
            )
    })
    public ResponseEntity<ApiResponse<String>> toggleUserStatus(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal User admin,
            HttpServletRequest httpRequest) {

        logger.info("Admin {} requesting status toggle for user {}", admin.getEmail(), userId);

        adminUserService.toggleUserStatus(userId, admin, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("User status updated successfully")
        );
    }

    @DeleteMapping("/{userId}")
    @Operation(
            summary = "Soft Delete User",
            description = "Soft delete a user account (Admin only)"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "User deleted successfully"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Cannot delete admin user"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "User not found"
            )
    })
    public ResponseEntity<ApiResponse<String>> deleteUser(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal User admin,
            HttpServletRequest httpRequest) {

        logger.warn("Admin {} requesting deletion of user {}", admin.getEmail(), userId);

        adminUserService.deleteUser(userId, admin, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("User deleted successfully")
        );
    }

    @DeleteMapping("/{userId}/permanent")
    @Operation(
            summary = "Permanently Delete User",
            description = "Permanently delete a user and all related data (Admin only) - WARNING: This action cannot be undone"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "User permanently deleted"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Cannot delete admin user"
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "404",
                    description = "User not found"
            )
    })
    public ResponseEntity<ApiResponse<String>> permanentlyDeleteUser(
            @Parameter(description = "User ID") @PathVariable UUID userId,
            @AuthenticationPrincipal User admin,
            HttpServletRequest httpRequest) {

        logger.warn("Admin {} requesting PERMANENT deletion of user {}", admin.getEmail(), userId);

        adminUserService.permanentlyDeleteUser(userId, admin, httpRequest);

        return ResponseEntity.ok(
                ApiResponse.success("User permanently deleted")
        );
    }

    @GetMapping("/statistics")
    @Operation(
            summary = "Get User Statistics",
            description = "Get user statistics and counts (Admin only)"
    )
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUserStatistics() {

        Map<String, Object> statistics = new HashMap<>();
        statistics.put("totalStudents", adminUserService.getTotalStudentsCount());
        statistics.put("activeStudents", adminUserService.getActiveStudentsCount());
        statistics.put("inactiveStudents", adminUserService.getInactiveStudentsCount());

        return ResponseEntity.ok(
                ApiResponse.success("Statistics retrieved successfully", statistics)
        );
    }
}