package com.airline_service.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.entity.CabinClassEntity;
import com.airline_service.flight_service.repository.CabinClassRepository;

@Service
public class CabinClassService {

    private final CabinClassRepository repository;

    public CabinClassService(CabinClassRepository repository) {
        this.repository = repository;
    }

    public List<CabinClassEntity> getCabinClasses(Long flightId) {
        return repository.findByFlightId(flightId);
    }
}