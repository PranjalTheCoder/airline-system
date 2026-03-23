package com.airline.admin_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.admin_service.entity.Airport;

public interface AirportRepository extends JpaRepository<Airport, String> {

}
