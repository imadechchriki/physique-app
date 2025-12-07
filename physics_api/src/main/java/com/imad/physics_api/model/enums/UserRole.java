package com.imad.physics_api.model.enums;

public enum UserRole {
    ADMIN("Admin - Full access to system management"),
    STUDENT("Student - Access to courses, quizzes, and personal profile");

    private final String description;

    UserRole(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}