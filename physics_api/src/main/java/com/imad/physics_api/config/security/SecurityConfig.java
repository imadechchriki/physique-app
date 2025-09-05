// Updated SecurityConfig.java - All Course/Exam APIs Protected
package com.imad.physics_api.config.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(Customizer.withDefaults())
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints - NO authentication required
                        .requestMatchers("/auth/register", "/auth/login", "/auth/refresh").permitAll()
                        .requestMatchers("/auth/password/forgot", "/auth/password/reset").permitAll()
                        .requestMatchers("/test/**").permitAll()
                        .requestMatchers("/swagger-ui/**", "/api-docs/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/actuator/health").permitAll()

                        // Authentication required endpoints
                        .requestMatchers("/auth/password/change").authenticated()
                        .requestMatchers("/auth/logout").authenticated()
                        .requestMatchers("/profile/**").authenticated()

                        // Course endpoints - ALL PROTECTED (authentication required)
                        .requestMatchers("/courses/upload").hasRole("ADMIN")               // Admin only
                        .requestMatchers("/courses/*/access").authenticated()             // All authenticated users
                        .requestMatchers("/courses/student").hasRole("STUDENT")           // Students only
                        .requestMatchers("/courses/*").authenticated()                    // All authenticated users (view course by ID)
                        .requestMatchers("/courses").authenticated()                      // All authenticated users (list courses)

                        // Exam endpoints - ALL PROTECTED (authentication required)
                        .requestMatchers("/exams/upload").hasRole("ADMIN")                // Admin only
                        .requestMatchers("/exams/*/access").authenticated()              // All authenticated users
                        .requestMatchers("/exams/student").hasRole("STUDENT")            // Students only
                        .requestMatchers("/exams/*").authenticated()                     // All authenticated users (view exam by ID)
                        .requestMatchers("/exams").authenticated()                       // All authenticated users (list exams)

                        // Admin only endpoints
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Any other request requires authentication
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint)
                )
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}