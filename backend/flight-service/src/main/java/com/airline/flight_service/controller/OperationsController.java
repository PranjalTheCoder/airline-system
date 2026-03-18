package com.airline.flight_service.controller;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.service.OperationsService;

@RestController
@RequestMapping("/api/flights")
public class OperationsController {

    private final OperationsService service;

    public OperationsController(OperationsService service) {
        this.service = service;
    }

    @PostMapping("/{id}/cancel")
    public FlightInstance cancel(@PathVariable Long id) {
        return service.cancel(id);
    }
}
