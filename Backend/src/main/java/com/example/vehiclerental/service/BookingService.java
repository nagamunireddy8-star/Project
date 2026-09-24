package com.example.vehiclerental.service;

import com.example.vehiclerental.dto.BookingRequest;
import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.entity.User;
import com.example.vehiclerental.entity.Vehicle;
import com.example.vehiclerental.repository.BookingRepository;
import com.example.vehiclerental.repository.UserRepository;
import com.example.vehiclerental.repository.VehicleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;
    private final UserRepository userRepository;

    public Booking createBooking(Long userId, BookingRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
            .orElseThrow(() -> new IllegalArgumentException("Vehicle not found"));

        if (!vehicle.isAvailable()) {
            throw new IllegalArgumentException("Vehicle is not available for booking");
        }

        if (request.getStartDate().isAfter(request.getEndDate())) {
            throw new IllegalArgumentException("Start date must be before or equal to end date");
        }

        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        double totalPrice = days * vehicle.getDailyRate();

        Booking booking = Booking.builder()
            .user(user)
            .vehicle(vehicle)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .totalPrice(totalPrice)
            .bookingDate(LocalDate.now())
            .status(Booking.BookingStatus.CONFIRMED)
            .pickupLocation(request.getPickupLocation() == null ? vehicle.getLocation() : request.getPickupLocation())
            .dropoffLocation(request.getDropoffLocation() == null ? vehicle.getLocation() : request.getDropoffLocation())
            .build();

        vehicle.setAvailable(false);
        vehicleRepository.save(vehicle);
        return bookingRepository.save(booking);
    }

    public List<Booking> getMyBookings(Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return bookingRepository.findByUserOrderByBookingDateDesc(user);
    }

    public Booking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
            .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    public Booking cancelBooking(Long bookingId) {
        Booking booking = getBookingById(bookingId);
        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new IllegalArgumentException("Booking is already cancelled");
        }

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        booking.getVehicle().setAvailable(true);
        vehicleRepository.save(booking.getVehicle());
        return bookingRepository.save(booking);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByBookingDateDesc();
    }
}
