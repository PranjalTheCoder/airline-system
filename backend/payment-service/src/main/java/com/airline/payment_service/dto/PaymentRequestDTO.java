package com.airline.payment_service.dto;

public class PaymentRequestDTO {

    private String pnrCode;
    private String paymentMethod;
    private String idempotencyKey;

    // Default constructor (no-args)
    public PaymentRequestDTO() {
    }

    // Parameterized constructor
    public PaymentRequestDTO(String pnrCode, String paymentMethod, String idempotencyKey) {
        this.pnrCode = pnrCode;
        this.paymentMethod = paymentMethod;
        this.idempotencyKey = idempotencyKey;
    }

    // Getters
    public String getPnrCode() {
        return pnrCode;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    // Setters
    public void setPnrCode(String pnrCode) {
        this.pnrCode = pnrCode;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }
}
