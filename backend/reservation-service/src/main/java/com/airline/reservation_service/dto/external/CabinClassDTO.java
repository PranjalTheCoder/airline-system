package com.airline.reservation_service.dto.external;

public class CabinClassDTO {

    private String type;
    private double basePrice;
    private int availableSeats;

    // Default constructor
    public CabinClassDTO() {
    }

    // Parameterized constructor
    public CabinClassDTO(String type, double basePrice, int availableSeats) {
        this.type = type;
        this.basePrice = basePrice;
        this.availableSeats = availableSeats;
    }

    // Getter and Setter for type
    public String getType() {
        return type;
    }
    public void setType(String type) {
        this.type = type;
    }

    // Getter and Setter for basePrice
    public double getBasePrice() {
        return basePrice;
    }
    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    // Getter and Setter for availableSeats
    public int getAvailableSeats() {
        return availableSeats;
    }
    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }
}
