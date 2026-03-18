package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.service.FlightService;
@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService service;

    public FlightController(FlightService service) {
        this.service = service;
    }

    @PostMapping
    public Flight create(@RequestBody Flight flight) {
        return service.create(flight);
    }

    @GetMapping
    public List<Flight> getAll() {
        return service.getAll();
    }
}