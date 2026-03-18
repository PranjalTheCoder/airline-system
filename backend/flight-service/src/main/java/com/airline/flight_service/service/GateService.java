package com.airline.flight_service.service;

import com.airline.flight_service.entity.Gate;
import com.airline.flight_service.repository.GateRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GateService {

    private final GateRepository repository;

    public GateService(GateRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Gate create(Gate gate) {
        return repository.save(gate);
    }

    // GET ALL
    public List<Gate> getAll() {
        return repository.findAll();
    }

    // GET BY ID
    public Gate getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Gate not found"));
    }

    // UPDATE
    public Gate update(Long id, Gate updated) {
        Gate g = getById(id);

        g.setGateNumber(updated.getGateNumber());
        g.setTerminal(updated.getTerminal());
        g.setAirport(updated.getAirport());

        return repository.save(g);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // OPTIONAL: GET BY AIRPORT
    public List<Gate> getByAirport(Long airportId) {
        return repository.findByAirportId(airportId);
    }
}