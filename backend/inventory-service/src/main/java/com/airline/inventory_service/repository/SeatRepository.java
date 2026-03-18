package com.airline.inventory_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.Seat;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByAircraftId(Long aircraftId);

    List<Seat> findByCabinClass_Id(Long cabinClassId);

    List<Seat> findByAircraftIdAndCabinClass_Id(Long aircraftId, Long cabinClassId);
}