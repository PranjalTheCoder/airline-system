package com.airline_service.flight_service.dto;



public class CabinClassDTO {

    private String type;
    private double basePrice;
    private String currency;

    private int availableSeats;
    private int totalSeats;

    private BaggageDTO baggage;

    public CabinClassDTO() {}

    public CabinClassDTO(String type, double basePrice, String currency,
                         int availableSeats, int totalSeats, BaggageDTO baggage) {
        this.type = type;
        this.basePrice = basePrice;
        this.currency = currency;
        this.availableSeats = availableSeats;
        this.totalSeats = totalSeats;
        this.baggage = baggage;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(double basePrice) {
        this.basePrice = basePrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public BaggageDTO getBaggage() {
        return baggage;
    }

    public void setBaggage(BaggageDTO baggage) {
        this.baggage = baggage;
    }
}
