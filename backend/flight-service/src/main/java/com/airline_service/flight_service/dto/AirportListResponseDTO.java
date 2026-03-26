package com.airline_service.flight_service.dto;

import java.util.List;

public class AirportListResponseDTO {

    private List<AirportDTO> airports;

    public AirportListResponseDTO() {}

    public AirportListResponseDTO(List<AirportDTO> airports) {
        this.airports = airports;
    }

    public List<AirportDTO> getAirports() {
        return airports;
    }

    public void setAirports(List<AirportDTO> airports) {
        this.airports = airports;
    }
}