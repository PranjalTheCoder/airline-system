package com.airline.reservation_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation_service.entity.Pnr;

public interface PnrRepository extends JpaRepository<Pnr, Long> {
    Optional<Pnr> findByPnrCode(String pnrCode);
    
    List<Pnr> findByBookingStatus(String status);
}