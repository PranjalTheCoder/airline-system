package com.airline.inventory_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "seat_features")
public class SeatFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String feature;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    // --- Constructors ---
    public SeatFeature() {
        // Default constructor required by JPA
    }

    public SeatFeature(String feature, Seat seat) {
        this.feature = feature;
        this.seat = seat;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFeature() {
        return feature;
    }

    public void setFeature(String feature) {
        this.feature = feature;
    }

    public Seat getSeat() {
        return seat;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }
}