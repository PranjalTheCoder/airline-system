package com.airline.inventory_service.dto;

import java.util.List;

public class SeatMapResponseDTO {

    private List<SeatMapDTO> seatMaps;

    public SeatMapResponseDTO() {}

    public SeatMapResponseDTO(List<SeatMapDTO> seatMaps) {
        this.seatMaps = seatMaps;
    }

    public List<SeatMapDTO> getSeatMaps() {
        return seatMaps;
    }

    public void setSeatMaps(List<SeatMapDTO> seatMaps) {
        this.seatMaps = seatMaps;
    }
}