package com.airline.inventory_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seat_pricing")
public class SeatPricing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "base_price")
    private Double basePrice;

    @Column(name = "tax")
    private Double tax;

    @Column(name = "final_price")
    private Double finalPrice;

    @Column(name = "currency")
    private String currency;

    @Column(name = "pricing_type")
    private String pricingType;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    public SeatPricing() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Double getBasePrice() { return basePrice; }
    public void setBasePrice(Double basePrice) { this.basePrice = basePrice; }

    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }

    public Double getFinalPrice() { return finalPrice; }
    public void setFinalPrice(Double finalPrice) { this.finalPrice = finalPrice; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getPricingType() { return pricingType; }
    public void setPricingType(String pricingType) { this.pricingType = pricingType; }

    public Seat getSeat() { return seat; }
    public void setSeat(Seat seat) { this.seat = seat; }
}