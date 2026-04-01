package com.airline.reservation_service.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "reservations")
public class ReservationEntity {

    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String pnr;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "flight_id", nullable = false)
    private String flightId;

    @Column(name = "cabin_class")
    private String cabinClass;

    private String status;

    @Column(name = "contact_email")
    private String contactEmail;

    @Column(name = "contact_phone")
    private String contactPhone;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

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

    // Getter and Setter for userId
    public String getUserId() {
        return userId;
    }
    public void setUserId(String userId) {
        this.userId = userId;
    }

    // Getter and Setter for flightId
    public String getFlightId() {
        return flightId;
    }
    public void setFlightId(String flightId) {
        this.flightId = flightId;
    }

    // Getter and Setter for cabinClass
    public String getCabinClass() {
        return cabinClass;
    }
    public void setCabinClass(String cabinClass) {
        this.cabinClass = cabinClass;
    }

    // Getter and Setter for status
    public String getStatus() {
        return status;
    }
    public void setStatus(String status) {
        this.status = status;
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
}
