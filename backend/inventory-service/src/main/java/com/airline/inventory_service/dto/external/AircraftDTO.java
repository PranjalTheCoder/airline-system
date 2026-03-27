package com.airline.inventory_service.dto.external;

import java.util.Map;

public class AircraftDTO {

    private String model;
    private Map<String, Integer> cabinConfig;

    public AircraftDTO() {}

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public Map<String, Integer> getCabinConfig() { return cabinConfig; }
    public void setCabinConfig(Map<String, Integer> cabinConfig) { this.cabinConfig = cabinConfig; }
}