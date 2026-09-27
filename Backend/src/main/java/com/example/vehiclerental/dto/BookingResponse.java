package com.example.vehiclerental.dto;

import com.example.vehiclerental.entity.Booking;

import java.time.LocalDate;
import java.util.List;

public record BookingResponse(
    Long id,
    UserSummary user,
    VehicleSummary vehicle,
    LocalDate startDate,
    LocalDate endDate,
    double totalPrice,
    LocalDate bookingDate,
    Booking.BookingStatus status,
    String pickupLocation,
    String dropoffLocation
) {

    public static BookingResponse from(Booking booking) {
        var user = booking.getUser();
        var vehicle = booking.getVehicle();

        return new BookingResponse(
            booking.getId(),
            new UserSummary(user.getId(), user.getFirstName(), user.getLastName(), user.getEmail(), user.getRole()),
            new VehicleSummary(
                vehicle.getId(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getVehicleType(),
                vehicle.getFuelType(),
                vehicle.getTransmission(),
                vehicle.getYear(),
                vehicle.getSeats(),
                vehicle.getDailyRate(),
                vehicle.getLocation(),
                vehicle.getRegistrationNumber(),
                vehicle.getDescription(),
                vehicle.isAvailable(),
                List.copyOf(vehicle.getImageUrls())
            ),
            booking.getStartDate(),
            booking.getEndDate(),
            booking.getTotalPrice(),
            booking.getBookingDate(),
            booking.getStatus(),
            booking.getPickupLocation(),
            booking.getDropoffLocation()
        );
    }

    public record UserSummary(
        Long id,
        String firstName,
        String lastName,
        String email,
        com.example.vehiclerental.entity.User.Role role
    ) {}

    public record VehicleSummary(
        Long id,
        String brand,
        String model,
        String vehicleType,
        String fuelType,
        String transmission,
        int year,
        int seats,
        double dailyRate,
        String location,
        String registrationNumber,
        String description,
        boolean available,
        List<String> imageUrls
    ) {}
}
