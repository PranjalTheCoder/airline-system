package com.airline.flight_service.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.service.FlightInstanceService;

@RestController
@RequestMapping("/api/instances")
public class FlightInstanceController {

    private final FlightInstanceService service;

    public FlightInstanceController(FlightInstanceService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public FlightInstance create(@RequestBody FlightInstance instance) {
        return service.create(instance);
    }

    // GET ALL
    @GetMapping
    public List<FlightInstance> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public FlightInstance getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public FlightInstance update(@PathVariable Long id,
                                @RequestBody FlightInstance instance) {
        return service.update(id, instance);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // 🔥 GET BY DATE
    @GetMapping("/date")
    public List<FlightInstance> getByDate(@RequestParam String date) {
        return service.getByDate(LocalDate.parse(date));
    }

    // 🔥 GET BY FLIGHT
    @GetMapping("/flight/{flightId}")
    public List<FlightInstance> getByFlight(@PathVariable Long flightId) {
        return service.getByFlight(flightId);
    }

    // 🔥 GET BY SCHEDULE
    @GetMapping("/schedule/{scheduleId}")
    public List<FlightInstance> getBySchedule(@PathVariable Long scheduleId) {
        return service.getBySchedule(scheduleId);
    }
}