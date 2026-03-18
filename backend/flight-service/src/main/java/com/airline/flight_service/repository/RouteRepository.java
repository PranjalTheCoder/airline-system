package com.airline.flight_service.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.Route;
import com.airline.flight_service.entity.Flight;

public interface RouteRepository extends JpaRepository<Route, Long> {

    Route findByOriginIataCodeAndDestinationIataCode(String origin, String destination);
    
    List<Route> findByOriginIdOrDestinationId(Long originId, Long destinationId);

}