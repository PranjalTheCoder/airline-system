package com.airline.inventory_service.dto;

import java.util.List;

public class InventoryResponseDTO {

    private String flightId;
    private List<SeatInfoDTO> seats;

    // Default constructor
    public InventoryResponseDTO() {
    }

    // Parameterized constructor
    public InventoryResponseDTO(String flightId, List<SeatInfoDTO> seats) {
        this.flightId = flightId;
        this.seats = seats;
    }

    // Getter and Setter for flightId
    public String getFlightId() {
        return flightId;
    }
    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }

    // Getter and Setter for seats
    public List<SeatInfoDTO> getSeats() {
        return seats;
    }
    public void setSeats(List<SeatInfoDTO> seats) {
        this.seats = seats;
    }
}
