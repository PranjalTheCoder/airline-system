package com.airline.flight_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.repository.FlightRepository;

@Service
public class FlightService {

    private final FlightRepository repository;

    public FlightService(FlightRepository repository) {
        this.repository = repository;
    }

    public Flight createFlight(Flight flight) {
        return repository.save(flight);
    }

    public List<Flight> getAllFlights() {
        return repository.findAll();
    }

    public Optional<Flight> getFlight(Long id) {
        return repository.findById(id);
    }

    public void deleteFlight(Long id) {
        repository.deleteById(id);
    }
}