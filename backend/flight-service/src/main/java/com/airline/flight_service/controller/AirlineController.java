package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.Airline;
import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.service.AirlineService;

@RestController
@RequestMapping("/api/airlines")
public class AirlineController {

    private final AirlineService service;

    public AirlineController(AirlineService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Airline create(@RequestBody Airline airline) {
        return service.createAirline(airline);
    }

    // GET ALL
    @GetMapping
    public List<Airline> getAll() {
        return service.getAllAirlines();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Airline getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Airline update(@PathVariable Long id, @RequestBody Airline a) {
        return service.update(id, a);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // 🔥 NEW API
    @GetMapping("/{id}/flights")
    public List<Flight> getFlights(@PathVariable Long id) {
        return service.getFlightsByAirline(id);
    }
}