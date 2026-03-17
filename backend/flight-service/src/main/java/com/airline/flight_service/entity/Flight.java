package com.airline.flight_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "flights")
public class Flight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String flightNumber;

    @ManyToOne
    private Airline airline;

    @ManyToOne
    private Route route;

    // Constructors
    public Flight() {}

    public Flight(Long id, String flightNumber, Airline airline, Route route) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.airline = airline;
        this.route = route;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public Airline getAirline() { return airline; }
    public void setAirline(Airline airline) { this.airline = airline; }

    public Route getRoute() { return route; }
    public void setRoute(Route route) { this.route = route; }
}