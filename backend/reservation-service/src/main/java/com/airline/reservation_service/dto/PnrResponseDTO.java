package com.airline.reservation_service.dto;

import java.util.List;

public class PnrResponseDTO {

    private String pnrCode;
    private String bookingStatus;
    private Long createdBy;
//    private Double totalAmount;

    private List<PassengerDTO> passengers;
    private List<SegmentDTO> segments;
    private ContactDTO contact;

    // getters & setters

    public String getPnrCode() { return pnrCode; }
    public void setPnrCode(String pnrCode) { this.pnrCode = pnrCode; }

    public String getBookingStatus() { return bookingStatus; }
    public void setBookingStatus(String bookingStatus) { this.bookingStatus = bookingStatus; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }

//    public Double getTotalAmount() { return totalAmount; }
//    public void setTotalAmount(Double totalAmount) { this.totalAmount = totalAmount; }

    public List<PassengerDTO> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerDTO> passengers) { this.passengers = passengers; }

    public List<SegmentDTO> getSegments() { return segments; }
    public void setSegments(List<SegmentDTO> segments) { this.segments = segments; }
    
    public ContactDTO getContact() { return contact;}
    public void setContact(ContactDTO contact) { this.contact = contact;}
}