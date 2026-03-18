package com.airline.inventory_service.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "seat_assignments")
public class SeatAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long flightInstanceId;

    private Long passengerId;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    private String status;

    private LocalDateTime holdExpiry;

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public Long getFlightInstanceId() {
        return flightInstanceId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public Seat getSeat() {
        return seat;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getHoldExpiry() {
        return holdExpiry;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setFlightInstanceId(Long flightInstanceId) {
        this.flightInstanceId = flightInstanceId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }

    public void setSeat(Seat seat) {
        this.seat = seat;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setHoldExpiry(LocalDateTime holdExpiry) {
        this.holdExpiry = holdExpiry;
    }
}