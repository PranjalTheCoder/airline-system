package com.airline_service.flight_service.entity;



import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "flight_schedules")
public class FlightScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name="flight_id")
    private Long flightId;
    @Column(name="departure_time")
    private LocalTime departureTime;
    @Column(name="arrival_time")
    private LocalTime arrivalTime;
    @Column(name="days_of_operation")
    private String daysOfOperation;
    @Column(name="effective_from")
    private LocalDate effectiveFrom;
    @Column(name="effective_to")
    private LocalDate effectiveTo;

    public FlightScheduleEntity() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }

    public String getDaysOfOperation() { return daysOfOperation; }
    public void setDaysOfOperation(String daysOfOperation) { this.daysOfOperation = daysOfOperation; }

    public LocalDate getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDate getEffectiveTo() { return effectiveTo; }
    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }
}