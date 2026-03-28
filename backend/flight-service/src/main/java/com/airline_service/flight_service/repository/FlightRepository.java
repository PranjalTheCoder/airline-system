package com.airline_service.flight_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline_service.flight_service.entity.FlightEntity;

public interface FlightRepository extends JpaRepository<FlightEntity, Long> {
    List<FlightEntity> findByRouteId(Long routeId);
    Optional<FlightEntity> findByFlightNumber(String flightNumber);
}