package com.airline.reservation_service.dto;

public class PassengerDTO {

    private Long passengerId;
    private String passengerType;

    public Long getPassengerId() { return passengerId; }
    public void setPassengerId(Long passengerId) { this.passengerId = passengerId; }

    public String getPassengerType() { return passengerType; }
    public void setPassengerType(String passengerType) { this.passengerType = passengerType; }
}