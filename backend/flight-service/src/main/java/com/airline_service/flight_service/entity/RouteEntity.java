package com.airline_service.flight_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "routes")
public class RouteEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "origin_code")
    private String originCode;
    @Column(name = "destination_code")
    private String destinationCode;
    @Column(name = "duration_minutes")
    private int durationMinutes;

    public RouteEntity() {}

    public RouteEntity(Long id, String originCode, String destinationCode, int durationMinutes) {
        this.id = id;
        this.originCode = originCode;
        this.destinationCode = destinationCode;
        this.durationMinutes = durationMinutes;
    }

    // getters setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOriginCode() { return originCode; }
    public void setOriginCode(String originCode) { this.originCode = originCode; }

    public String getDestinationCode() { return destinationCode; }
    public void setDestinationCode(String destinationCode) { this.destinationCode = destinationCode; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }
}