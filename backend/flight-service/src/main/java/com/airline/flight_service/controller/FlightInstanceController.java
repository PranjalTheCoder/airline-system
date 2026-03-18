package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.repository.FlightInstanceRepository;

@RestController
@RequestMapping("/api/instances")
public class FlightInstanceController {

    private final FlightInstanceRepository repository;

    public FlightInstanceController(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public FlightInstance create(@RequestBody FlightInstance instance) {
        return repository.save(instance);
    }

    @GetMapping
    public List<FlightInstance> getAll() {
        return repository.findAll();
    }
}