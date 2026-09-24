package com.example.vehiclerental.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI vehicleRentalOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Vehicle Rental System API")
                .description("Demo backend for vehicle rental application with JWT auth, H2 database, and admin/customer flows")
                .version("1.0.0"));
    }
}
