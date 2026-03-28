package com.airline.inventory_service.dto;

import java.util.List;

public class FlightsResponseDTO {

    private List<FlightDTO> flights;

    // --- Constructors ---
    public FlightsResponseDTO() {
        // Default constructor
    }

    public FlightsResponseDTO(List<FlightDTO> flights) {
        this.flights = flights;
    }

    // --- Getters and Setters ---
    public List<FlightDTO> getFlights() {
        return flights;
    }

    public void setFlights(List<FlightDTO> flights) {
        this.flights = flights;
    } 
}
