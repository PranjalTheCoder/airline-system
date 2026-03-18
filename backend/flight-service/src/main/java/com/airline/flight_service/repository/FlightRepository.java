package com.airline.flight_service.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.Flight;

public interface FlightRepository extends JpaRepository<Flight, Long> {
	Flight findByFlightNumber(String flightNumber);

    List<Flight> findByAirlineId(Long airlineId);

    List<Flight> findByRouteId(Long routeId);
}