package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.repository.FlightRepository;
@Service
public class FlightService {

    private final FlightRepository repository;

    public FlightService(FlightRepository repository) {
        this.repository = repository;
    }

    public Flight create(Flight flight) {
        return repository.save(flight);
    }

    public List<Flight> getAll() {
        return repository.findAll();
    }
}