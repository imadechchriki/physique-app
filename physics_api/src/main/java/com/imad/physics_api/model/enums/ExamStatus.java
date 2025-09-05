package com.imad.physics_api.model.enums;

public enum ExamStatus {
    DRAFT("Draft"),
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    ARCHIVED("Archived");

    private final String displayName;

    ExamStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}