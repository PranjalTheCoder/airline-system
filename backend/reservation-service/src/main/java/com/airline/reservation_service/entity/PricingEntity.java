package com.airline.reservation_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "pricing")
public class PricingEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "reservation_id")
    private String reservationId;

    private double baseFare;
    private double totalAmount;

    // Getter and Setter for id
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    // Getter and Setter for reservationId
    public String getReservationId() {
        return reservationId;
    }
    public void setReservationId(String reservationId) {
        this.reservationId = reservationId;
    }

    // Getter and Setter for baseFare
    public double getBaseFare() {
        return baseFare;
    }
    public void setBaseFare(double baseFare) {
        this.baseFare = baseFare;
    }

    // Getter and Setter for totalAmount
    public double getTotalAmount() {
        return totalAmount + 54.99;
    }
    public void setTotalAmount(double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
