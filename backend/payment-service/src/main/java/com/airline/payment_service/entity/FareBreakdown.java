package com.airline.payment_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "fare_breakdown")
public class FareBreakdown {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String pnrCode;

    private Double baseFare;
    private Double tax;
    private Double fee;
    private Double ancillary;
    private Double totalAmount;

    // Default constructor (required by JPA)
    public FareBreakdown() {
    }

    // Parameterized constructor
    public FareBreakdown(Long id, String pnrCode, Double baseFare,
                         Double tax, Double fee, Double ancillary, Double totalAmount) {
        this.id = id;
        this.pnrCode = pnrCode;
        this.baseFare = baseFare;
        this.tax = tax;
        this.fee = fee;
        this.ancillary = ancillary;
        this.totalAmount = totalAmount;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getPnrCode() {
        return pnrCode;
    }

    public Double getBaseFare() {
        return baseFare;
    }

    public Double getTax() {
        return tax;
    }

    public Double getFee() {
        return fee;
    }

    public Double getAncillary() {
        return ancillary;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setPnrCode(String pnrCode) {
        this.pnrCode = pnrCode;
    }

    public void setBaseFare(Double baseFare) {
        this.baseFare = baseFare;
    }

    public void setTax(Double tax) {
        this.tax = tax;
    }

    public void setFee(Double fee) {
        this.fee = fee;
    }

    public void setAncillary(Double ancillary) {
        this.ancillary = ancillary;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
