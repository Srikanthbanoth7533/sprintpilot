package com.sprintpilot.api.entity;

public enum Role {
    ROLE_ADMIN,
    ROLE_PRODUCT_MANAGER,
    ROLE_DEVELOPER,
    ROLE_VIEWER;

    public String getCleanName() {
        return name().replace("ROLE_", "");
    }
}
