package com.imad.physics_api.model.enums;

public enum SectionType {
    INTRODUCTION("Introduction"),
    THEORY("Théorie"),
    DEFINITION("Définition"),
    THEOREM("Théorème"),
    PROOF("Démonstration"),
    EXAMPLE("Exemple"),
    EXERCISE("Exercice"),
    SOLUTION("Solution"),
    REMARK("Remarque"),
    CONCLUSION("Conclusion"),
    SUMMARY("Résumé"),
    FORMULA("Formule"),
    EXPERIMENT("Expérience"),
    APPLICATION("Application"),
    CUSTOM("Personnalisé");

    private final String displayName;

    SectionType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}