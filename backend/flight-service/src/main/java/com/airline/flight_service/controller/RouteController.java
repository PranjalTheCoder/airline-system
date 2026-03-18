package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.Route;
import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.service.RouteService;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService service;

    public RouteController(RouteService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Route create(@RequestBody Route route) {
        return service.create(route);
    }

    // GET ALL
    @GetMapping
    public List<Route> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Route getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Route update(@PathVariable Long id, @RequestBody Route route) {
        return service.update(id, route);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // SEARCH
    @GetMapping("/search")
    public Route search(@RequestParam String origin,
                        @RequestParam String destination) {
        return service.search(origin, destination);
    }

    // 🔥 GET FLIGHTS
    @GetMapping("/{id}/flights")
    public List<Flight> getFlights(@PathVariable Long id) {
        return service.getFlights(id);
    }
}