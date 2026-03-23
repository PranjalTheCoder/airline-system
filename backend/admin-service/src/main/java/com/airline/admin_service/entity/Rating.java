package com.airline.admin_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "crew_ratings")
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String crewId;
    private String aircraftType;

    // Default constructor (required by JPA)
    public Rating() {}

    // Parameterized constructor
    public Rating(Long id, String crewId, String aircraftType) {
        this.id = id;
        this.crewId = crewId;
        this.aircraftType = aircraftType;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCrewId() { return crewId; }
    public void setCrewId(String crewId) { this.crewId = crewId; }

    public String getAircraftType() { return aircraftType; }
    public void setAircraftType(String aircraftType) { this.aircraftType = aircraftType; }
}
