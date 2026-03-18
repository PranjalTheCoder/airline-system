package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.FlightSchedule;
import com.airline.flight_service.repository.FlightScheduleRepository;

@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

    private final FlightScheduleRepository repository;

    public ScheduleController(FlightScheduleRepository repository) {
        this.repository = repository;
    }

    @PostMapping
    public FlightSchedule create(@RequestBody FlightSchedule schedule) {
        return repository.save(schedule);
    }

    @GetMapping
    public List<FlightSchedule> getAll() {
        return repository.findAll();
    }
}