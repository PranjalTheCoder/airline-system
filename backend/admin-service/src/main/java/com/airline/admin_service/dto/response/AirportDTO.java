package com.airline.admin_service.dto.response;

import java.util.List;

public class AirportDTO {
    private String code;
    private String name;
    private String city;
    private String country;
    private List<String> terminals;
    private String status;
    private String timezone;

    // Default constructor
    public AirportDTO() {}

    // Parameterized constructor
    public AirportDTO(String code, String name, String city, String country,
                      List<String> terminals, String status, String timezone) {
        this.code = code;
        this.name = name;
        this.city = city;
        this.country = country;
        this.terminals = terminals;
        this.status = status;
        this.timezone = timezone;
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

    public List<String> getTerminals() {
        return terminals;
    }
    public void setTerminals(List<String> terminals) {
        this.terminals = terminals;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimezone() {
        return timezone;
    }
    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}
