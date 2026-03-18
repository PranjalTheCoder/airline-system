package com.airline.flight_service.repository;


import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.Airport;

public interface AirportRepository extends JpaRepository<Airport, Long> {

    List<Airport> findByCityContainingIgnoreCase(String city);
}