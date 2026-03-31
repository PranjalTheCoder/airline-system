package com.airline.reservation_service.dto.response;

import java.util.List;

public class PricingDTO {

    private double baseFare;
    private double seatCharges;
    private double serviceFee;
    private double totalAmount;

    private List<TaxDTO> taxes;

    // Getter and Setter for baseFare
    public double getBaseFare() {
        return baseFare;
    }
    public void setBaseFare(double baseFare) {
        this.baseFare = baseFare;
    }

    // Getter and Setter for seatCharges
    public double getSeatCharges() {
        return seatCharges;
    }
    public void setSeatCharges(double seatCharges) {
        this.seatCharges = seatCharges;
    }

    // Getter and Setter for serviceFee
    public double getServiceFee() {
        return serviceFee;
    }
    public void setServiceFee(double serviceFee) {
        this.serviceFee = serviceFee;
    }

    // Getter and Setter for totalAmount
    public double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    // Getter and Setter for taxes
    public List<TaxDTO> getTaxes() {
        return taxes;
    }
    public void setTaxes(List<TaxDTO> taxes) {
        this.taxes = taxes;
    }
}

