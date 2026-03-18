package com.airline.flight_service.entity;

import java.time.LocalTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "flight_schedules")
public class FlightSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "flight_id")
    private Flight flight;

    private LocalTime departureTime;
    private LocalTime arrivalTime;

//    private String daysOfOperation;
//    private LocalDate effectiveFrom;
//    private LocalDate effectiveTo;

    // Constructors
    public FlightSchedule() {}

    public FlightSchedule(Long id, Flight flight, LocalTime departureTime,
                          LocalTime arrivalTime) {
        this.id = id;
        this.flight = flight;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
//        this.daysOfOperation = daysOfOperation;
//        this.effectiveFrom = effectiveFrom;
//        this.effectiveTo = effectiveTo;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Flight getFlight() { return flight; }
    public void setFlight(Flight flight) { this.flight = flight; }

    public LocalTime getDepartureTime() { return departureTime; }
    public void setDepartureTime(LocalTime departureTime) { this.departureTime = departureTime; }

    public LocalTime getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(LocalTime arrivalTime) { this.arrivalTime = arrivalTime; }

//    public String getDaysOfOperation() { return daysOfOperation; }
//    public void setDaysOfOperation(String daysOfOperation) { this.daysOfOperation = daysOfOperation; }
//
//    public LocalDate getEffectiveFrom() { return effectiveFrom; }
//    public void setEffectiveFrom(LocalDate effectiveFrom) { this.effectiveFrom = effectiveFrom; }
//
//    public LocalDate getEffectiveTo() { return effectiveTo; }
//    public void setEffectiveTo(LocalDate effectiveTo) { this.effectiveTo = effectiveTo; }
}