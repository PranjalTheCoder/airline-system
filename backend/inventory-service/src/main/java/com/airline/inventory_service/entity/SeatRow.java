package com.airline.inventory_service.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "seat_rows")
public class SeatRow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "row_num", nullable = false)
    private Integer rowNum;

    @Column(name = "is_exit_row")
    private Boolean isExitRow;

    @Column(name = "is_bulkhead")
    private Boolean isBulkhead;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @ManyToOne
    @JoinColumn(name = "seat_map_id")
    private SeatMap seatMap;

    @OneToMany(mappedBy = "seatRow", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Seat> seats;

    // Constructors
    public SeatRow() {}

    public SeatRow(Integer rowNum, Boolean isExitRow) {
        this.rowNum = rowNum;
        this.isExitRow = isExitRow;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Integer getRowNum() { return rowNum; }
    public void setRowNum(Integer rowNum) { this.rowNum = rowNum; }

    public Boolean getIsExitRow() { return isExitRow; }
    public void setIsExitRow(Boolean isExitRow) { this.isExitRow = isExitRow; }

    public Boolean getIsBulkhead() { return isBulkhead; }
    public void setIsBulkhead(Boolean isBulkhead) { this.isBulkhead = isBulkhead; }

    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }

    public SeatMap getSeatMap() { return seatMap; }
    public void setSeatMap(SeatMap seatMap) { this.seatMap = seatMap; }

    public List<Seat> getSeats() { return seats; }
    public void setSeats(List<Seat> seats) { this.seats = seats; }
}