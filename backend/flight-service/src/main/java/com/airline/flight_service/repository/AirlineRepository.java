package com.airline.flight_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.Airline;

public interface AirlineRepository extends JpaRepository<Airline, Long> {
}