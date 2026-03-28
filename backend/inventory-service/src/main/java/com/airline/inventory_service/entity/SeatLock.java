package com.airline.inventory_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "seat_locks")
public class SeatLock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_id")
    private Long seatId;

    @Column(name = "flight_id")
    private String flightId;

    @Column(name = "locked_by")
    private String lockedBy;

    @Column(name = "lock_expiry")
    private LocalDateTime lockExpiry;

    private String status;

    // --- Constructors ---
    public SeatLock() {
        // Default constructor required by JPA
    }

    public SeatLock(Long seatId, String flightId, String lockedBy,
                    LocalDateTime lockExpiry, String status) {
        this.seatId = seatId;
        this.flightId = flightId;
        this.lockedBy = lockedBy;
        this.lockExpiry = lockExpiry;
        this.status = status;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSeatId() {
        return seatId;
    }

    public void setSeatId(Long seatId) {
        this.seatId = seatId;
    }

    public String getFlightId() {
        return flightId;
    }

    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }

    public String getLockedBy() {
        return lockedBy;
    }

    public void setLockedBy(String lockedBy) {
        this.lockedBy = lockedBy;
    }

    public LocalDateTime getLockExpiry() {
        return lockExpiry;
    }

    public void setLockExpiry(LocalDateTime lockExpiry) {
        this.lockExpiry = lockExpiry;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
