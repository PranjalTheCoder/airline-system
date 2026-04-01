package com.airline.inventory_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.inventory_service.dto.InventoryResponseDTO;
import com.airline.inventory_service.dto.LockRequestDTO;
import com.airline.inventory_service.dto.SeatInfoDTO;
import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.repository.SeatRepository;

@Service
public class InventoryService {
	 private final SeatRepository seatRepo;
	 
	 public InventoryService(SeatRepository seatRepo) {
		 this.seatRepo = seatRepo;
	 }

	    // ✅ 1. GET SEAT MAP
	    public InventoryResponseDTO getSeats(String flightId) {

	        List<Seat> seats = seatRepo.findBySeatMap_FlightId(flightId);

	        List<SeatInfoDTO> seatDTOs = seats.stream().map(seat -> {
	            SeatInfoDTO dto = new SeatInfoDTO();
	            dto.setSeatNumber(seat.getSeatNumber());
	            dto.setCabinClass("ECONOMY"); // or from entity
	            dto.setStatus(seat.getSeatStatus());
	            dto.setPrice(seat.getPrice());
	            return dto;
	        }).toList();

	        return new InventoryResponseDTO(flightId, seatDTOs);
	    }

	    // 🔒 2. LOCK SEATS
	    public void lockSeats(LockRequestDTO request) {

	        List<Seat> seats = seatRepo
	                .findBySeatMap_FlightIdAndSeatNumberIn(
	                        request.getFlightId(),
	                        request.getSeatNumbers()
	                );

	        if (seats.size() != request.getSeatNumbers().size()) {
	            throw new RuntimeException("Some seats not found");
	        }

	        for (Seat seat : seats) {

	            if (!"AVAILABLE".equals(seat.getSeatStatus())) {
	                throw new RuntimeException("Seat " + seat.getSeatNumber() + " not available");
	            }

	            seat.setSeatStatus("HELD");
	        }

	        seatRepo.saveAll(seats);
	    }

	    // ✅ 3. CONFIRM BOOKING
	    public void confirmSeats(LockRequestDTO request) {

	        List<Seat> seats = seatRepo
	                .findBySeatMap_FlightIdAndSeatNumberIn(
	                        request.getFlightId(),
	                        request.getSeatNumbers()
	                );

	        for (Seat seat : seats) {

	            if (!"HELD".equals(seat.getSeatStatus())) {
	                throw new RuntimeException("Seat not locked: " + seat.getSeatNumber());
	            }

	            seat.setSeatStatus("BOOKED");
	        }

	        seatRepo.saveAll(seats);
	    }

	    // 🔓 4. RELEASE SEATS
	    public void releaseSeats(LockRequestDTO request) {

	        List<Seat> seats = seatRepo
	                .findBySeatMap_FlightIdAndSeatNumberIn(
	                        request.getFlightId(),
	                        request.getSeatNumbers()
	                );

	        for (Seat seat : seats) {

	            if ("HELD".equals(seat.getSeatStatus())) {
	                seat.setSeatStatus("AVAILABLE");
	            }
	        }

	        seatRepo.saveAll(seats);
	    }
}
