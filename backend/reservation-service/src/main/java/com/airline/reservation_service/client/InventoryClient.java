package com.airline.reservation_service.client;


import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.airline.reservation_service.dto.external.SeatMapDTO;

@Component
public class InventoryClient {

    private final WebClient webClient;

    public InventoryClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8080")
                .build();
    }

    // 🔹 Get seat map
    public SeatMapDTO getSeatMap(String flightNumber) {

        return webClient.get()
                .uri("/api/inventory/" + flightNumber)
                .retrieve()
                .bodyToMono(SeatMapDTO.class)
                .block();
    }

    // 🔥 OPTIONAL: Lock seats (future use)
    public String lockSeats(String flightId, Object requestBody) {

        return webClient.post()
                .uri("/api/inventory/lock/" + flightId)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
