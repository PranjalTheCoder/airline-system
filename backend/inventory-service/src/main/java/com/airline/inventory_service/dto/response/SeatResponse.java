package com.airline.inventory_service.dto.response;


public class SeatResponse {

    private Long seatId;
    private String seatNumber;
    private String cabinClass;
    private String seatType;
    private String status;

    // Getters & Setters

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public String getCabinClass() {
        return cabinClass;
    }

    public String getSeatType() {
        return seatType;
    }

    public String getStatus() {
        return status;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public void setCabinClass(String cabinClass) {
        this.cabinClass = cabinClass;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
