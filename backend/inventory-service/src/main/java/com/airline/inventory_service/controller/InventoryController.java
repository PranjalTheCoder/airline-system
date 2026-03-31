package com.airline.inventory_service.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.inventory_service.client.AdminClient;
import com.airline.inventory_service.dto.AircraftDTO;
import com.airline.inventory_service.dto.SeatDTO;
import com.airline.inventory_service.dto.SeatMapResponseDTO;
import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.mapper.SeatMapMapper;
import com.airline.inventory_service.repository.SeatRepository;
import com.airline.inventory_service.service.SeatLockService;
import com.airline.inventory_service.service.SeatMapAggregationService;


@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final SeatMapAggregationService service;
    private final SeatRepository seatRepo;
    private final SeatLockService seatLockService;
    private final SeatMapMapper mapper;
    private final AdminClient adminClient;

    // --- Manual Constructor (replaces @RequiredArgsConstructor) ---
    public InventoryController(SeatMapAggregationService service, 
    		SeatRepository seatRepo,
            SeatLockService seatLockService,
            SeatMapMapper mapper,
            AdminClient adminClient) {
        this.service = service;
        this.seatRepo = seatRepo;
        this.seatLockService = seatLockService;
        this.mapper = mapper;
        this.adminClient = adminClient;
    }

    @GetMapping("/seats/{seatId}")
    public SeatDTO getSeat(@PathVariable String seatId) {

        Seat seat = seatRepo.findBySeatNumber(seatId)
                .orElseThrow(() -> new RuntimeException("Seat not found"));

        return mapper.toSeatDTO(seat);
    }
    @GetMapping("/seatmap")
    public SeatMapResponseDTO getSeatMap(
            @RequestParam String flightId,
            @RequestParam String cabinClass) {

        return service.getSeatMap(flightId, cabinClass);
    }
    
 // 🪑 1. SEAT DETAILS API
    public SeatDTO toSeatDTO(Seat seat) {

        SeatDTO dto = new SeatDTO();

        dto.setId(seat.getSeatNumber());
        dto.setSeatNumber(seat.getSeatNumber());

        dto.setRow(seat.getRowNum());
        dto.setColumn(seat.getColumnLetter());

        dto.setStatus(
            seat.getSeatStatus() != null ? seat.getSeatStatus() : "AVAILABLE"
        );

        dto.setType(
            seat.getSeatType() != null ? seat.getSeatType() : "STANDARD"
        );

        dto.setPrice(
            seat.getPrice() != null ? seat.getPrice() : 45.0
        );

        dto.setCurrency("USD");

        List<String> features = new ArrayList<>();

        if ("WINDOW".equals(seat.getSeatType())) {
            features.add("WINDOW");
        }

        dto.setFeatures(features);

        return dto;
    }

    // 🔒 LOCK SEAT
    @PostMapping("/seats/{seatId}/lock")
    public Map<String, Object> lockSeat(
            @PathVariable String seatId,
            @RequestParam String flightId) {

        seatLockService.lockSeat(flightId, seatId);

        return Map.of(
                "success", true,
                "message", "Seat locked successfully"
        );
    }

    // 🔓 RELEASE SEAT
    @DeleteMapping("/seats/{seatId}/lock")
    public Map<String, Object> releaseSeat(@PathVariable String seatId) {

        seatLockService.releaseSeat(seatId);

        return Map.of(
                "success", true,
                "message", "Seat released successfully"
        );
    }

    // 📊 4. SEAT AVAILABILITY
    @GetMapping("/availability")
    public Map<String, Object> getAvailability(@RequestParam String flightId) {

        List<Seat> seats = seatRepo.findBySeatMap_FlightId(flightId);

        long total = seats.size();

        long available = seats.stream()
                .filter(s -> "AVAILABLE".equals(s.getSeatStatus()))
                .count();

        long held = seats.stream()
                .filter(s -> "HELD".equals(s.getSeatStatus()))
                .count();

        long occupied = seats.stream()
                .filter(s -> "BOOKED".equals(s.getSeatStatus()))
                .count();

        return Map.of(
                "flightId", flightId,
                "totalSeats", total,
                "availableSeats", available,
                "heldSeats", held,
                "occupiedSeats", occupied
        );
    }

    // 🧭 5. CABIN LAYOUT API
    @GetMapping("/cabin-layout")
    public AircraftDTO getLayout(@RequestParam String aircraft) {

        return adminClient.getAircraft(aircraft);
    }
}