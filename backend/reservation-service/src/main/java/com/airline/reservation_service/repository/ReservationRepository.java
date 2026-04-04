package com.airline.reservation_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation_service.entity.ReservationEntity;

public interface ReservationRepository 
extends JpaRepository<ReservationEntity, String> {

Optional<ReservationEntity> findByPnr(String pnr);

List<ReservationEntity> findByUserId(String userId);
}
