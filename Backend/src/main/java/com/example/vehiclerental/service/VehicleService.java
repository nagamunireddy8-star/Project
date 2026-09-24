package com.example.vehiclerental.service;

import com.example.vehiclerental.dto.VehicleRequest;
import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public List<Vehicle> getAllAvailableVehicles() {
        return vehicleRepository.findByAvailableTrueOrderByDailyRateAsc();
    }

    public List<Vehicle> searchVehicles(String query) {
        if (query == null || query.isBlank()) {
            return getAllAvailableVehicles();
        }
        return vehicleRepository.findByBrandContainingIgnoreCaseOrModelContainingIgnoreCase(query, query);
    }

    public Vehicle getVehicleById(Long id) {
        return vehicleRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found with id: " + id));
    }

    public Vehicle addVehicle(VehicleRequest request) {
        Vehicle vehicle = Vehicle.builder()
            .brand(request.getBrand())
            .model(request.getModel())
            .vehicleType(request.getVehicleType())
            .fuelType(request.getFuelType())
            .transmission(request.getTransmission())
            .year(request.getYear())
            .seats(request.getSeats())
            .dailyRate(request.getDailyRate())
            .location(request.getLocation())
            .registrationNumber(request.getRegistrationNumber())
            .description(request.getDescription())
            .available(true)
            .imageUrls(Optional.ofNullable(request.getImageUrls()).orElse(List.of()))
            .build();

        return vehicleRepository.save(vehicle);
    }

    public Vehicle updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = getVehicleById(id);
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setVehicleType(request.getVehicleType());
        vehicle.setFuelType(request.getFuelType());
        vehicle.setTransmission(request.getTransmission());
        vehicle.setYear(request.getYear());
        vehicle.setSeats(request.getSeats());
        vehicle.setDailyRate(request.getDailyRate());
        vehicle.setLocation(request.getLocation());
        vehicle.setRegistrationNumber(request.getRegistrationNumber());
        vehicle.setDescription(request.getDescription());
        if (request.getImageUrls() != null) {
            vehicle.setImageUrls(request.getImageUrls());
        }
        return vehicleRepository.save(vehicle);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = getVehicleById(id);
        vehicleRepository.delete(vehicle);
    }
}
