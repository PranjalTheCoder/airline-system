package com.airline.flight_service.repository;

import com.airline.flight_service.entity.Airline;

import org.springframework.data.jpa.repository.JpaRepository;



public interface AirlineRepository extends JpaRepository<Airline, Long> {
}