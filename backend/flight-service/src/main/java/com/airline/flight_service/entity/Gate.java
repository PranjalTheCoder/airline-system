package com.airline.flight_service.entity;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "gates")
public class Gate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "airport_id")
    private Airport airport;

    private String gateNumber;
    private String terminal;

    public Gate() {}

    public Gate(Long id, Airport airport, String gateNumber, String terminal) {
        this.id = id;
        this.airport = airport;
        this.gateNumber = gateNumber;
        this.terminal = terminal;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Airport getAirport() { return airport; }
    public void setAirport(Airport airport) { this.airport = airport; }

    public String getGateNumber() { return gateNumber; }
    public void setGateNumber(String gateNumber) { this.gateNumber = gateNumber; }

    public String getTerminal() { return terminal; }
    public void setTerminal(String terminal) { this.terminal = terminal; }
}