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
    public String lockSeat(String flightId, String seatId) {

    	System.out.println("Lock request → flight: " + flightId + " seat: " + seatId);
    	
    	// FIX: Look up by BOTH seatNumber and flightId
        Seat seat = seatRepo.findBySeatNumberAndSeatMap_FlightId(seatId, flightId)
                .orElseThrow(() -> new RuntimeException("Seat not found for this flight"));
        
        System.out.println("Seat found → status: " + seat.getSeatStatus());


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
    // FIX: Add flightId parameter
    public String releaseSeat(String flightId, String seatId) {

    	// FIX: Look up by BOTH seatNumber and flightId
        Seat seat = seatRepo.findBySeatNumberAndSeatMap_FlightId(seatId, flightId)
                .orElseThrow(() -> new RuntimeException("Seat not found for this flight"));
    	
    	// 🔥 OPTIONAL VALIDATION
        if (!"HELD".equals(seat.getSeatStatus())) {
            throw new RuntimeException("Seat is not locked");
        }
        
        seat.setSeatStatus("AVAILABLE");
        seatRepo.save(seat);

        return "Seat released successfully";
    }
}