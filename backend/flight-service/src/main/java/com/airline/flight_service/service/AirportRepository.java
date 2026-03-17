package com.airline.flight_service.service;

import com.airline.flight_service.entity.Airport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;



public interface AirportRepository extends JpaRepository<Airport, Long> {

    List<Airport> findByCityContainingIgnoreCase(String city);
}