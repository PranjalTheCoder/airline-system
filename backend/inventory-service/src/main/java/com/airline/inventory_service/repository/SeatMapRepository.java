package com.airline.inventory_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.SeatMap;

public interface SeatMapRepository extends JpaRepository<SeatMap, Long> {

    Optional<SeatMap> findByFlightIdAndCabinClass(String flightId, String cabinClass);

}