package com.airline.inventory_service.dto.request;

public class SeatHoldRequest {

    private String flightId;
    private String seatId;
    private String userId;

    public SeatHoldRequest() {}

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}