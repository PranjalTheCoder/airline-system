package com.airline.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.service.FlightTrackingService;

@RestController
@RequestMapping("/api/flights")
public class FlightTrackingController {

    private final FlightTrackingService service;

    public FlightTrackingController(FlightTrackingService service) {
        this.service = service;
    }

    // 🔥 TRACKING
    @GetMapping("/{id}/tracking")
    public FlightInstance getTracking(@PathVariable Long id) {
        return service.getTracking(id);
    }

    // 🔥 POSITION
    @GetMapping("/{id}/position")
    public String getPosition(@PathVariable Long id) {
        return service.getPosition(id);
    }

    // 🔥 DEPARTURES
    @GetMapping("/departures")
    public List<FlightInstance> getDepartures(@RequestParam String airport) {
        return service.getDepartures(airport);
    }

    // 🔥 ARRIVALS
    @GetMapping("/arrivals")
    public List<FlightInstance> getArrivals(@RequestParam String airport) {
        return service.getArrivals(airport);
    }
}