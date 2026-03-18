package com.airline.flight_service.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {
}