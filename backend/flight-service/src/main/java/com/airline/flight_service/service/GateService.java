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

    public Gate create(Gate gate) {
        return repository.save(gate);
    }

    public List<Gate> getAll() {
        return repository.findAll();
    }
}
