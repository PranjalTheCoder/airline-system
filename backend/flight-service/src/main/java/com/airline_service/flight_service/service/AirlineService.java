package com.airline_service.flight_service.service;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.entity.AirlineEntity;
import com.airline_service.flight_service.repository.AirlineRepository;

@Service
public class AirlineService {

    private final AirlineRepository repository;

    public AirlineService(AirlineRepository repository) {
        this.repository = repository;
    }

    public AirlineEntity getAirline(Long id) {
        return repository.findById(id).orElse(null);
    }
}