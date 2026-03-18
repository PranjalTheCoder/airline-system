package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.FlightSchedule;
import com.airline.flight_service.service.FlightScheduleService;

@RestController
@RequestMapping("/api/schedules")
public class FlightScheduleController {

    private final FlightScheduleService service;

    public FlightScheduleController(FlightScheduleService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public FlightSchedule create(@RequestBody FlightSchedule schedule) {
        return service.create(schedule);
    }

    // GET ALL
    @GetMapping
    public List<FlightSchedule> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public FlightSchedule getById(@PathVariable Long id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public FlightSchedule update(@PathVariable Long id,
                                @RequestBody FlightSchedule schedule) {
        return service.update(id, schedule);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    // 🔥 GET BY FLIGHT
    @GetMapping("/flight/{flightId}")
    public List<FlightSchedule> getByFlight(@PathVariable Long flightId) {
        return service.getByFlight(flightId);
    }

    // 🔥 ACTIVATE
    @PostMapping("/{id}/activate")
    public FlightSchedule activate(@PathVariable Long id) {
        return service.activate(id);
    }

    // 🔥 DEACTIVATE
    @PostMapping("/{id}/deactivate")
    public FlightSchedule deactivate(@PathVariable Long id) {
        return service.deactivate(id);
    }
}