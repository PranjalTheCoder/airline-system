package com.airline.inventory_service.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.inventory_service.dto.request.CreateInventoryRequest;
import com.airline.inventory_service.entity.SeatInventory;
import com.airline.inventory_service.exception.ResourceNotFoundException;
import com.airline.inventory_service.repository.FareClassRepository;
import com.airline.inventory_service.repository.SeatInventoryRepository;

@Service
public class InventoryService {

    private final SeatInventoryRepository inventoryRepository;
    private final FareClassRepository fareClassRepository;

    public InventoryService(SeatInventoryRepository inventoryRepository,
                            FareClassRepository fareClassRepository) {
        this.inventoryRepository = inventoryRepository;
        this.fareClassRepository = fareClassRepository;
    }

    // ✅ CREATE INVENTORY
    public SeatInventory createInventory(CreateInventoryRequest request) {

        SeatInventory inventory = new SeatInventory();

        inventory.setFlightInstanceId(request.getFlightInstanceId());

        inventory.setFareClass(
                fareClassRepository.findById(request.getFareClassId())
                        .orElseThrow()
        );

        inventory.setTotalSeats(request.getTotalSeats());
        inventory.setReservedSeats(0);
        inventory.setAvailableSeats(request.getTotalSeats());

        return inventoryRepository.save(inventory);
    }

    // ✅ GET INVENTORY
    public List<SeatInventory> getInventory(Long flightInstanceId) {
        return inventoryRepository.findByFlightInstanceId(flightInstanceId);
    }
}