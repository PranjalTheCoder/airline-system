package com.airline.reservation_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "itinerary_segments")
public class ItinerarySegment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long flightInstanceId;
    private Long fareClassId;
    private String segmentStatus;

    @ManyToOne
    @JoinColumn(name = "pnr_id")
    private Pnr pnr;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFlightInstanceId() { return flightInstanceId; }
    public void setFlightInstanceId(Long flightInstanceId) { this.flightInstanceId = flightInstanceId; }

    public Long getFareClassId() { return fareClassId; }
    public void setFareClassId(Long fareClassId) { this.fareClassId = fareClassId; }

    public String getSegmentStatus() { return segmentStatus; }
    public void setSegmentStatus(String segmentStatus) { this.segmentStatus = segmentStatus; }

    public Pnr getPnr() { return pnr; }
    public void setPnr(Pnr pnr) { this.pnr = pnr; }
}