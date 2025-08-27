package com.imad.physics_api.model.enums;

public enum Branch {
    SM_MATHS_PHYSIQUE("Sciences Mathématiques"),
    PC_SCIENCES_EXPERIMENTALES("Sciences Physiques et Chimiques"),
    SVT_BIOLOGIE_GEOLOGIE("Sciences de la Vie et de la Terre");

    private final String displayName;

    Branch(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}