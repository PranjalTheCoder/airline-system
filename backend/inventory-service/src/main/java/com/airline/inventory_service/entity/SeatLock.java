package com.airline.inventory_service.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "seat_locks")
public class SeatLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_id")
    private String flightId;

    @Column(name = "locked_by")
    private String lockedBy;

    @Column(name = "lock_expiry")
    private Timestamp lockExpiry;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    public SeatLock() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getLockedBy() { return lockedBy; }
    public void setLockedBy(String lockedBy) { this.lockedBy = lockedBy; }

    public Timestamp getLockExpiry() { return lockExpiry; }
    public void setLockExpiry(Timestamp lockExpiry) { this.lockExpiry = lockExpiry; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Seat getSeat() { return seat; }
    public void setSeat(Seat seat) { this.seat = seat; }
}