package com.airline.admin_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "airports")
public class Airport {

    @Id
    private String code;

    private String name;
    private String city;
    private String country;
    private String status;

    // Default constructor (required by JPA)
    public Airport() {}

    // Parameterized constructor
    public Airport(String code, String name, String city, String country, String status) {
        this.code = code;
        this.name = name;
        this.city = city;
        this.country = country;
        this.status = status;
    }

    // Getters and Setters
    public String getCode() {
        return code;
    }
    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getCity() {
        return city;
    }
    public void setCity(String city) {
        this.city = city;
    }

    public String getCountry() {
        return country;
    }
    public void setCountry(String country) {
        this.country = country;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }
}
