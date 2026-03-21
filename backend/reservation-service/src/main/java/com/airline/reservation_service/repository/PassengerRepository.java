package com.airline.reservation_service.repository;

import com.airline.reservation_service.entity.PnrPassenger;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PassengerRepository extends JpaRepository<PnrPassenger, Long> {
    List<PnrPassenger> findByPnrId(Long pnrId);
}