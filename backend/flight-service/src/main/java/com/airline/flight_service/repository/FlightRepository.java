package com.airline.flight_service.repository;



import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.entity.Route;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FlightRepository extends JpaRepository<Flight, Long> {

    Optional<Flight> findByFlightNumber(String flightNumber);

    List<Flight> findByAirlineId(Long airlineId);

    List<Flight> findByRoute(Route route);
}