package com.airline_service.flight_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline_service.flight_service.entity.FlightAmenityEntity;

public interface AmenityRepository extends JpaRepository<FlightAmenityEntity, Long> {
    List<FlightAmenityEntity> findByFlightId(Long flightId);
}