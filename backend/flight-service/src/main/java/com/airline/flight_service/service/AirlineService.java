package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Airline;
import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.repository.AirlineRepository;
import com.airline.flight_service.repository.FlightRepository;

@Service
public class AirlineService {

    private final AirlineRepository airlineRepo;
    private final FlightRepository flightRepo;

    public AirlineService(AirlineRepository airlineRepo,
                          FlightRepository flightRepo) {
        this.airlineRepo = airlineRepo;
        this.flightRepo = flightRepo;
    }

    // CREATE
    public Airline createAirline(Airline airline) {
        return airlineRepo.save(airline);
    }

    // GET ALL
    public List<Airline> getAllAirlines() {
        return airlineRepo.findAll();
    }

    // GET BY ID
    public Airline getById(Long id) {
        return airlineRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Airline not found"));
    }

    // UPDATE (FIXED)
    public Airline update(Long id, Airline updated) {
        Airline a = getById(id);

        a.setName(updated.getName());
        a.setIataCode(updated.getIataCode());
        a.setAirlineType(updated.getAirlineType());
        a.setCountry(updated.getCountry());

        return airlineRepo.save(a);
    }

    // DELETE
    public void delete(Long id) {
        airlineRepo.deleteById(id);
    }

    // 🔥 NEW: GET FLIGHTS BY AIRLINE
    public List<Flight> getFlightsByAirline(Long airlineId) {
        return flightRepo.findByAirlineId(airlineId);
    }
}