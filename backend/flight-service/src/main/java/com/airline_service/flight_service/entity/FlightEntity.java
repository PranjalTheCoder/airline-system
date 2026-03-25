package com.airline_service.flight_service.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flights")
public class FlightEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "flight_number")
    private String flightNumber;
    @Column(name = "airline_id")
    private Long airlineId;
    @Column(name = "route_id")
    private Long routeId;
    @Column(name = "aircraft_id")
    private String aircraftId;
    private int stops;
    private String status;

    public FlightEntity() {}

    public FlightEntity(Long id, String flightNumber, Long airlineId, Long routeId, String aircraftId, int stops, String status) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.airlineId = airlineId;
        this.routeId = routeId;
        this.aircraftId = aircraftId;
        this.stops = stops;
        this.status = status;
    }

    // getters & setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public Long getAirlineId() { return airlineId; }
    public void setAirlineId(Long airlineId) { this.airlineId = airlineId; }

    public Long getRouteId() { return routeId; }
    public void setRouteId(Long routeId) { this.routeId = routeId; }

    public String getAircraftId() { return aircraftId; }
    public void setAircraftId(String aircraftId) { this.aircraftId = aircraftId; }

    public int getStops() { return stops; }
    public void setStops(int stops) { this.stops = stops; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

	
}