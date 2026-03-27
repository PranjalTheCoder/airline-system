package com.airline.inventory_service.dto;

import java.util.List;

public class SeatDTO {

    private String id;
    private String seatNumber;

    private Integer row;
    private String column;

    private String status;
    private String type;

    private Double price;
    private String currency;

    private List<String> features;

    public SeatDTO() {}

    public SeatDTO(String id, String seatNumber) {
        this.id = id;
        this.seatNumber = seatNumber;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSeatNumber() { return seatNumber; }
    public void setSeatNumber(String seatNumber) { this.seatNumber = seatNumber; }

    public Integer getRow() { return row; }
    public void setRow(Integer row) { this.row = row; }

    public String getColumn() { return column; }
    public void setColumn(String column) { this.column = column; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public List<String> getFeatures() { return features; }
    public void setFeatures(List<String> features) { this.features = features; }
}