package com.airline.inventory_service.dto;

import java.util.Map;
public class AircraftDTO {

    private String id;
    private String model;
    private String seatLayout;
    private Integer totalSeats;
    private Map<String, Integer> cabinConfig;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getSeatLayout() {
        return seatLayout;
    }

    public void setSeatLayout(String seatLayout) {
        this.seatLayout = seatLayout;
    }

    public Integer getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(Integer totalSeats) {
        this.totalSeats = totalSeats;
    }

    public Map<String, Integer> getCabinConfig() {
        return cabinConfig;
    }

    public void setCabinConfig(Map<String, Integer> cabinConfig) {
        this.cabinConfig = cabinConfig;
    }
}