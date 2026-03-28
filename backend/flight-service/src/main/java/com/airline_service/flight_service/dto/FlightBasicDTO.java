package com.airline_service.flight_service.dto;

public class FlightBasicDTO {

    private String flightNumber;
    private String aircraftId;

    public FlightBasicDTO() {}

    public FlightBasicDTO(String flightNumber, String aircraftId) {
        this.flightNumber = flightNumber;
        this.aircraftId = aircraftId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    public String getAircraftId() {
        return aircraftId;
    }

    public void setAircraftId(String aircraftId) {
        this.aircraftId = aircraftId;
    }
}