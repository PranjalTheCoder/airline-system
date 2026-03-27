package com.airline.inventory_service.dto.external;

import com.fasterxml.jackson.annotation.JsonProperty;

public class FlightDTO {
	 @JsonProperty("flightNumber") 
    private String flightId;
    private String aircraftType;

    public FlightDTO() {}

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getAircraftType() { return aircraftType; }
    public void setAircraftType(String aircraftType) { this.aircraftType = aircraftType; }
}