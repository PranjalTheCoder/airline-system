package com.airline.inventory_service.dto.response;

import java.util.List;

public class SeatMapResponse {

    private Long flightInstanceId;
    private List<SeatResponse> seats;

    // Getters & Setters

    public Long getFlightInstanceId() {
        return flightInstanceId;
    }

    public void setFlightInstanceId(Long flightInstanceId) {
        this.flightInstanceId = flightInstanceId;
    }

    public List<SeatResponse> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatResponse> seats) {
        this.seats = seats;
    }
}