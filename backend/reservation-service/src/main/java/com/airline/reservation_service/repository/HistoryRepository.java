package com.airline.reservation_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation_service.entity.PnrHistory;

public interface HistoryRepository extends JpaRepository<PnrHistory, Long> {
}