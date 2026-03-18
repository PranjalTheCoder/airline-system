package com.airline.flight_service.repository;


import com.airline.flight_service.entity.Gate;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GateRepository extends JpaRepository<Gate, Long> {
	
	List<Gate> findByAirportId(Long airportId);
}
