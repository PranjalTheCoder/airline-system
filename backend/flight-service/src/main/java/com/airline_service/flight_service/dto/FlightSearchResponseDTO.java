package com.airline_service.flight_service.dto;


import java.util.List;


public class FlightSearchResponseDTO {

    private List<FlightDTO> flights;

    public FlightSearchResponseDTO() {}

    public FlightSearchResponseDTO(List<FlightDTO> flights) {
        this.flights = flights;
    }

    public List<FlightDTO> getFlights() { return flights; }
    public void setFlights(List<FlightDTO> flights) { this.flights = flights; }
}