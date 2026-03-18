package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.Airport;
import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.entity.FlightSchedule;
import com.airline.flight_service.entity.Route;
import com.airline.flight_service.service.AdminService;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService service;

    public AdminController(AdminService service) {
        this.service = service;
    }

    // 🔥 FLIGHTS
    @GetMapping("/flights")
    public List<Flight> getFlights() {
        return service.getAllFlights();
    }

    // 🔥 SCHEDULES
    @GetMapping("/schedules")
    public List<FlightSchedule> getSchedules() {
        return service.getAllSchedules();
    }

    // 🔥 AIRPORTS
    @GetMapping("/airports")
    public List<Airport> getAirports() {
        return service.getAllAirports();
    }

    // 🔥 ROUTES
    @GetMapping("/routes")
    public List<Route> getRoutes() {
        return service.getAllRoutes();
    }
}