package com.airline_service.flight_service.client;


import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.airline_service.flight_service.dto.AircraftDTO;
import com.airline_service.flight_service.dto.AirportDTO;

@Component
public class AdminClient {

    private final WebClient webClient;

    public AdminClient(WebClient webClient) {
        this.webClient = webClient;
    }

    public String getAircraftModel(String aircraftId) {
        try {
            AircraftDTO response = webClient.get()
                    .uri("/api/admin/aircraft/" + aircraftId)
                    .retrieve()
                    .bodyToMono(AircraftDTO.class)
                    .block();

            return response != null ? response.getModel() : "UNKNOWN";
        } catch (Exception e) {
            return "UNKNOWN";
        }
    }

    public AirportDTO getAirport(String code) {
        try {
        	return webClient.get()
                    .uri("/api/admin/airports/" + code)
                    .retrieve()
                    .bodyToMono(AirportDTO.class)
                    .block();
        } catch(Exception e) {
        	System.out.println("ERROR CALLING AIRPORT API: " + e.getMessage());
            return null;
        }
    }
}