package com.airline_service.flight_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline_service.flight_service.entity.AirlineEntity;

public interface AirlineRepository extends JpaRepository<AirlineEntity, Long> {
}