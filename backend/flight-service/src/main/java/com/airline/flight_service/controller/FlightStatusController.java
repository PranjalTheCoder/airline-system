package com.airline.flight_service.controller;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.FlightStatusEnum;
import com.airline.flight_service.service.FlightStatusService;

@RestController
@RequestMapping("/api/flight-status")
public class FlightStatusController {

    private final FlightStatusService service;

    public FlightStatusController(FlightStatusService service) {
        this.service = service;
    }

    // GET STATUS
    @GetMapping("/{instanceId}")
    public FlightStatusEnum getStatus(@PathVariable Long instanceId) {
        return service.getStatus(instanceId);
    }

    // UPDATE STATUS
    @PutMapping("/{instanceId}")
    public FlightInstance updateStatus(@PathVariable Long instanceId,
                                       @RequestParam FlightStatusEnum status) {
        return service.updateStatus(instanceId, status);
    }
}