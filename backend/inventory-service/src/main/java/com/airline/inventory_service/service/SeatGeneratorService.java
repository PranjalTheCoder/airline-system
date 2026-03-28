package com.airline.inventory_service.service;


import org.springframework.stereotype.Service;

import com.airline.inventory_service.dto.AircraftDTO;
import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.entity.SeatMap;
import com.airline.inventory_service.entity.SeatRow;
import com.airline.inventory_service.repository.SeatRepository;
import com.airline.inventory_service.repository.SeatRowRepository;

@Service
public class SeatGeneratorService {

    private final SeatRowRepository rowRepo;
    private final SeatRepository seatRepo;

    // --- Manual Constructor (replaces @RequiredArgsConstructor) ---
    public SeatGeneratorService(SeatRowRepository rowRepo, SeatRepository seatRepo) {
        this.rowRepo = rowRepo;
        this.seatRepo = seatRepo;
    }

    public void generateSeats(SeatMap seatMap, AircraftDTO aircraft, String cabinClass) {

        int totalSeats = aircraft.getCabinConfig().get(cabinClass.toLowerCase());
        String layout = aircraft.getSeatLayout(); // 3-3-3

        int seatsPerRow = (int) (layout.chars()
                .filter(ch -> ch == '-')
                .count() + 1);

        seatsPerRow = layout.replace("-", "").length();

        char[] columns = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();

        int rows = totalSeats / seatsPerRow;

        int startRow = 10;

        for (int i = 0; i < rows; i++) {

            int rowNum = startRow + i;

            SeatRow row = new SeatRow();
            row.setRowNum(rowNum);
            row.setSeatMap(seatMap);
            row.setIsExitRow(rowNum == 12 || rowNum == 24);

            row = rowRepo.save(row);

            for (int j = 0; j < seatsPerRow; j++) {

                char col = columns[j];

                Seat seat = new Seat();
                seat.setSeatNumber(rowNum + String.valueOf(col));
                seat.setRowNum(rowNum);
                seat.setColumnLetter(String.valueOf(col));

                // TYPE
                if (j == 0 || j == seatsPerRow - 1)
                    seat.setSeatType("WINDOW");
                else if (j == 2 || j == seatsPerRow - 3)
                    seat.setSeatType("AISLE");
                else
                    seat.setSeatType("STANDARD");

                seat.setSeatStatus("AVAILABLE");

                seat.setSeatMap(seatMap);
                seat.setRow(row);

                seatRepo.save(seat);
            }
        }
    }
}
