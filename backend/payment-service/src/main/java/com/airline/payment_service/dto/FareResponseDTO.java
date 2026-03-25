package com.airline.payment_service.dto;

public class FareResponseDTO {

    private Double baseFare;
    private Double tax;
    private Double fee;
    private Double total;

    // Default constructor (no-args)
    public FareResponseDTO() {
    }

    // Parameterized constructor
    public FareResponseDTO(Double baseFare, Double tax, Double fee, Double total) {
        this.baseFare = baseFare;
        this.tax = tax;
        this.fee = fee;
        this.total = total;
    }

    // Getters
    public Double getBaseFare() {
        return baseFare;
    }

    public Double getTax() {
        return tax;
    }

    public Double getFee() {
        return fee;
    }

    public Double getTotal() {
        return total;
    }

    // Setters
    public void setBaseFare(Double baseFare) {
        this.baseFare = baseFare;
    }

    public void setTax(Double tax) {
        this.tax = tax;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public void setTotal(Double total) {
        this.total = total;
    }
}
