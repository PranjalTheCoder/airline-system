package com.airline.inventory_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.SeatPricing;

public interface SeatPricingRepository extends JpaRepository<SeatPricing, Long> {

    Optional<SeatPricing> findBySeatId(String seatId);

}