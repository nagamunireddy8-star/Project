package com.example.vehiclerental.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class VehicleRequest {
    @NotBlank
    private String brand;

    @NotBlank
    private String model;

    @NotBlank
    private String vehicleType;

    @NotBlank
    private String fuelType;

    @NotBlank
    private String transmission;

    @NotNull
    private Integer year;

    @NotNull
    private Integer seats;

    @NotNull
    private Double dailyRate;

    @NotBlank
    private String location;

    @NotBlank
    private String registrationNumber;

    private String description;

    private List<String> imageUrls;
}
