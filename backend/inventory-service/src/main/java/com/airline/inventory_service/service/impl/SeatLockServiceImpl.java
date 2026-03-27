package com.airline.inventory_service.service.impl;

import java.sql.Timestamp;
import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.entity.SeatLock;
import com.airline.inventory_service.repository.SeatLockRepository;
import com.airline.inventory_service.repository.SeatRepository;

@Service
public class SeatLockServiceImpl {

    private final SeatRepository seatRepository;
    private final SeatLockRepository seatLockRepository;

    public SeatLockServiceImpl(SeatRepository seatRepository,
                               SeatLockRepository seatLockRepository) {
        this.seatRepository = seatRepository;
        this.seatLockRepository = seatLockRepository;
    }

    @Transactional
    public String holdSeat(String seatId, String userId) {

        Seat seat = seatRepository.findById(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        if (!"AVAILABLE".equals(seat.getSeatStatus())) {
            throw new RuntimeException("Seat not available");
        }

        // Update seat
        seat.setSeatStatus("HELD");
        seatRepository.save(seat);

        // Create lock
        SeatLock lock = new SeatLock();
        lock.setSeat(seat);
        lock.setLockedBy(userId);
        lock.setFlightId(seat.getSeatMap().getFlightId());
        lock.setStatus("ACTIVE");
        lock.setLockExpiry(Timestamp.valueOf(LocalDateTime.now().plusMinutes(10)));

        seatLockRepository.save(lock);

        return "Seat locked successfully";
    }
}