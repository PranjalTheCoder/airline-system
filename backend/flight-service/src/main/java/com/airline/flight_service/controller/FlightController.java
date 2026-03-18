package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.service.FlightService;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightService service;

    public FlightController(FlightService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Flight create(@RequestBody Flight flight) {
        return service.create(flight);
    }

    // GET ALL
    @GetMapping
    public List<Flight> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Flight getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Flight update(@PathVariable Long id, @RequestBody Flight flight) {
        return service.update(id, flight);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // 🔥 ADDITIONAL APIs

    @GetMapping("/number/{flightNumber}")
    public Flight getByNumber(@PathVariable String flightNumber) {
        return service.getByNumber(flightNumber);
    }

    @GetMapping("/airline/{airlineId}")
    public List<Flight> getByAirline(@PathVariable Long airlineId) {
        return service.getByAirline(airlineId);
    }

    @GetMapping("/route/{routeId}") // ✅ FIXED
    public List<Flight> getByRoute(@PathVariable Long routeId) {
        return service.getByRoute(routeId);
    }
}