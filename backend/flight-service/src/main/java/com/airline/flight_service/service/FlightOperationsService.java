package com.airline.flight_service.service;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class FlightOperationsService {

    private final FlightInstanceRepository repository;

    public FlightOperationsService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    public FlightInstance delayFlight(Long instanceId, int minutes) {

        FlightInstance instance = repository.findById(instanceId).orElseThrow();

        instance.setStatus("DELAYED");

        return repository.save(instance);
    }

    public FlightInstance cancelFlight(Long instanceId) {

        FlightInstance instance = repository.findById(instanceId).orElseThrow();

        instance.setStatus("CANCELLED");

        return repository.save(instance);
    }
}