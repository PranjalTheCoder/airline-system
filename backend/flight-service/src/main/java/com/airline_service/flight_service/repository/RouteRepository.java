package com.airline_service.flight_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline_service.flight_service.entity.RouteEntity;

public interface RouteRepository extends JpaRepository<RouteEntity, Long> {
    RouteEntity findByOriginCodeAndDestinationCode(String origin, String destination);
}
