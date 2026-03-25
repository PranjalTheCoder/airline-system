package com.airline_service.flight_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline_service.flight_service.entity.CabinClassEntity;

public interface CabinClassRepository extends JpaRepository<CabinClassEntity, Long> {
    List<CabinClassEntity> findByFlightId(Long flightId);
}