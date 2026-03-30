package com.airline.inventory_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "seats",
       uniqueConstraints = @UniqueConstraint(columnNames = {"seat_map_id", "seat_number"}))
public class Seat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "seat_number")
    private String seatNumber;

    @Column(name = "row_num")
    private Integer rowNum;

    @Column(name = "column_letter")
    private String columnLetter;

    @Column(name = "seat_type")
    private String seatType;

    @Column(name = "seat_status")
    private String seatStatus;
    @Column(nullable=false)
    private Double price;

    private String currency = "INR";

    private Integer version;

    @ManyToOne
    @JoinColumn(name = "seat_map_id")
    private SeatMap seatMap;

    @ManyToOne
    @JoinColumn(name = "row_id")
    private SeatRow row;

    // --- Constructors ---
    public Seat() {
        // Default constructor required by JPA
    }

    public Seat(String seatNumber, Integer rowNum, String columnLetter,
                String seatType, String seatStatus, Double price,
                String currency, Integer version, SeatMap seatMap, SeatRow row) {
        this.seatNumber = seatNumber;
        this.rowNum = rowNum;
        this.columnLetter = columnLetter;
        this.seatType = seatType;
        this.seatStatus = seatStatus;
        this.price = price;
        this.currency = currency;
        this.version = version;
        this.seatMap = seatMap;
        this.row = row;
    }

    // --- Getters and Setters ---
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSeatNumber() {
        return seatNumber;
    }

    public void setSeatNumber(String seatNumber) {
        this.seatNumber = seatNumber;
    }

    public Integer getRowNum() {
        return rowNum;
    }

    public void setRowNum(Integer rowNum) {
        this.rowNum = rowNum;
    }

    public String getColumnLetter() {
        return columnLetter;
    }

    public void setColumnLetter(String columnLetter) {
        this.columnLetter = columnLetter;
    }

    public String getSeatType() {
        return seatType;
    }

    public void setSeatType(String seatType) {
        this.seatType = seatType;
    }

    public String getSeatStatus() {
        return seatStatus;
    }

    public void setSeatStatus(String seatStatus) {
        this.seatStatus = seatStatus;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public SeatMap getSeatMap() {
        return seatMap;
    }

    public void setSeatMap(SeatMap seatMap) {
        this.seatMap = seatMap;
    }

    public SeatRow getRow() {
        return row;
    }

    public void setRow(SeatRow row) {
        this.row = row;
    }
}