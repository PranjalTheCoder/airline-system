package com.airline.reservation_service.dto.response;

public class TaxDTO {

    private String code;
    private String name;
    private double amount;

    // Getter and Setter for code
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    // Getter and Setter for name
    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    // Getter and Setter for amount
    public double getAmount() {
        return amount;
    }
    public void setAmount(double amount) {
        this.amount = amount;
    }
}

