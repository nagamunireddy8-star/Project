package com.example.vehiclerental.controller;

import com.example.vehiclerental.dto.ApiResponse;
import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.entity.VehicleRegistration;
import com.example.vehiclerental.repository.VehicleRegistrationRepository;
import com.example.vehiclerental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class VehicleRegistrationController {

    private final VehicleRepository vehicleRepository;
    private final VehicleRegistrationRepository vehicleRegistrationRepository;

    @PostMapping("/vehicle-registrations")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> registerVehicle(@RequestBody Map<String, Object> data) {
        Long vehicleId = Long.valueOf(data.get("vehicleId").toString());
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        VehicleRegistration registration = VehicleRegistration.builder()
            .vehicle(vehicle)
            .documentType(String.valueOf(data.getOrDefault("documentType", "Registration")))
            .documentNumber(String.valueOf(data.getOrDefault("documentNumber", "N/A")))
            .issuedDate(LocalDate.parse(String.valueOf(data.getOrDefault("issuedDate", LocalDate.now()))))
            .expiryDate(LocalDate.parse(String.valueOf(data.getOrDefault("expiryDate", LocalDate.now().plusYears(1)))))
            .status(String.valueOf(data.getOrDefault("status", "VALID")))
            .build();

        VehicleRegistration saved = vehicleRegistrationRepository.save(registration);
        return ResponseEntity.ok(ApiResponse.success("Vehicle registration saved", saved));
    }

    @GetMapping("/vehicle-registrations/{vehicleId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> getVehicleRegistration(@PathVariable Long vehicleId) {
        Vehicle vehicle = vehicleRepository.findById(vehicleId)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        VehicleRegistration registration = vehicleRegistrationRepository.findByVehicle(vehicle)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle registration not found"));

        return ResponseEntity.ok(ApiResponse.success("Vehicle registration fetched", registration));
    }
}
