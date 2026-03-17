package com.airline.flight_service.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.service.FlightOperationsService;

@RestController
@RequestMapping("/api/flights")
public class FlightOperationsController {

    private final FlightOperationsService service;

    public FlightOperationsController(FlightOperationsService service) {
        this.service = service;
    }

    @PostMapping("/{id}/delay")
    public FlightInstance delay(@PathVariable Long id,
                                @RequestParam int minutes) {
        return service.delayFlight(id, minutes);
    }

    @PostMapping("/{id}/cancel")
    public FlightInstance cancel(@PathVariable Long id) {
        return service.cancelFlight(id);
    }
}