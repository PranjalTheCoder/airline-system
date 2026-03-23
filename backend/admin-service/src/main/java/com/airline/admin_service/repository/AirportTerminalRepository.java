package com.airline.admin_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.admin_service.entity.Terminal;

public interface AirportTerminalRepository extends JpaRepository<Terminal, Long> {
    List<Terminal> findByAirportCode(String airportCode);
}