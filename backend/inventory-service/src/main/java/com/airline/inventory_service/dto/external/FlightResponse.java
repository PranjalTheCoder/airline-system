package com.airline.inventory_service.dto.external;

import java.util.List;

public class FlightResponse {

    private List<FlightDTO> flights;

    public List<FlightDTO> getFlights() {
        return flights;
    }

    public void setFlights(List<FlightDTO> flights) {
        this.flights = flights;
    }
}