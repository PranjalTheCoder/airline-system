package com.airline.reservation_service.dto.external;

import java.util.List;

public class SeatMapDTO {

    private String flightId;
    private List<SeatDTO> seats;

    public String getFlightId() {
        return flightId;
    }

    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }

    public List<SeatDTO> getSeats() {
        return seats;
    }

    public void setSeats(List<SeatDTO> seats) {
        this.seats = seats;
    }
}