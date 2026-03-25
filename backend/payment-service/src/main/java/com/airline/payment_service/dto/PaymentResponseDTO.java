package com.airline.payment_service.dto;

public class PaymentResponseDTO {

    private Long paymentId;
    private String status;
    private Double amount;
    private String message;

    // Default constructor (no-args)
    public PaymentResponseDTO() {
    }

    // Parameterized constructor
    public PaymentResponseDTO(Long paymentId, String status, Double amount, String message) {
        this.paymentId = paymentId;
        this.status = status;
        this.amount = amount;
        this.message = message;
    }

    // Getters
    public Long getPaymentId() {
        return paymentId;
    }

    public String getStatus() {
        return status;
    }

    public Double getAmount() {
        return amount;
    }

    public String getMessage() {
        return message;
    }

    // Setters
    public void setPaymentId(Long paymentId) {
        this.paymentId = paymentId;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
