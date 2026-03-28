package com.airline.inventory_service.dto;
import java.util.Map;

public class CabinClassDTO {

    private String type;
    private Double basePrice;
    private String currency;

    private Integer availableSeats;
    private Integer totalSeats;

    private Map<String, String> baggage; // cabin + checked

    // Default constructor
    public CabinClassDTO() {
    }

    // Parameterized constructor
    public CabinClassDTO(String type, Double basePrice, String currency,
                         Integer availableSeats, Integer totalSeats,
                         Map<String, String> baggage) {
        this.type = type;
        this.basePrice = basePrice;
        this.currency = currency;
        this.availableSeats = availableSeats;
        this.totalSeats = totalSeats;
        this.baggage = baggage;
    }

    // Getters and Setters

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getBasePrice() {
        return basePrice;
    }

    public void setBasePrice(Double basePrice) {
        this.basePrice = basePrice;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Map<String, String> getBaggage() {
        return baggage;
    }

    public void setBaggage(Map<String, String> baggage) {
        this.baggage = baggage;
    }
}