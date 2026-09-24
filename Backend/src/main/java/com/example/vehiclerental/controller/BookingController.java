package com.example.vehiclerental.controller;

import com.example.vehiclerental.dto.ApiResponse;
import com.example.vehiclerental.dto.BookingRequest;
import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.entity.User;
import com.example.vehiclerental.repository.UserRepository;
import com.example.vehiclerental.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping("/bookings")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> createBooking(@Valid @RequestBody BookingRequest request) {
        Long userId = getCurrentUserId();
        Booking booking = bookingService.createBooking(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Booking created successfully", booking));
    }

    @GetMapping("/bookings/my")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse> getMyBookings() {
        Long userId = getCurrentUserId();
        List<Booking> bookings = bookingService.getMyBookings(userId);
        return ResponseEntity.ok(ApiResponse.success("My bookings fetched successfully", bookings));
    }

    @GetMapping("/bookings/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<ApiResponse> getBooking(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.success("Booking details fetched successfully", booking));
    }

    @PutMapping("/bookings/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER','ADMIN')")
    public ResponseEntity<ApiResponse> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.success("Booking cancelled successfully", booking));
    }

    private Long getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return user.getId();
    }
}
