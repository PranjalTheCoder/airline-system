package com.airline.admin_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "crew")
public class Crew {

    @Id
    private String id;

    private String employeeId;
    private String firstName;
    private String lastName;
    private String role;
    private String license;
    private String base;
    private String status;
    private Integer flightHoursMonth;
    private Integer flightHoursMax;

    // Default constructor (required by JPA)
    public Crew() {}

    // Parameterized constructor
    public Crew(String id, String employeeId, String firstName, String lastName,
                String role, String license, String base, String status,
                Integer flightHoursMonth, Integer flightHoursMax) {
        this.id = id;
        this.employeeId = employeeId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.license = license;
        this.base = base;
        this.status = status;
        this.flightHoursMonth = flightHoursMonth;
        this.flightHoursMax = flightHoursMax;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getLicense() { return license; }
    public void setLicense(String license) { this.license = license; }

    public String getBase() { return base; }
    public void setBase(String base) { this.base = base; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Integer getFlightHoursMonth() { return flightHoursMonth; }
    public void setFlightHoursMonth(Integer flightHoursMonth) { this.flightHoursMonth = flightHoursMonth; }

    public Integer getFlightHoursMax() { return flightHoursMax; }
    public void setFlightHoursMax(Integer flightHoursMax) { this.flightHoursMax = flightHoursMax; }
}
