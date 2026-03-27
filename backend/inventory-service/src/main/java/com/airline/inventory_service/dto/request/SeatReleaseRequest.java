package com.airline.inventory_service.dto.request;

public class SeatReleaseRequest {

    private String seatId;

    public SeatReleaseRequest() {}

    public String getSeatId() { return seatId; }
    public void setSeatId(String seatId) { this.seatId = seatId; }
}