package com.airline.flight_service.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "flight_instances")
public class FlightInstance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "schedule_id")
    private FlightSchedule schedule;

    private LocalDate departureDate;
    private String status;

    private LocalDateTime actualDeparture;
    private LocalDateTime actualArrival;

    private String gate;
    private String terminal;

    // Constructors
    public FlightInstance() {}

    public FlightInstance(Long id, FlightSchedule schedule, LocalDate departureDate,
                          String status, LocalDateTime actualDeparture,
                          LocalDateTime actualArrival, String gate, String terminal) {
        this.id = id;
        this.schedule = schedule;
        this.departureDate = departureDate;
        this.status = status;
        this.actualDeparture = actualDeparture;
        this.actualArrival = actualArrival;
        this.gate = gate;
        this.terminal = terminal;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FlightSchedule getSchedule() { return schedule; }
    public void setSchedule(FlightSchedule schedule) { this.schedule = schedule; }

    public LocalDate getDepartureDate() { return departureDate; }
    public void setDepartureDate(LocalDate departureDate) { this.departureDate = departureDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getActualDeparture() { return actualDeparture; }
    public void setActualDeparture(LocalDateTime actualDeparture) { this.actualDeparture = actualDeparture; }

    public LocalDateTime getActualArrival() { return actualArrival; }
    public void setActualArrival(LocalDateTime actualArrival) { this.actualArrival = actualArrival; }

    public String getGate() { return gate; }
    public void setGate(String gate) { this.gate = gate; }

    public String getTerminal() { return terminal; }
    public void setTerminal(String terminal) { this.terminal = terminal; }

	
}