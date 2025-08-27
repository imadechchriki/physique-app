package com.imad.physics_api.service;

import com.imad.physics_api.dto.request.LoginRequest;
import com.imad.physics_api.dto.request.RegisterRequest;
import com.imad.physics_api.dto.response.AuthResponse;
import com.imad.physics_api.dto.response.UserDto;
import com.imad.physics_api.exception.BadRequestException;
import com.imad.physics_api.exception.ResourceNotFoundException;
import com.imad.physics_api.model.entity.RefreshToken;
import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.entity.UserPreferences;
import com.imad.physics_api.model.entity.UserProfile;
import com.imad.physics_api.model.enums.EventType;
import com.imad.physics_api.model.enums.UserRole;
import com.imad.physics_api.repository.RefreshTokenRepository;
import com.imad.physics_api.repository.UserRepository;
import com.imad.physics_api.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);
    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int ACCOUNT_LOCK_DURATION_MINUTES = 30;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ActivityLogService activityLogService;

    @Autowired
    private UserMapperService userMapperService;

    public AuthResponse login(LoginRequest loginRequest, HttpServletRequest request) {
        String email = loginRequest.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(email)
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        // Check if account is locked
        if (user.isAccountLocked()) {
            activityLogService.logActivity(user, EventType.FAILED_LOGIN,
                    "Login attempt on locked account", request, false, "Account locked");
            throw new BadRequestException("Account is temporarily locked. Please try again later.");
        }

        // Verify password
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPasswordHash())) {
            handleFailedLogin(user, request);
            throw new BadRequestException("Invalid email or password");
        }

        // Reset failed attempts on successful login
        if (user.getFailedLoginAttempts() > 0) {
            user.setFailedLoginAttempts(0);
            user.setAccountLockedUntil(null);
            userRepository.save(user);
        }

        // Generate tokens
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Save refresh token
        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setExpiresAt(jwtUtil.getRefreshExpirationTime());
        refreshTokenEntity.setDeviceInfo(getUserAgent(request));
        refreshTokenEntity.setIpAddress(getClientIpAddress(request));
        refreshTokenRepository.save(refreshTokenEntity);

        // Update last login
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        // Log successful login
        activityLogService.logActivity(user, EventType.LOGIN, "User logged in successfully", request);

        // Prepare response
        UserDto userDto = userMapperService.toUserDto(user);

        return new AuthResponse(accessToken, refreshToken, jwtUtil.getExpirationTime(), userDto);
    }

    public AuthResponse register(RegisterRequest registerRequest) {
        String email = registerRequest.getEmail().toLowerCase().trim();

        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new BadRequestException("Email address is already registered");
        }

        // Create user entity
        User user = new User();
        user.setFirstName(registerRequest.getFirstName().trim());
        user.setLastName(registerRequest.getLastName().trim());
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(UserRole.STUDENT); // Only students can register
        user.setIsActive(true);
        user.setEmailVerified(false); // In production, implement email verification

        // Save user
        user = userRepository.save(user);

        // Create user profile
        UserProfile profile = new UserProfile(user);
        profile.setSchoolName(registerRequest.getSchoolName());
        profile.setCity(registerRequest.getCity());
        profile.setAcademicLevel(registerRequest.getAcademicLevel());
        profile.setBranch(registerRequest.getBranch());
        profile.setPhoneNumber(registerRequest.getPhoneNumber());
        user.setProfile(profile);

        // Create user preferences
        UserPreferences preferences = new UserPreferences(user);
        user.setPreferences(preferences);

        // Save user with profile and preferences
        user = userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtil.generateToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        // Save refresh token
        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUser(user);
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setExpiresAt(jwtUtil.getRefreshExpirationTime());
        refreshTokenRepository.save(refreshTokenEntity);

        // Log account creation
        activityLogService.logActivity(user, EventType.ACCOUNT_CREATED, "Student account created");

        logger.info("New student registered: {}", email);

        // Prepare response
        UserDto userDto = userMapperService.toUserDto(user);

        return new AuthResponse(accessToken, refreshToken, jwtUtil.getExpirationTime(), userDto);
    }

    public AuthResponse refreshToken(String refreshToken, HttpServletRequest request) {
        RefreshToken tokenEntity = refreshTokenRepository.findByValidToken(refreshToken, LocalDateTime.now())
                .orElseThrow(() -> new BadRequestException("Invalid or expired refresh token"));

        User user = tokenEntity.getUser();

        if (!user.getIsActive()) {
            throw new BadRequestException("User account is inactive");
        }

        // Generate new access token
        String newAccessToken = jwtUtil.generateToken(user);

        // Generate new refresh token
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        // Revoke old refresh token
        tokenEntity.setIsRevoked(true);
        refreshTokenRepository.save(tokenEntity);

        // Save new refresh token
        RefreshToken newTokenEntity = new RefreshToken();
        newTokenEntity.setUser(user);
        newTokenEntity.setToken(newRefreshToken);
        newTokenEntity.setExpiresAt(jwtUtil.getRefreshExpirationTime());
        newTokenEntity.setDeviceInfo(getUserAgent(request));
        newTokenEntity.setIpAddress(getClientIpAddress(request));
        refreshTokenRepository.save(newTokenEntity);

        // Log token refresh
        activityLogService.logActivity(user, EventType.LOGIN, "Token refreshed", request);

        UserDto userDto = userMapperService.toUserDto(user);

        return new AuthResponse(newAccessToken, newRefreshToken, jwtUtil.getExpirationTime(), userDto);
    }

    public void logout(String refreshToken, HttpServletRequest request) {
        try {
            String userEmail = jwtUtil.extractEmail(refreshToken);
            User user = userRepository.findByEmail(userEmail).orElse(null);

            // Revoke refresh token
            refreshTokenRepository.revokeToken(refreshToken);

            if (user != null) {
                activityLogService.logActivity(user, EventType.LOGOUT, "User logged out", request);
            }

        } catch (Exception e) {
            logger.error("Error during logout: {}", e.getMessage());
        }
    }

    public void logoutFromAllDevices(UUID userId, HttpServletRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        // Revoke all refresh tokens for the user
        refreshTokenRepository.revokeAllUserTokens(user);

        activityLogService.logActivity(user, EventType.LOGOUT,
                "User logged out from all devices", request);

        logger.info("User {} logged out from all devices", user.getEmail());
    }

    private void handleFailedLogin(User user, HttpServletRequest request) {
        int attempts = user.getFailedLoginAttempts() + 1;
        user.setFailedLoginAttempts(attempts);

        if (attempts >= MAX_LOGIN_ATTEMPTS) {
            user.setAccountLockedUntil(LocalDateTime.now().plusMinutes(ACCOUNT_LOCK_DURATION_MINUTES));
            activityLogService.logActivity(user, EventType.FAILED_LOGIN,
                    "Account locked due to multiple failed login attempts", request, false, "Account locked");
            logger.warn("Account locked for user: {} due to {} failed login attempts",
                    user.getEmail(), attempts);
        } else {
            activityLogService.logActivity(user, EventType.FAILED_LOGIN,
                    "Failed login attempt " + attempts + "/" + MAX_LOGIN_ATTEMPTS, request, false, "Invalid credentials");
        }

        userRepository.save(user);
    }

    private String getUserAgent(HttpServletRequest request) {
        return request != null ? request.getHeader("User-Agent") : null;
    }

    private String getClientIpAddress(HttpServletRequest request) {
        if (request == null) return null;

        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }
}