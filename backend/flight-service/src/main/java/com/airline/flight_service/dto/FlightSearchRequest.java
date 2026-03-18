package com.airline.flight_service.dto;

public class FlightSearchRequest {

    private String origin;
    private String destination;
    private String date;
    private Integer passengers;
    private String cabinClass;

    // ✅ Constructor
    public FlightSearchRequest(String origin, String destination, String date,
                               Integer passengers, String cabinClass) {
        this.origin = origin;
        this.destination = destination;
        this.date = date;
        this.passengers = passengers;
        this.cabinClass = cabinClass;
    }

    // ✅ Getters and Setters
    public String getOrigin() {
        return origin;
    }

    public void setOrigin(String origin) {
        this.origin = origin;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public Integer getPassengers() {
        return passengers;
    }

    public void setPassengers(Integer passengers) {
        this.passengers = passengers;
    }

    public String getCabinClass() {
        return cabinClass;
    }

    public void setCabinClass(String cabinClass) {
        this.cabinClass = cabinClass;
    }
}
