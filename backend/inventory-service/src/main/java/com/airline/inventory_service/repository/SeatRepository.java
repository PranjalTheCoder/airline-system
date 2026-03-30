package com.airline.inventory_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.Seat;

public interface SeatRepository extends JpaRepository<Seat, String> {

    List<Seat> findBySeatMap_Id(Long seatMapId);

    Optional<Seat> findBySeatNumberAndSeatMapId(String seatNumber, Long seatMapId);

    List<Seat> findBySeatStatus(String seatStatus);

    List<Seat> findBySeatMapIdAndSeatStatus(Long seatMapId, String seatStatus);
    
    Optional<Seat> findBySeatNumber(String seatNumber);

    List<Seat> findBySeatMap_FlightId(String flightId);

}