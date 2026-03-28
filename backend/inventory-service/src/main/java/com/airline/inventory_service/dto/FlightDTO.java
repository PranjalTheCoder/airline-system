package com.airline.inventory_service.dto;

public class FlightDTO {

    private String flightNumber;
    private String aircraftId;

  
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