package com.example.vehiclerental.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "vehicles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vehicle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String brand;

    @Column(nullable = false)
    private String model;

    @Column(nullable = false)
    private String vehicleType;

    @Column(nullable = false)
    private String fuelType;

    @Column(nullable = false)
    private String transmission;

    @Column(name = "model_year", nullable = false)
    private int year;

    @Column(nullable = false)
    private int seats;

    @Column(nullable = false)
    private double dailyRate;

    @Column(nullable = false)
    private String location;

    @Column(nullable = false)
    private String registrationNumber;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean available = true;

    @ElementCollection
    @CollectionTable(name = "vehicle_images", joinColumns = @JoinColumn(name = "vehicle_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();
}
