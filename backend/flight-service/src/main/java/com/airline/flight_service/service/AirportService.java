package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Airport;
import com.airline.flight_service.entity.Gate;
import com.airline.flight_service.entity.Route;
import com.airline.flight_service.repository.AirportRepository;
import com.airline.flight_service.repository.GateRepository;
import com.airline.flight_service.repository.RouteRepository;

@Service
public class AirportService {

    private final AirportRepository airportRepo;
    private final GateRepository gateRepo;
    private final RouteRepository routeRepo;

    public AirportService(AirportRepository airportRepo,
                          GateRepository gateRepo,
                          RouteRepository routeRepo) {
        this.airportRepo = airportRepo;
        this.gateRepo = gateRepo;
        this.routeRepo = routeRepo;
    }

    // CREATE
    public Airport createAirport(Airport airport) {
        return airportRepo.save(airport);
    }

    // GET ALL
    public List<Airport> getAllAirports() {
        return airportRepo.findAll();
    }

    // GET BY ID
    public Airport getById(Long id) {
        return airportRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Airport not found"));
    }

    // UPDATE
    public Airport update(Long id, Airport updated) {
        Airport a = getById(id);

        a.setName(updated.getName());
        a.setCity(updated.getCity());
        a.setCountry(updated.getCountry());
        a.setIataCode(updated.getIataCode());

        return airportRepo.save(a);
    }

    // DELETE
    public void delete(Long id) {
        airportRepo.deleteById(id);
    }

    // SEARCH
    public List<Airport> searchByCity(String city) {
        return airportRepo.findByCityContainingIgnoreCase(city);
    }

    // 🔥 GET GATES
    public List<Gate> getGates(Long airportId) {
        return gateRepo.findByAirportId(airportId);
    }

    // 🔥 GET ROUTES
    public List<Route> getRoutes(Long airportId) {
        return routeRepo.findByOriginIdOrDestinationId(airportId, airportId);
    }
}