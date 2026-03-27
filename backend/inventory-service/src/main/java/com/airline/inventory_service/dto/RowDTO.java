package com.airline.inventory_service.dto;

import java.util.List;

public class RowDTO {

    private Integer rowNumber;
    private Boolean isExitRow;

    private List<SeatDTO> seats;

    public RowDTO() {}

    public RowDTO(Integer rowNumber, Boolean isExitRow) {
        this.rowNumber = rowNumber;
        this.isExitRow = isExitRow;
    }

    public Integer getRowNumber() { return rowNumber; }
    public void setRowNumber(Integer rowNumber) { this.rowNumber = rowNumber; }

    public Boolean getIsExitRow() { return isExitRow; }
    public void setIsExitRow(Boolean isExitRow) { this.isExitRow = isExitRow; }

    public List<SeatDTO> getSeats() { return seats; }
    public void setSeats(List<SeatDTO> seats) { this.seats = seats; }
}