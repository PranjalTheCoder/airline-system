package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.Airline;
import com.airline.flight_service.service.AirlineService;

@RestController
@RequestMapping("/api/airlines") // 🔥 IMPORTANT
public class AirlineController {

    private final AirlineService service;

    public AirlineController(AirlineService service) {
        this.service = service;
    }

    @PostMapping
    public Airline create(@RequestBody Airline airline) {
        return service.createAirline(airline);
    }

    @GetMapping
    public List<Airline> getAll() {
        return service.getAllAirlines();
    }
}