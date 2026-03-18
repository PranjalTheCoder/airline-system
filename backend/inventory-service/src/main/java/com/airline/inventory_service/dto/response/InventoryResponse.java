package com.airline.inventory_service.dto.response;

public class InventoryResponse {

    private Long flightInstanceId;
    private String fareClassCode;

    private int totalSeats;
    private int availableSeats;
    private int reservedSeats;

    // Getters & Setters

    public Long getFlightInstanceId() {
        return flightInstanceId;
    }

    public void setFlightInstanceId(Long flightInstanceId) {
        this.flightInstanceId = flightInstanceId;
    }

    public String getFareClassCode() {
        return fareClassCode;
    }

    public void setFareClassCode(String fareClassCode) {
        this.fareClassCode = fareClassCode;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public int getReservedSeats() {
        return reservedSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public void setReservedSeats(int reservedSeats) {
        this.reservedSeats = reservedSeats;
    }
}