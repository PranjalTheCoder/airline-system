package com.airline_service.flight_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline_service.flight_service.entity.FlightInstanceEntity;

public interface FlightInstanceRepository extends JpaRepository<FlightInstanceEntity, Long> {
    List<FlightInstanceEntity> findByFlightId(Long flightId);
}