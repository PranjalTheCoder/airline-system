package com.airline.inventory_service.client;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.airline.inventory_service.dto.external.FlightDTO;
import com.airline.inventory_service.dto.external.FlightResponse;
import com.airline.inventory_service.exception.ExternalServiceException;

@Service
public class FlightClient {

    private final WebClient webClient;

    public FlightClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<FlightDTO> getFlights() {

        try {
            FlightResponse response = webClient.get()
                    .uri("http://localhost:8080/api/flights")
                    .retrieve()
                    .bodyToMono(FlightResponse.class)
                    .block();

            return response.getFlights();

        } catch (Exception e) {
            throw new ExternalServiceException("Failed to fetch flights");
        }
    }
}