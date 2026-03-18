package com.airline.flight_service.controller;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.dto.GateAssignmentRequest;
import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.Gate;
import com.airline.flight_service.service.GateAssignmentService;

@RestController
@RequestMapping("/api/instances")
public class GateAssignmentController {

    private final GateAssignmentService service;

    public GateAssignmentController(GateAssignmentService service) {
        this.service = service;
    }

    // 🔥 ASSIGN GATE
    @PostMapping("/{id}/assign-gate")
    public FlightInstance assignGate(@PathVariable Long id,
                                    @RequestBody GateAssignmentRequest request) {

        return service.assignGate(id,
                request.getGateId(),
                request.getTerminal());
    }

    // 🔥 GET GATE
    @GetMapping("/{id}/gate")
    public Gate getGate(@PathVariable Long id) {
        return service.getGate(id);
    }
}