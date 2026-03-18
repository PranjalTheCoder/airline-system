package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Route;
import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.repository.RouteRepository;
import com.airline.flight_service.repository.FlightRepository;

@Service
public class RouteService {

    private final RouteRepository routeRepo;
    private final FlightRepository flightRepo;

    public RouteService(RouteRepository routeRepo,
                        FlightRepository flightRepo) {
        this.routeRepo = routeRepo;
        this.flightRepo = flightRepo;
    }

    // CREATE
    public Route create(Route route) {
        return routeRepo.save(route);
    }

    // GET ALL
    public List<Route> getAll() {
        return routeRepo.findAll();
    }

    // GET BY ID
    public Route getById(Long id) {
        return routeRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Route not found"));
    }

    // UPDATE
    public Route update(Long id, Route updated) {
        Route r = getById(id);

        r.setOrigin(updated.getOrigin());
        r.setDestination(updated.getDestination());
        r.setDistance(updated.getDistance());
        r.setDuration(updated.getDuration());

        return routeRepo.save(r);
    }

    // DELETE
    public void delete(Long id) {
        routeRepo.deleteById(id);
    }

    // SEARCH
    public Route search(String origin, String destination) {
        return routeRepo.findByOriginIataCodeAndDestinationIataCode(origin, destination);
    }

    // 🔥 GET FLIGHTS OF ROUTE
    public List<Flight> getFlights(Long routeId) {
        return flightRepo.findByRouteId(routeId);
    }
}