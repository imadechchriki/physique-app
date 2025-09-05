// CourseStatus.java
package com.imad.physics_api.model.enums;

public enum CourseStatus {
    DRAFT("Draft"),
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    ARCHIVED("Archived");

    private final String displayName;

    CourseStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}