package com.airline.flight_service.service;


import java.time.LocalDate;
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

    private final RouteRepository routeRepository;
    private final FlightRepository flightRepository;
    private final FlightScheduleRepository scheduleRepository;
    private final FlightInstanceRepository instanceRepository;

    public SearchService(RouteRepository routeRepository,
                         FlightRepository flightRepository,
                         FlightScheduleRepository scheduleRepository,
                         FlightInstanceRepository instanceRepository) {
        this.routeRepository = routeRepository;
        this.flightRepository = flightRepository;
        this.scheduleRepository = scheduleRepository;
        this.instanceRepository = instanceRepository;
    }

    public List<FlightInstance> searchFlights(String origin,
                                              String destination,
                                              LocalDate date) {

        Route route = routeRepository.findRoute(origin, destination);

        List<Flight> flights = flightRepository.findByRoute(route);

        List<FlightSchedule> schedules = scheduleRepository.findByFlightIn(flights);

        return instanceRepository.findByScheduleInAndDepartureDate(schedules, date);
    }
}