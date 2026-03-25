package com.airline_service.flight_service.service;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.entity.FlightAmenityEntity;
import com.airline_service.flight_service.repository.AmenityRepository;

@Service
public class AmenityService {

    private final AmenityRepository repository;

    public AmenityService(AmenityRepository repository) {
        this.repository = repository;
    }

    public List<String> getAmenitiesByFlightId(Long flightId) {
        List<FlightAmenityEntity> list = repository.findByFlightId(flightId);
        return list.stream()
                .map(FlightAmenityEntity::getAmenity)
                .collect(Collectors.toList());
    }
}