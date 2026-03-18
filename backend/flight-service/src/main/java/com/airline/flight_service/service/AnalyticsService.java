package com.airline.flight_service.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.FlightStatusEnum;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class AnalyticsService {

    private final FlightInstanceRepository repository;

    public AnalyticsService(FlightInstanceRepository repository) {
        this.repository = repository;
    }

    // 🔥 LOAD FACTOR (SIMULATED)
    public Map<String, Object> getLoadFactor() {

        List<FlightInstance> instances = repository.findAll();

        int totalFlights = instances.size();

        // simulate seats
        int totalSeats = totalFlights * 180;
        int bookedSeats = totalFlights * 120;

        double loadFactor = totalSeats == 0 ? 0 :
                (double) bookedSeats / totalSeats * 100;

        Map<String, Object> result = new HashMap<>();
        result.put("totalFlights", totalFlights);
        result.put("loadFactor", loadFactor);

        return result;
    }

    // 🔥 DELAY ANALYTICS
    public Map<String, Object> getDelays() {

        List<FlightInstance> instances = repository.findAll();

        long delayed = instances.stream()
                .filter(i -> i.getStatus() == FlightStatusEnum.DELAYED)
                .count();

        Map<String, Object> result = new HashMap<>();
        result.put("delayedFlights", delayed);
        result.put("totalFlights", instances.size());

        return result;
    }

    // 🔥 PERFORMANCE ANALYTICS
    public Map<String, Object> getPerformance() {

        List<FlightInstance> instances = repository.findAll();

        long onTime = instances.stream()
                .filter(i -> i.getStatus() == FlightStatusEnum.SCHEDULED
                          || i.getStatus() == FlightStatusEnum.DEPARTED
                          || i.getStatus() == FlightStatusEnum.LANDED)
                .count();

        long delayed = instances.stream()
                .filter(i -> i.getStatus() == FlightStatusEnum.DELAYED)
                .count();

        long cancelled = instances.stream()
                .filter(i -> i.getStatus() == FlightStatusEnum.CANCELLED)
                .count();

        Map<String, Object> result = new HashMap<>();
        result.put("onTimeFlights", onTime);
        result.put("delayedFlights", delayed);
        result.put("cancelledFlights", cancelled);

        return result;
    }
}