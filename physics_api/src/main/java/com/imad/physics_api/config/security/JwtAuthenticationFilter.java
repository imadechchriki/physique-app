package com.imad.physics_api.config.security;

import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.repository.UserRepository;
import com.imad.physics_api.util.JwtUtil;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        try {
            String token = extractTokenFromRequest(request);

            if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                authenticateUser(token, request);
            }
        } catch (Exception e) {
            logger.error("JWT authentication error: {}", e.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String extractTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }

        return null;
    }

    private void authenticateUser(String token, HttpServletRequest request) {
        try {
            UUID userId = jwtUtil.extractUserId(token);
            String email = jwtUtil.extractEmail(token);

            if (userId != null && email != null) {
                Optional<User> userOpt = userRepository.findByEmailAndIsActiveTrueAndIsDeletedFalse(email);

                if (userOpt.isPresent()) {
                    User user = userOpt.get();

                    if (jwtUtil.validateToken(token, user)) {
                        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
                                new SimpleGrantedAuthority("ROLE_" + user.getRole().name())
                        );

                        // Set User object directly as principal
                        UsernamePasswordAuthenticationToken authentication =
                                new UsernamePasswordAuthenticationToken(user, null, authorities);

                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);

                        logger.debug("User {} authenticated successfully", email);
                    }
                }
            }
        } catch (JwtException e) {
            logger.error("JWT validation error: {}", e.getMessage());
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();

        // Skip authentication for public endpoints only
        return path.equals("/api/auth/register") ||
                path.equals("/api/auth/login") ||
                path.equals("/api/auth/refresh") ||
                path.startsWith("/api/auth/password/forgot") ||
                path.startsWith("/api/auth/password/reset") ||
                path.startsWith("/api/test/") ||
                path.startsWith("/api/swagger-ui/") ||
                path.startsWith("/api/api-docs/") ||
                path.startsWith("/api/v3/api-docs/") ||
                path.equals("/api/swagger-ui.html") ||
                path.startsWith("/api/actuator/health");
    }
}