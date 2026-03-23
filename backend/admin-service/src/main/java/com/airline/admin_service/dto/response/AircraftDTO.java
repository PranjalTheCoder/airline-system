package com.airline.admin_service.dto.response;

import java.time.LocalDate;

public class AircraftDTO {
    private String id;
    private String registration;
    private String model;
    private String manufacturer;
    private Integer capacity;
    private CabinConfigDTO cabinConfig;
    private String status;
    private Integer yearBuilt;
    private LocalDate lastMaintenance;
    private LocalDate nextMaintenance;

    // Default constructor
    public AircraftDTO() {}

    // Parameterized constructor
    public AircraftDTO(String id, String registration, String model, String manufacturer,
                       Integer capacity, CabinConfigDTO cabinConfig, String status,
                       Integer yearBuilt, LocalDate lastMaintenance, LocalDate nextMaintenance) {
        this.id = id;
        this.registration = registration;
        this.model = model;
        this.manufacturer = manufacturer;
        this.capacity = capacity;
        this.cabinConfig = cabinConfig;
        this.status = status;
        this.yearBuilt = yearBuilt;
        this.lastMaintenance = lastMaintenance;
        this.nextMaintenance = nextMaintenance;
    }

    // Getters and Setters
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    public String getRegistration() {
        return registration;
    }
    public void setRegistration(String registration) {
        this.registration = registration;
    }

    public String getModel() {
        return model;
    }
    public void setModel(String model) {
        this.model = model;
    }

    public String getManufacturer() {
        return manufacturer;
    }
    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public Integer getCapacity() {
        return capacity;
    }
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public CabinConfigDTO getCabinConfig() {
        return cabinConfig;
    }
    public void setCabinConfig(CabinConfigDTO cabinConfig) {
        this.cabinConfig = cabinConfig;
    }

    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getYearBuilt() {
        return yearBuilt;
    }
    public void setYearBuilt(Integer yearBuilt) {
        this.yearBuilt = yearBuilt;
    }

    public LocalDate getLastMaintenance() {
        return lastMaintenance;
    }
    public void setLastMaintenance(LocalDate lastMaintenance) {
        this.lastMaintenance = lastMaintenance;
    }

    public LocalDate getNextMaintenance() {
        return nextMaintenance;
    }
    public void setNextMaintenance(LocalDate nextMaintenance) {
        this.nextMaintenance = nextMaintenance;
    }
}
