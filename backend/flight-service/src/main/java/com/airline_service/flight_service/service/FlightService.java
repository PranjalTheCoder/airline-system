package com.airline_service.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.entity.FlightEntity;
import com.airline_service.flight_service.repository.FlightRepository;

@Service
public class FlightService {

    private final FlightRepository flightRepository;

    public FlightService(FlightRepository flightRepository) {
        this.flightRepository = flightRepository;
    }

    public List<FlightEntity> getFlightsByRoute(Long routeId) {
        return flightRepository.findByRouteId(routeId);
    }

    public List<FlightEntity> getAllFlights() {
        return flightRepository.findAll();
    }

    public FlightEntity getFlightById(Long id) {
        return flightRepository.findById(id).orElse(null);
    }
}