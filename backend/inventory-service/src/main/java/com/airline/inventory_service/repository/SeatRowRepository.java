package com.airline.inventory_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.SeatRow;

public interface SeatRowRepository extends JpaRepository<SeatRow, Long> {

    List<SeatRow> findBySeatMapId(Long seatMapId);

}