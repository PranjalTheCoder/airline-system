package com.airline.inventory_service.client;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.airline.inventory_service.dto.AircraftDTO;

@Service
public class AdminClient {

	
    private final WebClient webClient;

    public AdminClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public AircraftDTO getAircraft(String aircraftId) {
        return webClient.get()
                .uri("http://localhost:8080/api/admin/aircraft/{id}", aircraftId)
                .retrieve()
                .bodyToMono(AircraftDTO.class)
                .block();
    }
}