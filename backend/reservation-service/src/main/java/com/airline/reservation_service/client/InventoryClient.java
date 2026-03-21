package com.airline.reservation_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "inventory-service", url = "http://localhost:8082")
public interface InventoryClient {

    @PostMapping("/api/inventory/{id}/hold")
    void holdSeat(@PathVariable Long id);

    @PostMapping("/api/inventory/{id}/release")
    void releaseSeat(@PathVariable Long id);
}