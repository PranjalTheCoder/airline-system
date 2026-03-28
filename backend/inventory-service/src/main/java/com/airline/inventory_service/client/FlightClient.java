package com.airline.inventory_service.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.airline.inventory_service.dto.FlightDTO;

@Service
public class FlightClient {

    private final WebClient flightWebClient;
    public FlightClient(WebClient flightWebClient) {
        this.flightWebClient = flightWebClient;
    }

    public FlightDTO getFlight(String flightNumber) {
        return flightWebClient.get()
                .uri("http://localhost:8080/api/flights/number/{flightNumber}", flightNumber)
                .retrieve()
                .bodyToMono(FlightDTO.class)
                .block();
    }
}