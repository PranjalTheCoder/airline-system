package com.airline.inventory_service.client;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.airline.inventory_service.dto.external.AircraftDTO;
import com.airline.inventory_service.exception.ExternalServiceException;

@Service
public class AdminClient {

    private final WebClient webClient;

    public AdminClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public List<AircraftDTO> getAircrafts() {

        try {
            return webClient.get()
                    .uri("http://localhost:8080/api/admin/aircraft")
                    .retrieve()
                    .bodyToFlux(AircraftDTO.class)
                    .collectList()
                    .block();

        } catch (Exception e) {
            throw new ExternalServiceException("Failed to fetch aircraft data from Admin Service");
        }
    }
}