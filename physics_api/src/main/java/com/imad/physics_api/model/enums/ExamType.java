package com.imad.physics_api.model.enums;

public enum ExamType {
    CONTROLE_CONTINU("Contrôle Continu"),
    DEVOIR_SURVEILLE("Devoir Surveillé"),
    COMPOSITION("Composition"),
    EXAMEN_REGIONAL("Examen Régional"),
    EXAMEN_NATIONAL("Examen National"),
    EXAMEN_BLANC("Examen Blanc"),
    CONCOURS("Concours");

    private final String displayName;

    ExamType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}