package com.imad.physics_api.controller;

import com.imad.physics_api.dto.request.LoginRequest;
import com.imad.physics_api.dto.request.RegisterRequest;
import com.imad.physics_api.dto.response.ApiResponse;
import com.imad.physics_api.dto.response.AuthResponse;
import com.imad.physics_api.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
@Tag(name = "Authentication", description = "User authentication and registration endpoints")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(
            summary = "User Login",
            description = "Authenticate user with email and password"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Login successful",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Invalid credentials or account locked"
            )
    })
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpServletRequest request) {

        logger.info("Login attempt for email: {}", loginRequest.getEmail());

        AuthResponse authResponse = authService.login(loginRequest, request);

        return ResponseEntity.ok(
                ApiResponse.success("Login successful", authResponse)
        );
    }

    @PostMapping("/register")
    @Operation(
            summary = "Student Registration",
            description = "Register a new student account"
    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "200",
                    description = "Registration successful",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))
            ),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(
                    responseCode = "400",
                    description = "Registration failed - email already exists or validation error"
            )
    })
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest registerRequest) {

        logger.info("Registration attempt for email: {}", registerRequest.getEmail());

        AuthResponse authResponse = authService.register(registerRequest);

        return ResponseEntity.ok(
                ApiResponse.success("Registration successful", authResponse)
        );
    }

    @PostMapping("/refresh-token")
    @Operation(
            summary = "Refresh Access Token",
            description = "Get a new access token using refresh token"
    )
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            @Parameter(description = "Refresh token") @RequestParam String refreshToken,
            HttpServletRequest request) {

        AuthResponse authResponse = authService.refreshToken(refreshToken, request);

        return ResponseEntity.ok(
                ApiResponse.success("Token refreshed successfully", authResponse)
        );
    }

    @PostMapping("/logout")
    @Operation(
            summary = "User Logout",
            description = "Logout user and invalidate refresh token"
    )
    public ResponseEntity<ApiResponse<String>> logout(
            @Parameter(description = "Refresh token to invalidate") @RequestParam String refreshToken,
            HttpServletRequest request) {

        authService.logout(refreshToken, request);

        return ResponseEntity.ok(
                ApiResponse.success("Logout successful")
        );
    }
}