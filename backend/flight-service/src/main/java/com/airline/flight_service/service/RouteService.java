package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.Route;
import com.airline.flight_service.repository.RouteRepository;

@Service
public class RouteService {

    private final RouteRepository repository;

    public RouteService(RouteRepository repository) {
        this.repository = repository;
    }

    public Route create(Route route) {
        return repository.save(route);
    }

    public List<Route> getAll() {
        return repository.findAll();
    }
}