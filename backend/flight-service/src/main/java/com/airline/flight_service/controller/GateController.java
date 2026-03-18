package com.airline.flight_service.controller;


import com.airline.flight_service.entity.Gate;
import com.airline.flight_service.service.GateService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/gates")
public class GateController {

    private final GateService service;

    public GateController(GateService service) {
        this.service = service;
    }

    @PostMapping
    public Gate create(@RequestBody Gate gate) {
        return service.create(gate);
    }

    @GetMapping
    public List<Gate> getAll() {
        return service.getAll();
    }
}