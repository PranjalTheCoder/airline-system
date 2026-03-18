package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.CrewAssignment;
import com.airline.flight_service.service.CrewService;

@RestController
@RequestMapping("/api/flights")
public class CrewController {

    private final CrewService service;

    public CrewController(CrewService service) {
        this.service = service;
    }

    // 🔥 GET CREW
    @GetMapping("/{id}/crew")
    public List<CrewAssignment> getCrew(@PathVariable Long id) {
        return service.getCrew(id);
    }

    // 🔥 ASSIGN CREW
    @PostMapping("/{id}/assign-crew")
    public CrewAssignment assignCrew(@PathVariable Long id,
                                     @RequestBody CrewAssignment request) {

        return service.assignCrew(id,
                request.getCrewId(),
                request.getRole());
    }
}