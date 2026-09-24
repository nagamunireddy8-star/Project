package com.example.vehiclerental.controller;

import com.example.vehiclerental.dto.ApiResponse;
import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.entity.Rental;
import com.example.vehiclerental.entity.User;
import com.example.vehiclerental.repository.UserRepository;
import com.example.vehiclerental.repository.BookingRepository;
import com.example.vehiclerental.repository.RentalRepository;
import com.example.vehiclerental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class RentalController {

    private final BookingRepository bookingRepository;
    private final RentalRepository rentalRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    @PutMapping("/rentals/{bookingId}/start")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<ApiResponse> startRental(@PathVariable Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        if (rentalRepository.findByBooking(booking).isPresent()) {
            throw new IllegalArgumentException("Rental already started for this booking");
        }

        Rental rental = Rental.builder()
            .booking(booking)
            .startedAt(LocalDateTime.now())
            .status(Rental.RentalStatus.ACTIVE)
            .build();

        rentalRepository.save(rental);
        booking.getVehicle().setAvailable(false);
        vehicleRepository.save(booking.getVehicle());

        Map<String, Object> data = new HashMap<>();
        data.put("bookingId", bookingId);
        data.put("startTime", rental.getStartedAt());
        data.put("status", rental.getStatus());

        return ResponseEntity.ok(ApiResponse.success("Rental started successfully", data));
    }

    @PutMapping("/rentals/{bookingId}/return")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<ApiResponse> returnRental(@PathVariable Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));

        Rental rental = rentalRepository.findByBooking(booking)
            .orElseThrow(() -> new IllegalArgumentException("No active rental found for this booking"));

        rental.setReturnedAt(LocalDateTime.now());
        rental.setStatus(Rental.RentalStatus.RETURNED);
        rentalRepository.save(rental);

        booking.setStatus(Booking.BookingStatus.COMPLETED);
        booking.getVehicle().setAvailable(true);
        bookingRepository.save(booking);
        vehicleRepository.save(booking.getVehicle());

        Map<String, Object> data = new HashMap<>();
        data.put("bookingId", bookingId);
        data.put("returnedAt", rental.getReturnedAt());
        data.put("status", rental.getStatus());

        return ResponseEntity.ok(ApiResponse.success("Vehicle returned successfully", data));
    }
}
