package com.airline.flight_service.service;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.FlightStatusEnum;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class FlightStatusService {

    private final FlightInstanceRepository repository;

    public FlightStatusService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    // GET STATUS
    public FlightStatusEnum getStatus(Long instanceId) {
        FlightInstance instance = repository.findById(instanceId)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        return instance.getStatus();
    }

    // UPDATE STATUS
    public FlightInstance updateStatus(Long instanceId, FlightStatusEnum status) {

        FlightInstance instance = repository.findById(instanceId)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        instance.setStatus(status);

        return repository.save(instance);
    }
}