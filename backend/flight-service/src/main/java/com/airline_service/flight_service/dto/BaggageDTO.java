package com.airline_service.flight_service.dto;


public class BaggageDTO {

    private String cabin;
    private String checked;

    public BaggageDTO() {}

    public BaggageDTO(String cabin, String checked) {
        this.cabin = cabin;
        this.checked = checked;
    }

    public String getCabin() {
        return cabin;
    }

    public void setCabin(String cabin) {
        this.cabin = cabin;
    }

    public String getChecked() {
        return checked;
    }

    public void setChecked(String checked) {
        this.checked = checked;
    }
}