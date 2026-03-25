package com.airline_service.flight_service.service;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.entity.RouteEntity;
import com.airline_service.flight_service.repository.RouteRepository;

@Service
public class RouteService {

    private final RouteRepository routeRepository;

    public RouteService(RouteRepository routeRepository) {
        this.routeRepository = routeRepository;
    }

    public RouteEntity getRoute(String origin, String destination) {
        return routeRepository.findByOriginCodeAndDestinationCode(origin, destination);
    }

    public RouteEntity getRouteById(Long id) {
        return routeRepository.findById(id).orElse(null);
    }
}