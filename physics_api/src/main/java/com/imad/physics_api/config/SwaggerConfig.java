package com.imad.physics_api.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${server.port:8080}")
    private String serverPort;

    @Value("${server.servlet.context-path:/api}")
    private String contextPath;

    @Bean
    public OpenAPI customOpenAPI() {
        Server localServer = new Server()
                .url("http://localhost:" + serverPort + contextPath)
                .description("Local Development Server");

        Server productionServer = new Server()
                .url("https://your-production-domain.com" + contextPath)
                .description("Production Server");

        Contact contact = new Contact()
                .name("Physics API Team")
                .email("contact@physics-api.com")
                .url("https://github.com/your-username/physics-api");

        License license = new License()
                .name("MIT License")
                .url("https://opensource.org/licenses/MIT");

        Info apiInfo = new Info()
                .title("Physics API")
                .version("1.0.0")
                .description("A comprehensive API for physics calculations and simulations")
                .contact(contact)
                .license(license);

        return new OpenAPI()
                .info(apiInfo)
                .servers(List.of(localServer, productionServer));
    }
}