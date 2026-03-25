package com.airline.payment_service.dto;

public class RefundRequestDTO {

    private Long paymentId;
    private String reason;

    // Default constructor (no-args)
    public RefundRequestDTO() {
    }

    // Parameterized constructor
    public RefundRequestDTO(Long paymentId, String reason) {
        this.paymentId = paymentId;
        this.reason = reason;
    }

    // Getters
    public Long getPaymentId() {
        return paymentId;
    }

    public String getReason() {
        return reason;
    }

    // Setters
    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
