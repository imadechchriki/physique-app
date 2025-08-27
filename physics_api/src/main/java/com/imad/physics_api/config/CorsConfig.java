package com.imad.physics_api.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {

    @Value("${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
    private String allowedOrigins;

    @Value("${CORS_ALLOWED_METHODS:GET,POST,PUT,DELETE,OPTIONS}")
    private String allowedMethods;

    @Value("${CORS_ALLOWED_HEADERS:*}")
    private String allowedHeaders;

    @Value("${CORS_ALLOW_CREDENTIALS:true}")
    private boolean allowCredentials;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins.split(","))
                .allowedMethods(allowedMethods.split(","))
                .allowedHeaders(allowedHeaders.split(","))
                .allowCredentials(allowCredentials);

        System.out.println("🌐 CORS configured with origins: " + allowedOrigins);
    }
}