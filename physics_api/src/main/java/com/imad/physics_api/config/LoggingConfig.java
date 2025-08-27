package com.imad.physics_api.config;

import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Paths;

@Configuration
public class LoggingConfig {

    private static final Logger logger = LoggerFactory.getLogger(LoggingConfig.class);

    @Value("${LOG_DIR:./logs}")
    private String logDir;

    @PostConstruct
    public void initializeLogDirectories() {
        try {
            // Create main log directory
            Files.createDirectories(Paths.get(logDir));

            // Create subdirectories
            Files.createDirectories(Paths.get(logDir, "daily"));
            Files.createDirectories(Paths.get(logDir, "error"));
            Files.createDirectories(Paths.get(logDir, "archived"));

            logger.info("📁 Log directories initialized successfully at: {}",
                    new File(logDir).getAbsolutePath());

        } catch (Exception e) {
            logger.error("❌ Failed to create log directories", e);
        }
    }
}