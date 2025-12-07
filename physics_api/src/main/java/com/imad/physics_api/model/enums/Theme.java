package com.imad.physics_api.model.enums;

public enum Theme {
    LIGHT("light", "Clair"),
    DARK("dark", "Sombre"),
    AUTO("auto", "Automatique");

    private final String value;
    private final String displayName;

    Theme(String value, String displayName) {
        this.value = value;
        this.displayName = displayName;
    }

    public String getValue() {
        return value;
    }

    public String getDisplayName() {
        return displayName;
    }

    // Méthode utilitaire pour convertir depuis la valeur string
    public static Theme fromValue(String value) {
        if (value == null) return LIGHT; // valeur par défaut

        for (Theme theme : values()) {
            if (theme.value.equalsIgnoreCase(value)) {
                return theme;
            }
        }
        return LIGHT; // valeur par défaut si non trouvé
    }
}