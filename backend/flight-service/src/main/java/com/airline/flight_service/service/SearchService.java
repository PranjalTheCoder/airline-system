package com.airline.flight_service.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.FlightSchedule;
import com.airline.flight_service.entity.Route;
import com.airline.flight_service.repository.FlightInstanceRepository;
import com.airline.flight_service.repository.FlightRepository;
import com.airline.flight_service.repository.FlightScheduleRepository;
import com.airline.flight_service.repository.RouteRepository;

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

    public List<FlightInstance> search(String origin, String destination, java.time.LocalDate date) {

        Route route = routeRepo.findByOriginIataCodeAndDestinationIataCode(origin, destination);

        List<Flight> flights = flightRepo.findAll();

        List<FlightSchedule> schedules = scheduleRepo.findAll();

        return instanceRepo.findAll(); // simple version
    }
}