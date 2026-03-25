package com.airline.payment_service.dto;

public class SegmentDTO {

    private Long flightInstanceId;
    private String flightNumber;

    public Long getFlightInstanceId() {
        return flightInstanceId;
    }

    public void setFlightInstanceId(Long flightInstanceId) {
        this.flightInstanceId = flightInstanceId;
    }

    public String getFlightNumber() {
        return flightNumber;
    }

    public void setFlightNumber(String flightNumber) {
        this.flightNumber = flightNumber;
    }
}