package com.imad.physics_api.controller;

import com.imad.physics_api.service.LoggingService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "${CORS_ALLOWED_ORIGINS:http://localhost:3000}")
public class TestController {

    private static final Logger logger = LoggerFactory.getLogger(TestController.class);

    @Autowired
    private LoggingService loggingService;

    @GetMapping("/hello")
    public ResponseEntity<String> hello(HttpServletRequest request) {
        String clientIp = getClientIpAddress(request);

        loggingService.logApiRequest("GET", "/test/hello", clientIp);
        loggingService.logInfo("Hello endpoint accessed from IP: " + clientIp);

        return ResponseEntity.ok("Hello from Physics API Backend!");
    }

    @GetMapping("/status")
    public ResponseEntity<String> status(HttpServletRequest request) {
        String clientIp = getClientIpAddress(request);

        loggingService.logApiRequest("GET", "/test/status", clientIp);
        loggingService.logSystemEvent("STATUS_CHECK", "API health check performed");

        return ResponseEntity.ok("Physics API is running successfully!");
    }

    @GetMapping("/error-test")
    public ResponseEntity<String> errorTest() {
        try {
            // Simulate an error for testing
            throw new RuntimeException("This is a test error for logging");
        } catch (Exception e) {
            loggingService.logError("Test error endpoint triggered", e);
            return ResponseEntity.internalServerError()
                    .body("Error logged successfully - check logs!");
        }
    }

    private String getClientIpAddress(HttpServletRequest request) {
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