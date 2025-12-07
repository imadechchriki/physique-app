package com.imad.physics_api.model.enums;

public enum ExamType {
    NATIONAL_EXAM("Examen National"),
    REGIONAL_EXAM("Examen Régional"),
    MOCK_EXAM("Examen Blanc"),
    CONTINUOUS_ASSESSMENT("Contrôle Continu"),
    HOMEWORK("Devoir Surveillé"),
    QUIZ("Quiz"),
    PRACTICE_EXAM("Examen d'Entraînement");

    private final String displayName;

    ExamType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}