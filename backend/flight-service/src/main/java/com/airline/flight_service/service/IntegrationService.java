package com.airline.flight_service.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.airline.flight_service.dto.*;
import com.airline.flight_service.entity.*;
import com.airline.flight_service.repository.*;

@Service
public class IntegrationService {

    private final FlightRepository flightRepo;
    private final FlightInstanceRepository instanceRepo;
    private final SearchService searchService;

    public IntegrationService(FlightRepository flightRepo,
                              FlightInstanceRepository instanceRepo,
                              SearchService searchService) {
        this.flightRepo = flightRepo;
        this.instanceRepo = instanceRepo;
        this.searchService = searchService;
    }

    // 🔥 GET FLIGHT BY ID
    public FlightIntegrationResponse getFlight(Long id) {

        Flight f = flightRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));

        return new FlightIntegrationResponse(
                f.getId(),
                f.getFlightNumber(),
                f.getAirline().getName(),
                f.getRoute().getOrigin().getIataCode(),
                f.getRoute().getDestination().getIataCode()
        );
    }

    // 🔥 GET INSTANCE BY ID
    public FlightInstanceIntegrationResponse getInstance(Long id) {

        FlightInstance i = instanceRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        return new FlightInstanceIntegrationResponse(
                i.getId(),
                i.getSchedule().getFlight().getFlightNumber(),
                i.getDepartureDate(),
                i.getStatus().name()
        );
    }

    // 🔥 SEARCH (LIGHTWEIGHT)
    public List<FlightInstanceIntegrationResponse> search(String origin,
                                                         String destination,
                                                         java.time.LocalDate date) {

        return searchService.search(origin, destination, date)
                .stream()
                .map(i -> new FlightInstanceIntegrationResponse(
                        i.getId(),
                        i.getSchedule().getFlight().getFlightNumber(),
                        i.getDepartureDate(),
                        i.getStatus().name()
                ))
                .collect(Collectors.toList());
    }
}