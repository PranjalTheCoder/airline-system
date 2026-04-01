package com.airline.reservation_service.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class AdminClient {

    private final WebClient webClient;

    public AdminClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://localhost:8080")
                .build();
    }

    public String getAircraft(String aircraftId) {

        return webClient.get()
                .uri("/api/admin/aircraft/" + aircraftId)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }
}
