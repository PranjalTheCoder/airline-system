package com.airline_service.flight_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline_service.flight_service.aggregation.FlightAggregationService;
import com.airline_service.flight_service.client.AdminClient;
import com.airline_service.flight_service.dto.AirportDTO;
import com.airline_service.flight_service.dto.AirportListResponseDTO;
import com.airline_service.flight_service.dto.FlightBasicDTO;
import com.airline_service.flight_service.dto.FlightSearchResponseDTO;
import com.airline_service.flight_service.entity.FlightEntity;
import com.airline_service.flight_service.service.AirportService;
import com.airline_service.flight_service.service.FlightService;
import com.airline_service.flight_service.service.RouteService;

@RestController
@RequestMapping("/api/flights")
public class FlightController {

    private final FlightAggregationService aggregationService;
    private final FlightService flightService;
    private final RouteService routeService;
    private final AirportService airportService;
    private final AdminClient adminClient;

    public FlightController(FlightAggregationService aggregationService,
            FlightService flightService,
            RouteService routeService,
            AirportService airportService, 
            AdminClient adminClient) {
			this.aggregationService = aggregationService;
			this.flightService = flightService;
			this.routeService = routeService;
			this.airportService = airportService;
			this.adminClient = adminClient;
    }

//    // 🔥 SEARCH
//    @GetMapping("/search")
//    public FlightSearchResponseDTO searchFlights(
//            @RequestParam String origin,
//            @RequestParam String destination) {
//
//        return aggregationService.searchFlights(origin, destination);
//    }

    @GetMapping("/search")
    public FlightSearchResponseDTO searchFlights(
            @RequestParam String origin,
            @RequestParam String destination,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) Integer passengers,
            @RequestParam(required = false) String cabinClass) {

        return aggregationService.searchFlights(
                origin, destination, date, passengers, cabinClass);
    }
    
    @GetMapping
    public FlightSearchResponseDTO getAllFlights() {
        return aggregationService.getAllFlights();
    }
    
    @GetMapping("/airports")
    public AirportListResponseDTO getAllAirports() {

        List<AirportDTO> airports = airportService.getAllAirports();

        return new AirportListResponseDTO(airports);
    }
    
  
//    // 🔎 BY ID
//    @GetMapping("/{id}")
//    public FlightSearchResponseDTO getFlightById(@PathVariable Long id) {
//
//        FlightEntity flight = flightService.getFlightById(id);
//
//        if (flight == null) {
//            return new FlightSearchResponseDTO(List.of());
//        }
//
//        RouteEntity route = routeService.getRouteById(flight.getRouteId());
//
//        return aggregationService.buildResponse(List.of(flight), route);
//    }
//
//    // 📅 BY DATE (basic)
//    @GetMapping("/date")
//    public FlightSearchResponseDTO getByDate(@RequestParam String date) {
//
//        List<FlightEntity> flights = flightService.getAllFlights();
//
//        RouteEntity dummyRoute = new RouteEntity();
//        dummyRoute.setOriginCode("JFK");
//        dummyRoute.setDestinationCode("LHR");
//
//        return aggregationService.buildResponse(flights, dummyRoute);
//    }
    @GetMapping("/number/{flightNumber}")
    public FlightBasicDTO getFlightBasic(@PathVariable String flightNumber) {

        FlightEntity flight = flightService.getFlightByFlightNumber(flightNumber);

        if (flight == null) {
            throw new RuntimeException("Flight not fount: "+ flightNumber);
        }

       
        return new FlightBasicDTO(
                flight.getFlightNumber(),
                flight.getAircraftId()
        );
    }
}