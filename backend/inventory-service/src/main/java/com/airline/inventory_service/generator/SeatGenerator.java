package com.airline.inventory_service.generator;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import org.springframework.stereotype.Component;

import com.airline.inventory_service.dto.external.AircraftDTO;
import com.airline.inventory_service.dto.external.FlightDTO;
import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.entity.SeatFeature;
import com.airline.inventory_service.entity.SeatMap;
import com.airline.inventory_service.entity.SeatRow;

@Component
public class SeatGenerator {

    public SeatMap generate(FlightDTO flight,
                            AircraftDTO aircraft,
                            String cabinClass) {

        int totalSeats = aircraft.getCabinConfig()
                .get(cabinClass.toLowerCase());

        int seatsPerRow = 6;
        List<String> columns = Arrays.asList("A", "B", "C", "D", "E", "F");

        int totalRows = totalSeats / seatsPerRow;

        int startRow = 10;

        SeatMap seatMap = new SeatMap();
        seatMap.setFlightId(flight.getFlightId());
        seatMap.setAircraftModel(aircraft.getModel());
        seatMap.setCabinClass(cabinClass);
        seatMap.setTotalRows(totalRows);
        seatMap.setSeatLayout("3-3");

        List<SeatRow> rows = new ArrayList<>();

        for (int i = 0; i < totalRows; i++) {

            int rowNum = startRow + i;

            SeatRow row = new SeatRow();
            row.setRowNum(rowNum);

            // Exit row logic
            boolean isExit = (rowNum == 12 || rowNum == 24);
            row.setIsExitRow(isExit);
            row.setSeatMap(seatMap);

            List<Seat> seats = new ArrayList<>();

            for (String col : columns) {

                String seatId = rowNum + col;

                Seat seat = new Seat();
                seat.setId(seatId);
                seat.setSeatNumber(seatId);

                seat.setRowNum(rowNum);
                seat.setColumnLetter(col);

                seat.setSeatMap(seatMap);
                seat.setSeatRow(row);

                // TYPE
                if (col.equals("A") || col.equals("F")) {
                    seat.setSeatType("WINDOW");
                } else if (col.equals("C") || col.equals("D")) {
                    seat.setSeatType("AISLE");
                } else {
                    seat.setSeatType("STANDARD");
                }

                // STATUS
                seat.setSeatStatus("AVAILABLE");

                // PRICING
                double price = 0;

                if (seat.getSeatType().equals("WINDOW")) price = 25;
                else if (seat.getSeatType().equals("AISLE")) price = 20;

                if (isExit) price = 45;

                // Premium rows (first 2 rows)
                if (rowNum <= 11) {
                    seat.setSeatType("PREMIUM");
                    price = 60;
                }

                seat.setPrice(price);
                seat.setCurrency("USD");
                
                List<SeatFeature> features = new ArrayList<>();

                if (column == 'A' || column == 'F') {
                    features.add(new SeatFeature(seat, "WINDOW"));
                }
                if (column == 'C' || column == 'D') {
                    features.add(new SeatFeature(seat, "AISLE"));
                }
                if (rowNumber == 12 || rowNumber == 24) {
                    features.add(new SeatFeature(seat, "EXIT_ROW"));
                    features.add(new SeatFeature(seat, "EXTRA_LEGROOM"));
                }

                seat.setFeatures(features);
                
                List<SeatFeature> features = new ArrayList<>();

                if (column == 'A' || column == 'F') {
                    features.add(new SeatFeature(seat, "WINDOW"));
                }
                if (column == 'C' || column == 'D') {
                    features.add(new SeatFeature(seat, "AISLE"));
                }
                if (rowNumber == 12 || rowNumber == 24) {
                    features.add(new SeatFeature(seat, "EXIT_ROW"));
                    features.add(new SeatFeature(seat, "EXTRA_LEGROOM"));
                }

                seat.setFeatures(features);

                seats.add(seat);
            }

            row.setSeats(seats);
            rows.add(row);
        }

        seatMap.setRows(rows);

        return seatMap;
    }
}