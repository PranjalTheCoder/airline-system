package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.repository.FlightRepository;

@Service
public class FlightService {

    private final FlightRepository repository;

    public FlightService(FlightRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Flight create(Flight flight) {
        return repository.save(flight);
    }

    // GET ALL
    public List<Flight> getAll() {
        return repository.findAll();
    }

    // GET BY ID
    public Flight getById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Flight not found"));
    }

    // UPDATE
    public Flight update(Long id, Flight updated) {
        Flight f = getById(id);

        f.setFlightNumber(updated.getFlightNumber());
        f.setAirline(updated.getAirline());
        f.setRoute(updated.getRoute());

        return repository.save(f);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }

    // ADDITIONAL
    public Flight getByNumber(String flightNumber) {
        return repository.findByFlightNumber(flightNumber);
    }

    public List<Flight> getByAirline(Long airlineId) {
        return repository.findByAirlineId(airlineId);
    }

    public List<Flight> getByRoute(Long routeId) {
        return repository.findByRouteId(routeId);
    }
}