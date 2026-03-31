package com.airline.reservation_service.client;


import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
public class InventoryClient {

    private final WebClient webClient;

    public InventoryClient(WebClient.Builder builder) {
        this.webClient = builder
                .baseUrl("http://INVENTORY-SERVICE")
                .build();
    }

    // 🔹 Get seat map
    public String getSeatMap(String flightId) {

        return webClient.get()
                .uri("/api/inventory/" + flightId)
                .retrieve()
                .bodyToMono(String.class)
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
