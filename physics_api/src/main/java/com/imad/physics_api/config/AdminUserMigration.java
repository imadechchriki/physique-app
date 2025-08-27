package com.imad.physics_api.config;

import com.imad.physics_api.model.entity.User;
import com.imad.physics_api.model.entity.UserPreferences;
import com.imad.physics_api.model.entity.UserProfile;
import com.imad.physics_api.model.enums.UserRole;
import com.imad.physics_api.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserMigration implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(AdminUserMigration.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@physics-api.com}")
    private String adminEmail;

    @Value("${app.admin.password:admin123}")
    private String adminPassword;

    @Value("${app.admin.firstName:Physics}")
    private String adminFirstName;

    @Value("${app.admin.lastName:Admin}")
    private String adminLastName;

    @Override
    public void run(String... args) {
        createAdminUserIfNotExists();
    }

    private void createAdminUserIfNotExists() {
        if (!userRepository.existsByEmail(adminEmail)) {
            try {
                // Create admin user
                User adminUser = new User();
                adminUser.setFirstName(adminFirstName);
                adminUser.setLastName(adminLastName);
                adminUser.setEmail(adminEmail);
                adminUser.setPasswordHash(passwordEncoder.encode(adminPassword));
                adminUser.setRole(UserRole.ADMIN);
                adminUser.setIsActive(true);
                adminUser.setEmailVerified(true);

                // Save admin user
                adminUser = userRepository.save(adminUser);

                // Create admin profile
                UserProfile adminProfile = new UserProfile(adminUser);
                adminProfile.setCity("System");
                adminProfile.setBio("System administrator for Physics API");
                adminUser.setProfile(adminProfile);

                // Create admin preferences
                UserPreferences adminPreferences = new UserPreferences(adminUser);
                adminUser.setPreferences(adminPreferences);

                // Save with profile and preferences
                userRepository.save(adminUser);

                logger.info("✅ Admin user created successfully:");
                logger.info("   Email: {}", adminEmail);
                logger.info("   Password: {}", adminPassword);
                logger.info("   ⚠️  IMPORTANT: Change the default password in production!");

            } catch (Exception e) {
                logger.error("❌ Failed to create admin user: {}", e.getMessage());
            }
        } else {
            logger.info("📋 Admin user already exists: {}", adminEmail);
        }
    }
}