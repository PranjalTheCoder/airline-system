package com.airline.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.airline.payment_service.dto.InventoryRequestDTO;

@FeignClient(
        name = "inventory-service",
        url = "${services.inventory}"
)
public interface InventoryClient {
	
	 @PostMapping("/api/inventory/confirm")
	    void confirmSeats(@RequestBody InventoryRequestDTO request);

	    @PostMapping("/api/inventory/release")
	    void releaseSeats(@RequestBody InventoryRequestDTO request);
	
}
