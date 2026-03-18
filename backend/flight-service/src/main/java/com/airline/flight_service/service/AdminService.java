package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Airport;
import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.entity.FlightSchedule;
import com.airline.flight_service.entity.Route;
import com.airline.flight_service.repository.AirportRepository;
import com.airline.flight_service.repository.FlightRepository;
import com.airline.flight_service.repository.FlightScheduleRepository;
import com.airline.flight_service.repository.RouteRepository;

@Service
public class AdminService {

    private final FlightRepository flightRepo;
    private final FlightScheduleRepository scheduleRepo;
    private final AirportRepository airportRepo;
    private final RouteRepository routeRepo;

    public AdminService(FlightRepository flightRepo,
                        FlightScheduleRepository scheduleRepo,
                        AirportRepository airportRepo,
                        RouteRepository routeRepo) {
        this.flightRepo = flightRepo;
        this.scheduleRepo = scheduleRepo;
        this.airportRepo = airportRepo;
        this.routeRepo = routeRepo;
    }

    // 🔥 GET ALL FLIGHTS
    public List<Flight> getAllFlights() {
        return flightRepo.findAll();
    }

    // 🔥 GET ALL SCHEDULES
    public List<FlightSchedule> getAllSchedules() {
        return scheduleRepo.findAll();
    }

    // 🔥 GET ALL AIRPORTS
    public List<Airport> getAllAirports() {
        return airportRepo.findAll();
    }

    // 🔥 GET ALL ROUTES
    public List<Route> getAllRoutes() {
        return routeRepo.findAll();
    }
}