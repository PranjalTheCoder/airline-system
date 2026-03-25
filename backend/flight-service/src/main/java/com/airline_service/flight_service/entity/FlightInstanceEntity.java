package com.airline_service.flight_service.entity;


import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flight_instances")
public class FlightInstanceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="flight_id")
    private Long flightId;
    @Column(name = "departure_datetime")
    private LocalDateTime departureDateTime;
    @Column(name = "arrival_datetime")
    private LocalDateTime arrivalDateTime;
    private String status;
    private String gate;
    private String terminal;

    public FlightInstanceEntity() {}

    // getters setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }

    public LocalDateTime getDepartureDateTime() { return departureDateTime; }
    public void setDepartureDateTime(LocalDateTime departureDateTime) { this.departureDateTime = departureDateTime; }

    public LocalDateTime getArrivalDateTime() { return arrivalDateTime; }
    public void setArrivalDateTime(LocalDateTime arrivalDateTime) { this.arrivalDateTime = arrivalDateTime; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGate() { return gate; }
    public void setGate(String gate) { this.gate = gate; }

    public String getTerminal() { return terminal; }
    public void setTerminal(String terminal) { this.terminal = terminal; }
}
