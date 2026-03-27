package com.airline.inventory_service.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.airline.inventory_service.dto.LegendDTO;
import com.airline.inventory_service.dto.RowDTO;
import com.airline.inventory_service.dto.SeatDTO;
import com.airline.inventory_service.dto.SeatMapDTO;
import com.airline.inventory_service.dto.SeatMapResponseDTO;
import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.entity.SeatMap;
import com.airline.inventory_service.entity.SeatRow;

public class SeatMapMapper {

    // MAIN METHOD
    public static SeatMapResponseDTO toResponseDTO(SeatMap seatMap) {

        List<SeatMapDTO> seatMapDTOList = new ArrayList<>();
        seatMapDTOList.add(toSeatMapDTO(seatMap));

        return new SeatMapResponseDTO(seatMapDTOList);
    }

    // SeatMap → SeatMapDTO
    public static SeatMapDTO toSeatMapDTO(SeatMap seatMap) {

        SeatMapDTO dto = new SeatMapDTO();
        dto.setFlightId(seatMap.getFlightId());
        dto.setAircraft(seatMap.getAircraftModel());
        dto.setCabinClass(seatMap.getCabinClass());

        // Rows
        List<RowDTO> rowDTOList = seatMap.getRows()
                .stream()
                .map(SeatMapMapper::toRowDTO)
                .collect(Collectors.toList());

        dto.setRows(rowDTOList);

        // Legend (static)
        dto.setLegend(buildLegend());

        return dto;
    }

    // Row → RowDTO
    private static RowDTO toRowDTO(SeatRow row) {

        RowDTO dto = new RowDTO();
        dto.setRowNumber(row.getRowNum());
        dto.setIsExitRow(row.getIsExitRow());

        List<SeatDTO> seatDTOList = row.getSeats()
                .stream()
                .map(SeatMapMapper::toSeatDTO)
                .collect(Collectors.toList());

        dto.setSeats(seatDTOList);

        return dto;
    }

    // Seat → SeatDTO
    private static SeatDTO toSeatDTO(Seat seat) {

        SeatDTO dto = new SeatDTO();

        dto.setId(seat.getId());
        dto.setSeatNumber(seat.getSeatNumber());

        dto.setRow(seat.getRowNum());
        dto.setColumn(seat.getColumnLetter());

        dto.setStatus(seat.getSeatStatus());
        dto.setType(seat.getSeatType());

        dto.setPrice(seat.getPrice());
        dto.setCurrency(seat.getCurrency());

        // Features
        List<String> features = new ArrayList<>();

        if ("WINDOW".equals(seat.getSeatType())) {
            features.add("WINDOW");
        }
        if ("AISLE".equals(seat.getSeatType())) {
            features.add("AISLE");
        }
        if ("PREMIUM".equals(seat.getSeatType())) {
            features.add("RECLINE");
        }

        if (seat.getSeatRow() != null && Boolean.TRUE.equals(seat.getSeatRow().getIsExitRow())) {
            features.add("EXIT_ROW");
            features.add("EXTRA_LEGROOM");
        }

        dto.setFeatures(features);

        return dto;
    }

    // Legend
    private static LegendDTO buildLegend() {
        return new LegendDTO(
                "Available",
                "Occupied",
                "Selected",
                "Premium / Extra Legroom"
        );
    }
}