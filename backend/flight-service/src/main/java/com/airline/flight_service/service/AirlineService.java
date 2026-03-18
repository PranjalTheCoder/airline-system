package com.airline.flight_service.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Airline;
import com.airline.flight_service.repository.AirlineRepository;

@Service
public class AirlineService {

    private final AirlineRepository repository;

    public AirlineService(AirlineRepository repository) {
        this.repository = repository;
    }

    public Airline createAirline(Airline airline) {
        return repository.save(airline);
    }

    public List<Airline> getAllAirlines() {
        return repository.findAll();
    }

	
}