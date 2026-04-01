package com.airline.reservation_service.dto.response;

import java.util.List;

public class PricingDTO {

    private double baseFare;

    private List<TaxDTO> taxes;

    private double seatCharges;
    private double baggageCharges;
    private double serviceFee;
    private double discount;

    private double totalAmount;
    private String currency;

    // Default constructor
    public PricingDTO() {
    }

    // Parameterized constructor
    public PricingDTO(double baseFare, List<TaxDTO> taxes, double seatCharges, double baggageCharges,
                      double serviceFee, double discount, double totalAmount, String currency) {
        this.baseFare = baseFare;
        this.taxes = taxes;
        this.seatCharges = seatCharges;
        this.baggageCharges = baggageCharges;
        this.serviceFee = serviceFee;
        this.discount = discount;
        this.totalAmount = totalAmount;
        this.currency = currency;
    }

    // Getter and Setter for baseFare
    public double getBaseFare() {
        return baseFare;
    }
    public void setBaseFare(double baseFare) {
        this.baseFare = baseFare;
    }

    // Getter and Setter for taxes
    public List<TaxDTO> getTaxes() {
        return taxes;
    }
    public void setTaxes(List<TaxDTO> taxes) {
        this.taxes = taxes;
    }

    // Getter and Setter for seatCharges
    public double getSeatCharges() {
        return seatCharges;
    }
    public void setSeatCharges(double seatCharges) {
        this.seatCharges = seatCharges;
    }

    // Getter and Setter for baggageCharges
    public double getBaggageCharges() {
        return baggageCharges;
    }
    public void setBaggageCharges(double baggageCharges) {
        this.baggageCharges = baggageCharges;
    }

    // Getter and Setter for serviceFee
    public double getServiceFee() {
        return serviceFee;
    }
    public void setServiceFee(double serviceFee) {
        this.serviceFee = serviceFee;
    }

    // Getter and Setter for discount
    public double getDiscount() {
        return discount;
    }
    public void setDiscount(double discount) {
        this.discount = discount;
    }

    // Getter and Setter for totalAmount
    public double getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }

    // Getter and Setter for currency
    public String getCurrency() {
        return currency;
    }
    public void setCurrency(String currency) {
        this.currency = currency;
    }
}
