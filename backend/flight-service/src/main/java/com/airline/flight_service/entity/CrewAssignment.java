package com.airline.flight_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "crew_assignments")
public class CrewAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long crewId; // from crew-service (future)

    private String role; // PILOT, CABIN_CREW

    @ManyToOne
    @JoinColumn(name = "flight_instance_id")
    private FlightInstance flightInstance;

    // Constructors
    public CrewAssignment() {}

    public CrewAssignment(Long id, Long crewId, String role, FlightInstance flightInstance) {
        this.id = id;
        this.crewId = crewId;
        this.role = role;
        this.flightInstance = flightInstance;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCrewId() { return crewId; }
    public void setCrewId(Long crewId) { this.crewId = crewId; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public FlightInstance getFlightInstance() { return flightInstance; }
    public void setFlightInstance(FlightInstance flightInstance) {
        this.flightInstance = flightInstance;
    }
}