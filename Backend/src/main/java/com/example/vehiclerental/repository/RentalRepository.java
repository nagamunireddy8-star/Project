package com.example.vehiclerental.repository;

import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.entity.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RentalRepository extends JpaRepository<Rental, Long> {
    Optional<Rental> findByBooking(Booking booking);
}
