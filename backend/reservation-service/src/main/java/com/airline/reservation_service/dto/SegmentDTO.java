package com.airline.reservation_service.dto;

public class SegmentDTO {

    private Long flightInstanceId;
    private Long fareClassId;

    public Long getFlightInstanceId() { return flightInstanceId; }
    public void setFlightInstanceId(Long flightInstanceId) { this.flightInstanceId = flightInstanceId; }

    public Long getFareClassId() { return fareClassId; }
    public void setFareClassId(Long fareClassId) { this.fareClassId = fareClassId; }
}