package com.example.vehiclerental.repository;

import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.entity.VehicleRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VehicleRegistrationRepository extends JpaRepository<VehicleRegistration, Long> {
    Optional<VehicleRegistration> findByVehicle(Vehicle vehicle);
}
