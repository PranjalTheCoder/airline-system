package com.airline.payment_service.dto;

public class PassengerDTO {

    private String name;
    private String seatNumber;

    // Default constructor (no-args)
    public PassengerDTO() {
    }

    // Parameterized constructor
    public PassengerDTO(String name, String seatNumber) {
        this.name = name;
        this.seatNumber = seatNumber;
    }

    // Getters
    public String getName() {
        return name;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    // Setters
    public void setName(String name) {
        this.name = name;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }
}
