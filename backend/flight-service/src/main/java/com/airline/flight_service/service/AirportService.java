package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Airport;
import com.airline.flight_service.repository.AirportRepository;

@Service
public class AirportService {

    private final AirportRepository repository;

    public AirportService(AirportRepository repository) {
        this.repository = repository;
    }

    public Airport createAirport(Airport airport) {
        return repository.save(airport);
    }

    public List<Airport> getAllAirports() {
        return repository.findAll();
    }
}