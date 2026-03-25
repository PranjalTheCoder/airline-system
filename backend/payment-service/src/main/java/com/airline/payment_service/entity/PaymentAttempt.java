package com.airline.payment_service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_attempts")
public class PaymentAttempt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long paymentId;
    private int attemptNumber;
    private String status;

    @Column(columnDefinition = "TEXT")
    private String response;

    private LocalDateTime createdAt;

    // Default constructor (required by JPA)
    public PaymentAttempt() {
    }

    // Parameterized constructor
    public PaymentAttempt(Long id, Long paymentId, int attemptNumber,
                          String status, String response, LocalDateTime createdAt) {
        this.id = id;
        this.paymentId = paymentId;
        this.attemptNumber = attemptNumber;
        this.status = status;
        this.response = response;
        this.createdAt = createdAt;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public Long getPaymentId() {
        return paymentId;
    }

    public int getAttemptNumber() {
        return attemptNumber;
    }

    public String getStatus() {
        return status;
    }

    public String getResponse() {
        return response;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public void setAttemptNumber(int attemptNumber) {
        this.attemptNumber = attemptNumber;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @PrePersist
    public void prePersist() {
        createdAt = LocalDateTime.now();
    }
}
