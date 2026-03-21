package com.airline.reservation_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(name = "flight-service", url = "http://localhost:8081")
public interface FlightClient {
    @GetMapping("/api/flights/{id}")
    Object getFlight(@PathVariable Long id);
}