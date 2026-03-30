package com.airline.inventory_service.dto;

public class SeatRequest {
	private String flightId;
    private String seatId;
    private String userId;
    public SeatRequest() { }
    public SeatRequest(String flightId, String seatId, String userId) {
    	this.flightId = flightId;
    	this.seatId = seatId;
    	this.userId = userId;
    }
    public String getFlightId() { return flightId; }
    public String getSeatId() { return seatId; }
    public String getUserId() { return userId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }
    public void setUserId(String userId) { this.userId = userId; }
}
