package com.airline.flight_service.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.*;
import com.airline.flight_service.repository.*;

@Service
public class SearchService {

    private final RouteRepository routeRepo;
    private final FlightRepository flightRepo;
    private final FlightScheduleRepository scheduleRepo;
    private final FlightInstanceRepository instanceRepo;

    public SearchService(RouteRepository routeRepo,
                         FlightRepository flightRepo,
                         FlightScheduleRepository scheduleRepo,
                         FlightInstanceRepository instanceRepo) {
        this.routeRepo = routeRepo;
        this.flightRepo = flightRepo;
        this.scheduleRepo = scheduleRepo;
        this.instanceRepo = instanceRepo;
    }

    public List<FlightInstance> search(String origin, String destination, LocalDate date) {

        // 1. Find route
        Route route = routeRepo
                .findByOriginIataCodeAndDestinationIataCode(origin, destination);

        if (route == null) {
            throw new RuntimeException("Route not found");
        }

        // 2. Find flights for route
        List<Flight> flights = flightRepo.findByRouteId(route.getId());

        if (flights.isEmpty()) {
            throw new RuntimeException("No flights found");
        }

        // 3. Find schedules
        List<FlightSchedule> schedules = scheduleRepo.findByFlightIn(flights);

        if (schedules.isEmpty()) {
            throw new RuntimeException("No schedules found");
        }

        // 4. Find instances for date
        List<FlightInstance> instances =
                instanceRepo.findByScheduleInAndDepartureDate(schedules, date);

        return instances;
    }
}