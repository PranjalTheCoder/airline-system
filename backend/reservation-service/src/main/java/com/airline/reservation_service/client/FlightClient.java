package com.airline.reservation_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.airline.reservation_service.dto.external.FlightDTO;


@Component
public class FlightClient {

    private final WebClient webClient;

    public FlightClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8080")
                .build();
    }

    public FlightDTO getFlight(String flightId) {

        return webClient.get()
                .uri("/api/flights/" + flightId)
                .retrieve()
                .bodyToMono(FlightDTO.class)
                .block();
    }
}