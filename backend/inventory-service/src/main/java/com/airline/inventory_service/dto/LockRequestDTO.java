package com.airline.inventory_service.dto;

import java.util.List;

public class LockRequestDTO {

    private String flightId;
    private List<String> seatNumbers;
    private String reservationId;

    // Default constructor
    public LockRequestDTO() {
    }

    // Parameterized constructor
    public LockRequestDTO(String flightId, List<String> seatNumbers, String reservationId) {
        this.flightId = flightId;
        this.seatNumbers = seatNumbers;
        this.reservationId = reservationId;
    }

    // Getter and Setter for flightId
    public String getFlightId() {
        return flightId;
    }
    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }

    // Getter and Setter for seatNumbers
    public List<String> getSeatNumbers() {
        return seatNumbers;
    }
    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }

    // Getter and Setter for reservationId
    public String getReservationId() {
        return reservationId;
    }
    public void setReservationId(String reservationId) {
        this.reservationId = reservationId;
    }
}

