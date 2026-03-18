package com.airline.flight_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.*;

import com.airline.flight_service.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics/flights")
public class AnalyticsController {

    private final AnalyticsService service;

    public AnalyticsController(AnalyticsService service) {
        this.service = service;
    }

    // 🔥 LOAD FACTOR
    @GetMapping("/load-factor")
    public Map<String, Object> loadFactor() {
        return service.getLoadFactor();
    }

    // 🔥 DELAYS
    @GetMapping("/delays")
    public Map<String, Object> delays() {
        return service.getDelays();
    }

    // 🔥 PERFORMANCE
    @GetMapping("/performance")
    public Map<String, Object> performance() {
        return service.getPerformance();
    }
}