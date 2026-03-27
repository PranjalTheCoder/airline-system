package com.airline.inventory_service.dto;

public class LegendDTO {

    private String available;
    private String occupied;
    private String selected;
    private String premium;

    public LegendDTO() {}

    public LegendDTO(String available, String occupied, String selected, String premium) {
        this.available = available;
        this.occupied = occupied;
        this.selected = selected;
        this.premium = premium;
    }

    public String getAvailable() { return available; }
    public void setAvailable(String available) { this.available = available; }

    public String getOccupied() { return occupied; }
    public void setOccupied(String occupied) { this.occupied = occupied; }

    public String getSelected() { return selected; }
    public void setSelected(String selected) { this.selected = selected; }

    public String getPremium() { return premium; }
    public void setPremium(String premium) { this.premium = premium; }
}