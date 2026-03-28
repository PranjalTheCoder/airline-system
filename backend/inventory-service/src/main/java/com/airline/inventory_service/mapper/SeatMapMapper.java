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
                dto.setType(seat.getSeatType());
                dto.setPrice(seat.getPrice());
                dto.setCurrency("USD");

                // FEATURES
                List<String> features = new ArrayList<>();

                if ("WINDOW".equals(seat.getSeatType()))
                    features.add("WINDOW");

                if (row.getIsExitRow())
                    features.add("EXTRA_LEGROOM");

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