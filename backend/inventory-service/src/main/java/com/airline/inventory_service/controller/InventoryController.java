package com.airline.inventory_service.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.inventory_service.dto.request.CreateInventoryRequest;
import com.airline.inventory_service.dto.response.ApiResponse;
import com.airline.inventory_service.dto.response.InventoryResponse;
import com.airline.inventory_service.entity.SeatInventory;
import com.airline.inventory_service.service.InventoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    // ✅ CREATE INVENTORY
    @PostMapping
    public ApiResponse<InventoryResponse> createInventory(
            @Valid @RequestBody CreateInventoryRequest request) {

        SeatInventory inventory = inventoryService.createInventory(request);

        InventoryResponse response = mapToResponse(inventory);

        return new ApiResponse<>(true, "Inventory created", response);
    }

    // ✅ GET INVENTORY BY FLIGHT
    @GetMapping("/{flightInstanceId}")
    public ApiResponse<List<InventoryResponse>> getInventory(
            @PathVariable Long flightInstanceId) {

        List<InventoryResponse> response = inventoryService
                .getInventory(flightInstanceId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return new ApiResponse<>(true, "Inventory fetched", response);
    }

    // ✅ AVAILABILITY
    @GetMapping("/{flightInstanceId}/availability")
    public ApiResponse<List<InventoryResponse>> getAvailability(
            @PathVariable Long flightInstanceId) {

        return getInventory(flightInstanceId);
    }

    private InventoryResponse mapToResponse(SeatInventory inventory) {
        InventoryResponse res = new InventoryResponse();
        res.setFlightInstanceId(inventory.getFlightInstanceId());
        res.setFareClassCode(inventory.getFareClass().getCode());
        res.setTotalSeats(inventory.getTotalSeats());
        res.setAvailableSeats(inventory.getAvailableSeats());
        res.setReservedSeats(inventory.getReservedSeats());
        return res;
    }
    
    @GetMapping("/{flightInstanceId}/seatmap")
    public ApiResponse<List<String>> getSeatMap(@PathVariable Long flightInstanceId) {

        // Simplified (can be improved later)
        return new ApiResponse<>(true, "Seat map fetched", List.of("A1", "A2", "B1"));
    }
}