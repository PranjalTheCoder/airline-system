package com.airline.reservation_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pnr_history")
public class PnrHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String action;
    private Long changedBy;
    private LocalDateTime changedAt;

    @ManyToOne
    @JoinColumn(name = "pnr_id")
    private Pnr pnr;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public Long getChangedBy() { return changedBy; }
    public void setChangedBy(Long changedBy) { this.changedBy = changedBy; }

    public LocalDateTime getChangedAt() { return changedAt; }
    public void setChangedAt(LocalDateTime changedAt) { this.changedAt = changedAt; }

    public Pnr getPnr() { return pnr; }
    public void setPnr(Pnr pnr) { this.pnr = pnr; }
}