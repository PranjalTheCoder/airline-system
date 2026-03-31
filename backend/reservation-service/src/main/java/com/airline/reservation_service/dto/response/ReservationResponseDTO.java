package com.airline.reservation_service.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public class ReservationResponseDTO {

    private String id;
    private String pnr;
    private String status;

    private String userId;
    private String outboundFlightId;
    private String cabinClass;

    private String contactEmail;
    private String contactPhone;

    private LocalDateTime createdAt;
    private LocalDateTime expiresAt;

    private List<PassengerResponseDTO> passengers;
    private PricingDTO pricing;

    // Getter and Setter for id
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }

    // Getter and Setter for pnr
    public String getPnr() {
        return pnr;
    }
    public void setPnr(String pnr) {
        this.pnr = pnr;
    }

    // Getter and Setter for status
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
    }

    // Getter and Setter for userId
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Getter and Setter for outboundFlightId
    public String getOutboundFlightId() {
        return outboundFlightId;
    }
    public void setOutboundFlightId(String outboundFlightId) {
        this.outboundFlightId = outboundFlightId;
    }

    // Getter and Setter for cabinClass
    public String getCabinClass() {
        return cabinClass;
    }
    public void setCabinClass(String cabinClass) {
        this.cabinClass = cabinClass;
    }

    // Getter and Setter for contactEmail
    public String getContactEmail() {
        return contactEmail;
    }
    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    // Getter and Setter for contactPhone
    public String getContactPhone() {
        return contactPhone;
    }
    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    // Getter and Setter for createdAt
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Getter and Setter for expiresAt
    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }
    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    // Getter and Setter for passengers
    public List<PassengerResponseDTO> getPassengers() {
        return passengers;
    }
    public void setPassengers(List<PassengerResponseDTO> passengers) {
        this.passengers = passengers;
    }

    // Getter and Setter for pricing
    public PricingDTO getPricing() {
        return pricing;
    }
    public void setPricing(PricingDTO pricing) {
        this.pricing = pricing;
    }
}
