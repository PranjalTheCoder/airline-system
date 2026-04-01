package com.airline.reservation_service.dto.external;

public class SeatDTO {

    private String seatNumber;
    private String cabinClass;
    private String status;
    private double price;

    // Default constructor
    public SeatDTO() {
    }

    // Parameterized constructor
    public SeatDTO(String seatNumber, String cabinClass, String status, double price) {
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
    public double getPrice() {
        return price;
    }
    public void setPrice(double price) {
        this.price = price;
    }
}
