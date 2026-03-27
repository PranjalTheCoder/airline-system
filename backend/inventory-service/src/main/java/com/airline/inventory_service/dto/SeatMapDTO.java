package com.airline.inventory_service.dto;

import java.util.List;

public class SeatMapDTO {

    private String flightId;
    private String aircraft;
    private String cabinClass;

    private List<RowDTO> rows;

    private LegendDTO legend;

    public SeatMapDTO() {}

    public SeatMapDTO(String flightId, String aircraft, String cabinClass) {
        this.flightId = flightId;
        this.aircraft = aircraft;
        this.cabinClass = cabinClass;
    }

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getAircraft() { return aircraft; }
    public void setAircraft(String aircraft) { this.aircraft = aircraft; }

    public String getCabinClass() { return cabinClass; }
    public void setCabinClass(String cabinClass) { this.cabinClass = cabinClass; }

    public List<RowDTO> getRows() { return rows; }
    public void setRows(List<RowDTO> rows) { this.rows = rows; }

    public LegendDTO getLegend() { return legend; }
    public void setLegend(LegendDTO legend) { this.legend = legend; }
}