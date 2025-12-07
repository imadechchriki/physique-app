package com.imad.physics_api.model.enums;

public enum AcademicLevel {
    TRONC_COMMUN("Tronc Commun"),
    PREMIERE_BAC("Première Baccalauréat"),
    DEUXIEME_BAC("Deuxième Baccalauréat");

    private final String displayName;

    AcademicLevel(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}