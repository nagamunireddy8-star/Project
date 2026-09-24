package com.example.vehiclerental.repository;

import com.example.vehiclerental.entity.Booking;
import com.example.vehiclerental.entity.User;
import com.example.vehiclerental.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserOrderByBookingDateDesc(User user);
    List<Booking> findByVehicleOrderByBookingDateDesc(Vehicle vehicle);
    List<Booking> findAllByOrderByBookingDateDesc();
}
