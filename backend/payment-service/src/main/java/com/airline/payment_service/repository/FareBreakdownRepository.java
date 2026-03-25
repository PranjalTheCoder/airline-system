package com.airline.payment_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.payment_service.entity.FareBreakdown;

public interface FareBreakdownRepository extends JpaRepository<FareBreakdown, Long> {

    Optional<FareBreakdown> findByPnrCode(String pnrCode);
}