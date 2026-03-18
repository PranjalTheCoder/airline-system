package com.airline.flight_service.service;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.FlightStatusEnum;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class FlightOperationsService {

    private final FlightInstanceRepository repository;

    public FlightOperationsService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    // 🔥 DELAY
    public FlightInstance delay(Long id, Integer minutes, String reason) {

        FlightInstance instance = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        instance.setStatus(FlightStatusEnum.DELAYED);

        // optional: store delayMinutes & reason in future table

        return repository.save(instance);
    }

    // 🔥 CANCEL
    public FlightInstance cancel(Long id, String reason) {

        FlightInstance instance = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        instance.setStatus(FlightStatusEnum.CANCELLED);

        return repository.save(instance);
    }

    // 🔥 DIVERT
    public FlightInstance divert(Long id, Long airportId, String reason) {

        FlightInstance instance = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        // For now: just mark delayed/diverted
        instance.setStatus(FlightStatusEnum.DELAYED);

        // Advanced: update route dynamically (future)

        return repository.save(instance);
    }
}