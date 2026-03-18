package com.airline.flight_service.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class FlightTrackingService {

    private final FlightInstanceRepository repository;

    public FlightTrackingService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    // 🔥 TRACKING (FULL DETAILS)
    public FlightInstance getTracking(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instance not found"));
    }

    // 🔥 POSITION (SIMULATED)
    public String getPosition(Long id) {
        FlightInstance instance = getTracking(id);

        return "Flight " + instance.getId() + " is currently in air (simulated)";
    }

    // 🔥 DEPARTURES
    public List<FlightInstance> getDepartures(String airport) {
        return repository
                .findByScheduleFlightRouteOriginIataCodeAndDepartureDate(
                        airport, LocalDate.now());
    }

    // 🔥 ARRIVALS
    public List<FlightInstance> getArrivals(String airport) {
        return repository
                .findByScheduleFlightRouteDestinationIataCodeAndDepartureDate(
                        airport, LocalDate.now());
    }
}