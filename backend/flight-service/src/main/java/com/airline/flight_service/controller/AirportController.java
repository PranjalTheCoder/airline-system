package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.Airport;
import com.airline.flight_service.entity.Gate;
import com.airline.flight_service.entity.Route;
import com.airline.flight_service.service.AirportService;

@RestController
@RequestMapping("/api/airports")
public class AirportController {

    private final AirportService service;

    public AirportController(AirportService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Airport create(@RequestBody Airport airport) {
        return service.createAirport(airport);
    }

    // GET ALL
    @GetMapping
    public List<Airport> getAll() {
        return service.getAllAirports();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Airport getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Airport update(@PathVariable Long id, @RequestBody Airport airport) {
        return service.update(id, airport);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // SEARCH
    @GetMapping("/search")
    public List<Airport> search(@RequestParam String city) {
        return service.searchByCity(city);
    }

    // 🔥 GET GATES
    @GetMapping("/{id}/gates")
    public List<Gate> getGates(@PathVariable Long id) {
        return service.getGates(id);
    }

    // 🔥 GET ROUTES
    @GetMapping("/{id}/routes")
    public List<Route> getRoutes(@PathVariable Long id) {
        return service.getRoutes(id);
    }
}