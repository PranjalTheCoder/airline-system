package com.airline.reservation_service.dto.external;

import java.util.List;

public class FlightDTO {

    private String id;
    private String flightNumber;
    private String status;
    private String aircraftType;

    private List<CabinClassDTO> cabinClasses;

    // Default constructor
    public FlightDTO() {
    }

    // Parameterized constructor
    public FlightDTO(String id, String flightNumber, String status, String aircraftType, List<CabinClassDTO> cabinClasses) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.status = status;
        this.aircraftType = aircraftType;
        this.cabinClasses = cabinClasses;
    }

    // Getter and Setter for id
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    // Getter and Setter for flightNumber
    public String getFlightNumber() {
        return flightNumber;
    }
    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }

    // Getter and Setter for status
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    // Getter and Setter for aircraftType
    public String getAircraftType() {
        return aircraftType;
    }
    public void setAircraftType(String aircraftType) {
        this.aircraftType = aircraftType;
    }

    // Getter and Setter for cabinClasses
    public List<CabinClassDTO> getCabinClasses() {
        return cabinClasses;
    }
    public void setCabinClasses(List<CabinClassDTO> cabinClasses) {
        this.cabinClasses = cabinClasses;
    }
}
