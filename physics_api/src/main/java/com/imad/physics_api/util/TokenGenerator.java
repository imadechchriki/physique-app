package com.imad.physics_api.util;

import java.security.SecureRandom;
import java.util.UUID;

public class TokenGenerator {

    private static final SecureRandom random = new SecureRandom();

    public static String generateResetToken() {
        return UUID.randomUUID().toString().replace("-", "") +
                Long.toHexString(System.currentTimeMillis());
    }

    public static String generateVerificationToken() {
        return UUID.randomUUID().toString();
    }
}