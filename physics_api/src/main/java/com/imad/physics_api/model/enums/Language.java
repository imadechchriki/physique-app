package com.imad.physics_api.model.enums;

public enum Language {
    FRENCH("fr", "Français"),
    ENGLISH("en", "English"),
    ARABIC("ar", "العربية");

    private final String code;
    private final String displayName;

    Language(String code, String displayName) {
        this.code = code;
        this.displayName = displayName;
    }

    public String getCode() {
        return code;
    }

    public String getDisplayName() {
        return displayName;
    }

    // Méthode utilitaire pour convertir depuis le code
    public static Language fromCode(String code) {
        if (code == null) return FRENCH; // valeur par défaut

        for (Language language : values()) {
            if (language.code.equalsIgnoreCase(code)) {
                return language;
            }
        }
        return FRENCH; // valeur par défaut si non trouvé
    }
}