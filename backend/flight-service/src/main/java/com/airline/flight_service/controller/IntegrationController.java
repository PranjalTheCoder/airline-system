package com.airline.flight_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.dto.*;
import com.airline.flight_service.service.IntegrationService;

@RestController
@RequestMapping("/api/integration")
public class IntegrationController {

    private final IntegrationService service;

    public IntegrationController(IntegrationService service) {
        this.service = service;
    }

    // 🔥 FLIGHT
    @GetMapping("/flights/{id}")
    public FlightIntegrationResponse getFlight(@PathVariable Long id) {
        return service.getFlight(id);
    }

    // 🔥 INSTANCE
    @GetMapping("/instances/{id}")
    public FlightInstanceIntegrationResponse getInstance(@PathVariable Long id) {
        return service.getInstance(id);
    }

    // 🔥 SEARCH
    @GetMapping("/flights/search")
    public List<FlightInstanceIntegrationResponse> search(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String date) {

        return service.search(origin, destination, LocalDate.parse(date));
    }
}