package com.airline.flight_service.controller;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.dto.FlightOperationRequest;
import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.service.FlightOperationsService;

@RestController
@RequestMapping("/api/flights")
public class FlightOperationsController {

    private final FlightOperationsService service;

    public FlightOperationsController(FlightOperationsService service) {
        this.service = service;
    }

    // 🔥 DELAY
    @PostMapping("/{id}/delay")
    public FlightInstance delay(@PathVariable Long id,
                               @RequestBody FlightOperationRequest request) {
        return service.delay(id, request.getDelayMinutes(), request.getReason());
    }

    // 🔥 CANCEL
    @PostMapping("/{id}/cancel")
    public FlightInstance cancel(@PathVariable Long id,
                                @RequestBody FlightOperationRequest request) {
        return service.cancel(id, request.getReason());
    }

    // 🔥 DIVERT
    @PostMapping("/{id}/divert")
    public FlightInstance divert(@PathVariable Long id,
                                @RequestBody FlightOperationRequest request) {
        return service.divert(id,
                request.getDivertedAirportId(),
                request.getReason());
    }
}