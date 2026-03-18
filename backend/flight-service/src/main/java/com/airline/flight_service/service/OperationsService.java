package com.airline.flight_service.service;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class OperationsService {

    private final FlightInstanceRepository repository;

    public OperationsService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    public FlightInstance cancel(Long id) {
        FlightInstance fi = repository.findById(id).orElseThrow();
        fi.setStatus("CANCELLED");
        return repository.save(fi);
    }
}
