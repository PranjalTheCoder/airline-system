package com.airline.inventory_service.dto;

public class AirportDTO {

    private String code;
    private String name;
    private String city;
    private String country;
    private String timezone;

    // --- Constructors ---
    public AirportDTO() {
        // Default constructor
    }

    public AirportDTO(String code, String name, String city, String country, String timezone) {
        this.code = code;
        this.name = name;
        this.city = city;
        this.country = country;
        this.timezone = timezone;
    }

    // --- Getters and Setters ---
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}