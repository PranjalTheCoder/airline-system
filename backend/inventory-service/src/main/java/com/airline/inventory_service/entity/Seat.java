package com.airline.inventory_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "seats")
public class Seat {

    @Id
    private String id;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;

    @Column(name = "row_num", nullable = false)
    private Integer rowNum;

    @Column(name = "column_letter", nullable = false)
    private String columnLetter;

    @Column(name = "seat_type")
    private String seatType;

    @Column(name = "seat_status")
    private String seatStatus;

    @Column(name = "price")
    private Double price;

    @Column(name = "currency")
    private String currency;

    @Version
    private Integer version;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;

    @ManyToOne
    @JoinColumn(name = "seat_map_id")
    private SeatMap seatMap;

    @ManyToOne
    @JoinColumn(name = "row_id")
    private SeatRow seatRow;

    // Constructors
    public Seat() {}

    public Seat(String id, String seatNumber) {
        this.id = id;
        this.seatNumber = seatNumber;
    }

    // Getters & Setters (FULL)
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public Integer getRowNum() { return rowNum; }
    public void setRowNum(Integer rowNum) { this.rowNum = rowNum; }

    public String getColumnLetter() { return columnLetter; }
    public void setColumnLetter(String columnLetter) { this.columnLetter = columnLetter; }

    public String getSeatType() { return seatType; }
    public void setSeatType(String seatType) { this.seatType = seatType; }

    public String getSeatStatus() { return seatStatus; }
    public void setSeatStatus(String seatStatus) { this.seatStatus = seatStatus; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }

    public SeatMap getSeatMap() { return seatMap; }
    public void setSeatMap(SeatMap seatMap) { this.seatMap = seatMap; }

    public SeatRow getSeatRow() { return seatRow; }
    public void setSeatRow(SeatRow seatRow) { this.seatRow = seatRow; }
}