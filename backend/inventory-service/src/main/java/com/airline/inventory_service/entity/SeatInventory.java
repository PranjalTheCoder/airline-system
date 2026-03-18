package com.airline.inventory_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seat_inventory")
public class SeatInventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long flightInstanceId;

    @ManyToOne
    @JoinColumn(name = "fare_class_id")
    private FareClass fareClass;

    private int totalSeats;
    private int availableSeats;
    private int reservedSeats;

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public Long getFlightInstanceId() {
        return flightInstanceId;
    }

    public FareClass getFareClass() {
        return fareClass;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public int getAvailableSeats() {
        return availableSeats;
    }

    public int getReservedSeats() {
        return reservedSeats;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFlightInstanceId(Long flightInstanceId) {
        this.flightInstanceId = flightInstanceId;
    }

    public void setFareClass(FareClass fareClass) {
        this.fareClass = fareClass;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }

    public void setAvailableSeats(int availableSeats) {
        this.availableSeats = availableSeats;
    }

    public void setReservedSeats(int reservedSeats) {
        this.reservedSeats = reservedSeats;
    }
}