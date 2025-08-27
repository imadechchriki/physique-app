package com.imad.physics_api;

import com.imad.physics_api.config.EnvironmentConfig;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class PhysicsApiApplication {

    public static void main(String[] args) {
        SpringApplication app = new SpringApplication(PhysicsApiApplication.class);
        app.addInitializers(new EnvironmentConfig());
        app.run(args);
    }
}