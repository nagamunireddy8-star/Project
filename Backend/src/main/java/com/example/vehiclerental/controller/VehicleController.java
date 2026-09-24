package com.example.vehiclerental.controller;

import com.example.vehiclerental.dto.ApiResponse;
import com.example.vehiclerental.dto.VehicleRequest;
import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.service.VehicleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class VehicleController {

    private final VehicleService vehicleService;

    @GetMapping("/vehicles")
    public ResponseEntity<ApiResponse> getAllVehicles(@RequestParam(required = false) String search) {
        List<Vehicle> vehicles = vehicleService.searchVehicles(search);
        return ResponseEntity.ok(ApiResponse.success("Vehicles fetched successfully", vehicles));
    }

    @GetMapping("/vehicles/{id}")
    public ResponseEntity<ApiResponse> getVehicle(@PathVariable Long id) {
        Vehicle vehicle = vehicleService.getVehicleById(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle details fetched successfully", vehicle));
    }

    @PostMapping("/vehicles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> addVehicle(@Valid @RequestBody VehicleRequest request) {
        Vehicle vehicle = vehicleService.addVehicle(request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle added successfully", vehicle));
    }

    @PutMapping("/vehicles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        Vehicle vehicle = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(ApiResponse.success("Vehicle updated successfully", vehicle));
    }

    @DeleteMapping("/vehicles/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok(ApiResponse.success("Vehicle deleted successfully", null));
    }
}
