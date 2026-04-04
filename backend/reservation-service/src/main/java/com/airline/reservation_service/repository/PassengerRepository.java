package com.airline.reservation_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation_service.entity.PassengerEntity;

public interface PassengerRepository
extends JpaRepository<PassengerEntity, String> {

List<PassengerEntity> findByReservationId(String reservationId);
}