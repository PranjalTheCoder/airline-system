package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightSchedule;
import com.airline.flight_service.repository.FlightScheduleRepository;

@Service
public class FlightScheduleService {

    private final FlightScheduleRepository repository;

    public FlightScheduleService(FlightScheduleRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public FlightSchedule create(FlightSchedule schedule) {
        return repository.save(schedule);
    }

    // GET ALL
    public List<FlightSchedule> getAll() {
        return repository.findAll();
    }

    // GET BY ID
    public FlightSchedule getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Schedule not found"));
    }

    // UPDATE
    public FlightSchedule update(Long id, FlightSchedule updated) {
        FlightSchedule s = getById(id);

        s.setFlight(updated.getFlight());
        s.setDepartureTime(updated.getDepartureTime());
        s.setArrivalTime(updated.getArrivalTime());

        return repository.save(s);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // 🔥 GET BY FLIGHT
    public List<FlightSchedule> getByFlight(Long flightId) {
        return repository.findByFlightId(flightId);
    }

    // 🔥 ACTIVATE
    public FlightSchedule activate(Long id) {
        FlightSchedule s = getById(id);
        s.setActive(true);
        return repository.save(s);
    }

    // 🔥 DEACTIVATE
    public FlightSchedule deactivate(Long id) {
        FlightSchedule s = getById(id);
        s.setActive(false);
        return repository.save(s);
    }
}