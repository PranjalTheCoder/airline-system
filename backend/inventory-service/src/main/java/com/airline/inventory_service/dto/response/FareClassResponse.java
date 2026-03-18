package com.airline.inventory_service.dto.response;


public class FareClassResponse {

    private String code;
    private double price;
    private String cabinClass;

    // Getters & Setters

    public String getCode() {
        return code;
    }

    public double getPrice() {
        return price;
    }

    public String getCabinClass() {
        return cabinClass;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public void setCabinClass(String cabinClass) {
        this.cabinClass = cabinClass;
    }
}