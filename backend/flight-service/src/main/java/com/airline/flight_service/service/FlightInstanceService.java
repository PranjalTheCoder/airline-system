package com.airline.flight_service.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class FlightInstanceService {

    private final FlightInstanceRepository repository;

    public FlightInstanceService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public FlightInstance create(FlightInstance instance) {
        return repository.save(instance);
    }

    // GET ALL
    public List<FlightInstance> getAll() {
        return repository.findAll();
    }

    // GET BY ID
    public FlightInstance getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Instance not found"));
    }

    // UPDATE
    public FlightInstance update(Long id, FlightInstance updated) {
        FlightInstance i = getById(id);

        i.setSchedule(updated.getSchedule());
        i.setDepartureDate(updated.getDepartureDate());
        i.setStatus(updated.getStatus());

        return repository.save(i);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // 🔥 GET BY DATE
    public List<FlightInstance> getByDate(LocalDate date) {
        return repository.findByDepartureDate(date);
    }

    // 🔥 GET BY FLIGHT
    public List<FlightInstance> getByFlight(Long flightId) {
        return repository.findByScheduleFlightId(flightId);
    }

    // 🔥 GET BY SCHEDULE
    public List<FlightInstance> getBySchedule(Long scheduleId) {
        return repository.findByScheduleId(scheduleId);
    }
}