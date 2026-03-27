package com.airline.inventory_service.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.SeatLock;

public interface SeatLockRepository extends JpaRepository<SeatLock, Long> {

    Optional<SeatLock> findBySeatIdAndStatus(String seatId, String status);

    List<SeatLock> findByStatus(String status);

    List<SeatLock> findByLockExpiryBeforeAndStatus(LocalDateTime time, String status);

}