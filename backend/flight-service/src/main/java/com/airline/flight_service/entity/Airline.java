package com.airline.flight_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "airlines")
public class Airline {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "iata_code")
    private String iataCode;

    private String airlineType;

    private String country;

    // Constructors
    public Airline() {}

    public Airline(Long id, String name, String iataCode, String airlineType, String country) {
        this.id = id;
        this.name = name;
        this.iataCode = iataCode;
        this.airlineType = airlineType;
        this.country = country;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getIataCode() { return iataCode; }
    public void setIataCode(String iataCode) { this.iataCode = iataCode; }

    public String getAirlineType() { return airlineType; }
    public void setAirlineType(String airlineType) { this.airlineType = airlineType; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
}