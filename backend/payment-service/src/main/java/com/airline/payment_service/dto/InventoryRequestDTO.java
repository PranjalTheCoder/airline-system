package com.airline.payment_service.dto;



import java.util.List;

public class InventoryRequestDTO {

    private String pnrCode;
    private Long flightInstanceId;
    private List<String> seatNumbers;

    // Default constructor (no-args)
    public InventoryRequestDTO() {
    }

    // Parameterized constructor
    public InventoryRequestDTO(String pnrCode, Long flightInstanceId, List<String> seatNumbers) {
        this.pnrCode = pnrCode;
        this.flightInstanceId = flightInstanceId;
        this.seatNumbers = seatNumbers;
    }

    // Getters
    public String getPnrCode() {
        return pnrCode;
    }

    public Long getFlightInstanceId() {
        return flightInstanceId;
    }

    public List<String> getSeatNumbers() {
        return seatNumbers;
    }

    // Setters
    public void setPnrCode(String pnrCode) {
        this.pnrCode = pnrCode;
    }

    public void setFlightInstanceId(Long flightInstanceId) {
        this.flightInstanceId = flightInstanceId;
    }

    public void setSeatNumbers(List<String> seatNumbers) {
        this.seatNumbers = seatNumbers;
    }
}
