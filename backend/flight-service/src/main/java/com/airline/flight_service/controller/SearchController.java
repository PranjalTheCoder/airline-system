package com.airline.flight_service.controller;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.flight_service.dto.FlightSearchRequest;
import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.service.SearchService;

@RestController
@RequestMapping("/api/flights")
public class SearchController {

    private final SearchService service;

    public SearchController(SearchService service) {
        this.service = service;
    }

    @GetMapping("/search")
    public List<FlightInstance> search(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam String date
    ) {
        return service.search(origin, destination, java.time.LocalDate.parse(date));
    }
    
    @PostMapping("/search/advanced")
    public List<FlightInstance> advancedSearch(@RequestBody FlightSearchRequest request) {

        return service.search(
                request.getOrigin(),
                request.getDestination(),
                java.time.LocalDate.parse(request.getDate())
        );
    }
}