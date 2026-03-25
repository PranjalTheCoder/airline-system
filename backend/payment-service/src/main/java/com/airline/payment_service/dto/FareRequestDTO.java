package com.airline.payment_service.dto;

public class FareRequestDTO {

    private String pnrCode;

    // Default constructor (no-args)
    public FareRequestDTO() {
    }

    // Parameterized constructor
    public FareRequestDTO(String pnrCode) {
        this.pnrCode = pnrCode;
    }

    // Getter
    public String getPnrCode() {
        return pnrCode;
    }

    // Setter
    public void setPnrCode(String pnrCode) {
        this.pnrCode = pnrCode;
    }
}
