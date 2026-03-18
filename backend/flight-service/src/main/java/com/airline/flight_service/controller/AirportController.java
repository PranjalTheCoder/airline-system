package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.Airport;
import com.airline.flight_service.service.AirportService;

@RestController
@RequestMapping("/api/airports") // 🔥 MUST MATCH POSTMAN
public class AirportController {

    private final AirportService service;

    public AirportController(AirportService service) {
        this.service = service;
    }

    @PostMapping
    public Airport create(@RequestBody Airport airport) {
        return service.createAirport(airport);
    }

    @GetMapping
    public List<Airport> getAll() {
        return service.getAllAirports();
    }
    
}