package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.entity.Route;
import com.airline.flight_service.service.RouteService;

@RestController
@RequestMapping("/api/routes")
public class RouteController {

    private final RouteService service;

    public RouteController(RouteService service) {
        this.service = service;
    }

    @PostMapping
    public Route create(@RequestBody Route route) {
        return service.create(route);
    }

    @GetMapping
    public List<Route> getAll() {
        return service.getAll();
    }
}