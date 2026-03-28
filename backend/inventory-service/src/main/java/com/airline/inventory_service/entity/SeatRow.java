package com.airline.inventory_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "seat_rows")
public class SeatRow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "row_num")
    private Integer rowNum;

    @Column(name = "is_exit_row")
    private Boolean isExitRow;

    @Column(name = "is_bulkhead")
    private Boolean isBulkhead;

    @ManyToOne
    @JoinColumn(name = "seat_map_id")
    private SeatMap seatMap;

    // --- Constructors ---
    public SeatRow() {
        // Default constructor required by JPA
    }

    public SeatRow(Integer rowNum, Boolean isExitRow, Boolean isBulkhead, SeatMap seatMap) {
        this.rowNum = rowNum;
        this.isExitRow = isExitRow;
        this.isBulkhead = isBulkhead;
        this.seatMap = seatMap;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRowNum() {
        return rowNum;
    }

    public void setRowNum(Integer rowNum) {
        this.rowNum = rowNum;
    }

    public Boolean getIsExitRow() {
        return isExitRow;
    }

    public void setIsExitRow(Boolean isExitRow) {
        this.isExitRow = isExitRow;
    }

    public Boolean getIsBulkhead() {
        return isBulkhead;
    }

    public void setIsBulkhead(Boolean isBulkhead) {
        this.isBulkhead = isBulkhead;
    }

    public SeatMap getSeatMap() {
        return seatMap;
    }

    public void setSeatMap(SeatMap seatMap) {
        this.seatMap = seatMap;
    }
}