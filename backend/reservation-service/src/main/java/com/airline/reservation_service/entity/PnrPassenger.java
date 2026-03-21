package com.airline.reservation_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pnr_passengers")
public class PnrPassenger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long passengerId;
    private String passengerType;

    @ManyToOne
    @JoinColumn(name = "pnr_id")
    private Pnr pnr;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getPassengerId() { return passengerId; }
    public void setPassengerId(Long passengerId) { this.passengerId = passengerId; }

    public String getPassengerType() { return passengerType; }
    public void setPassengerType(String passengerType) { this.passengerType = passengerType; }

    public Pnr getPnr() { return pnr; }
    public void setPnr(Pnr pnr) { this.pnr = pnr; }
}