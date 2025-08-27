package com.imad.physics_api.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class LoggingService {

    private static final Logger logger = LoggerFactory.getLogger(LoggingService.class);

    public void logInfo(String message) {
        logger.info(message);
    }

    public void logDebug(String message) {
        logger.debug(message);
    }

    public void logWarn(String message) {
        logger.warn(message);
    }

    public void logError(String message) {
        logger.error(message);
    }

    public void logError(String message, Throwable throwable) {
        logger.error(message, throwable);
    }

    public void logUserAction(String username, String action) {
        logger.info("USER_ACTION - User: {} performed action: {}", username, action);
    }

    public void logDatabaseOperation(String operation, String table, String details) {
        logger.info("DB_OPERATION - Operation: {} on table: {} - Details: {}",
                operation, table, details);
    }

    public void logApiRequest(String method, String endpoint, String clientIp) {
        logger.info("API_REQUEST - Method: {} Endpoint: {} Client: {}",
                method, endpoint, clientIp);
    }

    public void logSystemEvent(String event, String details) {
        logger.info("SYSTEM_EVENT - Event: {} Details: {}", event, details);
    }
}