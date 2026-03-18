package com.airline.inventory_service.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CreateInventoryRequest {

    @NotNull
    private Long flightInstanceId;

    @NotNull
    private Long fareClassId;

    @Min(1)
    private int totalSeats;

    // Getters & Setters

    public Long getFlightInstanceId() {
        return flightInstanceId;
    }

    public void setFlightInstanceId(Long flightInstanceId) {
        this.flightInstanceId = flightInstanceId;
    }

    public Long getFareClassId() {
        return fareClassId;
    }

    public void setFareClassId(Long fareClassId) {
        this.fareClassId = fareClassId;
    }

    public int getTotalSeats() {
        return totalSeats;
    }

    public void setTotalSeats(int totalSeats) {
        this.totalSeats = totalSeats;
    }
}