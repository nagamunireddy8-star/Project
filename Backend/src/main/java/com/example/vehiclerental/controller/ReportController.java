package com.example.vehiclerental.controller;

import com.example.vehiclerental.dto.ApiResponse;
import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.repository.BookingRepository;
import com.example.vehiclerental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class ReportController {

    private final VehicleRepository vehicleRepository;
    private final BookingRepository bookingRepository;

    @GetMapping("/reports/vehicles")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> vehicleUtilization() {
        List<Vehicle> vehicles = vehicleRepository.findAll();
        long totalVehicles = vehicles.size();
        long availableVehicles = vehicles.stream().filter(Vehicle::isAvailable).count();

        Map<String, Object> data = new HashMap<>();
        data.put("totalVehicles", totalVehicles);
        data.put("availableVehicles", availableVehicles);
        data.put("utilizedVehicles", totalVehicles - availableVehicles);
        return ResponseEntity.ok(ApiResponse.success("Vehicle utilization report", data));
    }

    @GetMapping("/reports/bookings")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse> bookingStatistics() {
        List<Booking> bookings = bookingRepository.findAllByOrderByBookingDateDesc();
        double totalRevenue = bookings.stream().mapToDouble(Booking::getTotalPrice).sum();

        Map<String, Object> data = new HashMap<>();
        data.put("totalBookings", bookings.size());
        data.put("totalRevenue", totalRevenue);
        data.put("confirmedBookings", bookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.CONFIRMED).count());
        data.put("cancelledBookings", bookings.stream().filter(b -> b.getStatus() == Booking.BookingStatus.CANCELLED).count());
        return ResponseEntity.ok(ApiResponse.success("Booking statistics", data));
    }
}
