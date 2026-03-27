package com.airline.inventory_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seat_features")
public class SeatFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "feature")
    private String feature;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    public SeatFeature() {}

    public SeatFeature(String feature) {
        this.feature = feature;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFeature() { return feature; }
    public void setFeature(String feature) { this.feature = feature; }

    public Seat getSeat() { return seat; }
    public void setSeat(Seat seat) { this.seat = seat; }
}