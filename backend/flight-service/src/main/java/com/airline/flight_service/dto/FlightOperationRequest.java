package com.airline.flight_service.dto;

public class FlightOperationRequest {

    private Integer delayMinutes;
    private String reason;
    private Long divertedAirportId;

    // Getters & Setters
    public Integer getDelayMinutes() { return delayMinutes; }
    public void setDelayMinutes(Integer delayMinutes) { this.delayMinutes = delayMinutes; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public Long getDivertedAirportId() { return divertedAirportId; }
    public void setDivertedAirportId(Long divertedAirportId) { this.divertedAirportId = divertedAirportId; }
}