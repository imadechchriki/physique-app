package com.imad.physics_api.model.enums;


public enum ContentStatus {
    DRAFT("Brouillon"),
    PUBLISHED("Publié"),
    ARCHIVED("Archivé"),
    UNDER_REVIEW("En révision");

    private final String displayName;

    ContentStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}