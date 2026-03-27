package com.airline.inventory_service.entity;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "seat_status_history")
public class SeatStatusHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "old_status")
    private String oldStatus;

    @Column(name = "new_status")
    private String newStatus;

    @Column(name = "changed_at")
    private Timestamp changedAt;

    @Column(name = "changed_by")
    private String changedBy;

    @ManyToOne
    @JoinColumn(name = "seat_id")
    private Seat seat;

    public SeatStatusHistory() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getOldStatus() { return oldStatus; }
    public void setOldStatus(String oldStatus) { this.oldStatus = oldStatus; }

    public String getNewStatus() { return newStatus; }
    public void setNewStatus(String newStatus) { this.newStatus = newStatus; }

    public Timestamp getChangedAt() { return changedAt; }
    public void setChangedAt(Timestamp changedAt) { this.changedAt = changedAt; }

    public String getChangedBy() { return changedBy; }
    public void setChangedBy(String changedBy) { this.changedBy = changedBy; }

    public Seat getSeat() { return seat; }
    public void setSeat(Seat seat) { this.seat = seat; }
}