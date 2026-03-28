package com.airline.inventory_service.mapper;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.airline.inventory_service.dto.LegendDTO;
import com.airline.inventory_service.dto.RowDTO;
import com.airline.inventory_service.dto.SeatDTO;
import com.airline.inventory_service.dto.SeatMapDTO;
import com.airline.inventory_service.dto.SeatMapResponseDTO;
import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.entity.SeatMap;
import com.airline.inventory_service.entity.SeatRow;
@Component
public class SeatMapMapper {

    public SeatMapResponseDTO map(
            SeatMap seatMap,
            List<SeatRow> rows,
            List<Seat> seats) {

        Map<Integer, List<Seat>> seatByRow =
                seats.stream().collect(Collectors.groupingBy(Seat::getRowNum));

        List<RowDTO> rowDTOList = new ArrayList<>();

        for (SeatRow row : rows) {

            RowDTO rowDTO = new RowDTO();
            rowDTO.setRowNumber(row.getRowNum());
            rowDTO.setIsExitRow(row.getIsExitRow());

            List<SeatDTO> seatDTOs = new ArrayList<>();

            for (Seat seat : seatByRow.get(row.getRowNum())) {

            	SeatDTO dto = new SeatDTO();

            	dto.setId(seat.getSeatNumber());
            	dto.setSeatNumber(seat.getSeatNumber());

            	dto.setRow(seat.getRowNum());
            	dto.setColumn(seat.getColumnLetter());

            	dto.setStatus(seat.getSeatStatus());

            	// 🔥 TYPE + PRICE + FEATURES LOGIC

            	List<String> features = new ArrayList<>();

            	boolean isWindow = seat.getColumnLetter().equals("A") || seat.getColumnLetter().equals("F");

            	if (row.getIsExitRow()) {

            	    // ✅ TYPE
            	    dto.setType("EXTRA_LEGROOM");

            	    // ✅ PRICE
            	    if (isWindow) {
            	        dto.setPrice(45.0);
            	        features.add("WINDOW");
            	    } else {
            	        dto.setPrice(40.0);
            	    }

            	    // ✅ FEATURES
            	    features.add("EXTRA_LEGROOM");
            	    features.add("EXIT_ROW");

            	} else {

            	    // NORMAL SEAT LOGIC
            	    String type = seat.getSeatType();
            	    dto.setType(type);

            	    if ("WINDOW".equals(type)) {
            	        dto.setPrice(25.0);
            	        features.add("WINDOW");
            	    } else if ("AISLE".equals(type)) {
            	        dto.setPrice(20.0);
            	    } else {
            	        dto.setPrice(0.0);
            	    }
            	}

            	dto.setCurrency("USD");
            	dto.setFeatures(features);

                seatDTOs.add(dto);
            }

            rowDTO.setSeats(seatDTOs);
            rowDTOList.add(rowDTO);
        }

        SeatMapDTO mapDTO = new SeatMapDTO();
        mapDTO.setFlightId(seatMap.getFlightId());
        mapDTO.setAircraft(seatMap.getAircraftModel());
        mapDTO.setCabinClass(seatMap.getCabinClass());
        mapDTO.setRows(rowDTOList);
        mapDTO.setLegend(new LegendDTO());

        SeatMapResponseDTO response = new SeatMapResponseDTO();
        response.setSeatMaps(List.of(mapDTO));

        return response;
    }
}