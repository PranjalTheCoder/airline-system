package com.airline.payment_service.dto;

import java.util.List;

public class PnrDTO {

    private String pnrCode;
    private String bookingStatus; // HOLD / CONFIRMED / CANCELLED
    private Long createdBy;
    private Double totalAmount;
    private List<Object> passengers;
    private List<Object> segments;

    // Default constructor
    public PnrDTO() {
    }

    // Parameterized constructor
    public PnrDTO(String pnrCode, String bookingStatus, Long createdBy, Double totalAmount,
                  List<Object> passengers, List<Object> segments) {
        this.pnrCode = pnrCode;
        this.bookingStatus = bookingStatus;
        this.createdBy = createdBy;
        this.totalAmount = totalAmount;
        this.passengers = passengers;
        this.segments = segments;
    }

    // Getters and Setters
    public String getPnrCode() {
        return pnrCode;
    }

    public void setPnrCode(String pnrCode) {
        this.pnrCode = pnrCode;
    }

    public String getBookingStatus() {
        return bookingStatus;
    }

    public void setBookingStatus(String bookingStatus) {
        this.bookingStatus = bookingStatus;
    }

    public Long getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Long createdBy) {
        this.createdBy = createdBy;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<Object> getPassengers() {
        return passengers;
    }

    public void setPassengers(List<Object> passengers) {
        this.passengers = passengers;
    }

    public List<Object> getSegments() {
        return segments;
    }

    public void setSegments(List<Object> segments) {
        this.segments = segments;
    }
}
