package com.airline.inventory_service.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.SeatAssignment;

public interface SeatAssignmentRepository extends JpaRepository<SeatAssignment, Long> {

    List<SeatAssignment> findByFlightInstanceId(Long flightInstanceId);

    Optional<SeatAssignment> findBySeat_IdAndFlightInstanceId(Long seatId, Long flightInstanceId);

    List<SeatAssignment> findByStatus(String status);

    List<SeatAssignment> findByHoldExpiryBefore(LocalDateTime time);
    
    List<SeatAssignment> findByFlightInstanceIdAndStatus(
            Long flightInstanceId,
            String status
    );
}