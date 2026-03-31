package com.airline.reservation_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation_service.entity.PricingEntity;

public interface PricingRepository
extends JpaRepository<PricingEntity, Long> {

PricingEntity findByReservationId(String reservationId);
}
