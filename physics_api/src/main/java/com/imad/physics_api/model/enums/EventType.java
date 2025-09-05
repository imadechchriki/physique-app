package com.imad.physics_api.model.enums;

public enum EventType {
    // Authentication events
    LOGIN, LOGOUT, FAILED_LOGIN,
    PROFILE_UPDATE, PASSWORD_CHANGE,

    // Course and Exam events
    COURSE_VIEW, COURSE_UPLOAD, COURSE_UPDATE, COURSE_DELETE,
    EXAM_VIEW, EXAM_UPLOAD, EXAM_UPDATE, EXAM_DELETE,

    // Quiz events (for future implementation)
    QUIZ_START, QUIZ_COMPLETE,

    // File operations
    DOWNLOAD, UPLOAD, FILE_ACCESS,

    // Account management
    ACCOUNT_CREATED, USER_MANAGEMENT, ACCOUNT_STATUS_CHANGE, ACCOUNT_DELETED,

    // Security events
    UNAUTHORIZED_ACCESS, SUSPICIOUS_ACTIVITY
}