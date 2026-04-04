package com.airline.inventory_service.dto;

public class SeatInfoDTO {

    private String seatNumber;
    private String cabinClass;
    private String status;
    private Double price;

    // Default constructor
    public SeatInfoDTO() {
    }

    // Parameterized constructor
    public SeatInfoDTO(String seatNumber, String cabinClass, String status, Double price) {
        this.seatNumber = seatNumber;
        this.cabinClass = cabinClass;
        this.status = status;
        this.price = price;
    }

    // Getter and Setter for seatNumber
    public String getSeatNumber() {
        return seatNumber;
    }
    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    // Getter and Setter for cabinClass
    public String getCabinClass() {
        return cabinClass;
    }
    public void setCabinClass(String cabinClass) {
        this.cabinClass = cabinClass;
    }

    // Getter and Setter for status
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    // Getter and Setter for price
    public Double getPrice() {
        return price;
    }
    public void setPrice(Double price) {
        this.price = price;
    }
}
