package com.imad.physics_api.model.enums;

public enum EventType {
    LOGIN, LOGOUT, FAILED_LOGIN,
    PROFILE_UPDATE, PASSWORD_CHANGE, // Add PASSWORD_CHANGE
    COURSE_VIEW, QUIZ_START, QUIZ_COMPLETE,
    DOWNLOAD, UPLOAD, ACCOUNT_CREATED,

    // Événements de gestion des utilisateurs (manquants dans votre code)
    USER_MANAGEMENT,
    ACCOUNT_STATUS_CHANGE,
    ACCOUNT_DELETED,
}