package com.airline.inventory_service.entity;


import jakarta.persistence.*;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long aircraftId;

    private String seatNumber;

    @ManyToOne
    @JoinColumn(name = "cabin_class_id")
    private CabinClass cabinClass;

    private String seatType;

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public Long getAircraftId() {
        return aircraftId;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public CabinClass getCabinClass() {
        return cabinClass;
    }

    public String getSeatType() {
        return seatType;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setAircraftId(Long aircraftId) {
        this.aircraftId = aircraftId;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public void setCabinClass(CabinClass cabinClass) {
        this.cabinClass = cabinClass;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }
}