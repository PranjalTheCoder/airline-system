package com.airline.flight_service.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.Route;

public interface RouteRepository extends JpaRepository<Route, Long> {

    Route findByOriginIataCodeAndDestinationIataCode(String origin, String destination);
}