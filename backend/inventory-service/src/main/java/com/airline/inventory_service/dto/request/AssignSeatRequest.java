package com.airline.inventory_service.dto.request;


import jakarta.validation.constraints.NotNull;

public class AssignSeatRequest {

    @NotNull
    private Long seatId;

    @NotNull
    private Long passengerId;

    // Getters & Setters

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public Long getPassengerId() {
        return passengerId;
    }

    public void setPassengerId(Long passengerId) {
        this.passengerId = passengerId;
    }
}
