package com.airline.inventory_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.SeatStatusHistory;

public interface SeatStatusHistoryRepository extends JpaRepository<SeatStatusHistory, Long> {

    List<SeatStatusHistory> findBySeatId(String seatId);

}