package com.airline_service.flight_service.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.entity.FlightInstanceEntity;
import com.airline_service.flight_service.repository.FlightInstanceRepository;

@Service
public class FlightInstanceService {

    private final FlightInstanceRepository repository;

    public FlightInstanceService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    public List<FlightInstanceEntity> getInstances(Long flightId) {
        return repository.findByFlightId(flightId);
    }
}
