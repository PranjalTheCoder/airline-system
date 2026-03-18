package com.airline.flight_service.controller;

import com.airline.flight_service.entity.Gate;
import com.airline.flight_service.service.GateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gates")
public class GateController {

    private final GateService service;

    public GateController(GateService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Gate create(@RequestBody Gate gate) {
        return service.create(gate);
    }

    // GET ALL
    @GetMapping
    public List<Gate> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Gate getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Gate update(@PathVariable Long id, @RequestBody Gate gate) {
        return service.update(id, gate);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // OPTIONAL
    @GetMapping("/airport/{airportId}")
    public List<Gate> getByAirport(@PathVariable Long airportId) {
        return service.getByAirport(airportId);
    }
}