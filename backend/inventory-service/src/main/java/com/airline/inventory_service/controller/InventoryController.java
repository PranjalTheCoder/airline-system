package com.airline.inventory_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.inventory_service.dto.SeatMapResponseDTO;
import com.airline.inventory_service.service.SeatMapAggregationService;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final SeatMapAggregationService service;

    // --- Manual Constructor (replaces @RequiredArgsConstructor) ---
    public InventoryController(SeatMapAggregationService service) {
        this.service = service;
    }

    @GetMapping("/seatmap")
    public SeatMapResponseDTO getSeatMap(
            @RequestParam String flightId,
            @RequestParam String cabinClass) {

        return service.getSeatMap(flightId, cabinClass);
    }
}