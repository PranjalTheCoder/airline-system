package com.airline.inventory_service.service;

import org.springframework.stereotype.Service;

import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.repository.SeatRepository;

@Service
public class SeatLockService {
	
	private final SeatRepository seatRepo;
	
	public SeatLockService(SeatRepository seatRepo) {
		this.seatRepo = seatRepo;
	}

	 // ✅ HOLD SEAT
    public String holdSeat(String flightId, String seatId, String userId) {

        Seat seat = seatRepo.findBySeatNumber(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        // 🔥 VALIDATION
        if (!"AVAILABLE".equals(seat.getSeatStatus())) {
            throw new RuntimeException("Seat not available");
        }

        // 🔒 LOCK
        seat.setSeatStatus("HELD");
        seatRepo.save(seat);

        return "Seat locked successfully";
    }

    // ❌ RELEASE SEAT
    public String releaseSeat(String seatId) {

        Seat seat = seatRepo.findBySeatNumber(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        seat.setSeatStatus("AVAILABLE");
        seatRepo.save(seat);

        return "Seat released successfully";
    }
}