package com.airline.inventory_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.inventory_service.dto.SeatMapResponseDTO;
import com.airline.inventory_service.service.SeatMapService;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final SeatMapService seatMapService;

    public InventoryController(SeatMapService seatMapService) {
        this.seatMapService = seatMapService;
    }

    // 🔥 MAIN API (IMPORTANT)
    @GetMapping("/seatmap")
    public SeatMapResponseDTO getSeatMap(
            @RequestParam String flightId,
            @RequestParam String cabinClass) {

        return seatMapService.getSeatMap(flightId, cabinClass);
    }
}