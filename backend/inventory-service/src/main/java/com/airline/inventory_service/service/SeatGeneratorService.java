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

    	System.out.println("===== GENERATOR STARTED =====");
        
        
        String layout = aircraft.getSeatLayout() != null
                ? aircraft.getSeatLayout()
                : "3-3-3";

//        String[] parts = layout.split("-");
//
//        int seatsPerRow = 6;
//
//        for (String part : parts) {
//            seatsPerRow += Integer.parseInt(part);
//        }        
 
        
        

//        int seatsPerRow = (int) (layout.chars()
//                .filter(ch -> ch == '-')
//                .count() + 1);
      

//        seatsPerRow = layout.replace("-", "").length();
        int seatsPerRow = 6;
        
        System.out.println("Layout: " + layout);
        System.out.println("SeatsPerRow: " + seatsPerRow);
        
//        Integer totalSeats = aircraft.getCabinConfig().get(cabinClass.toLowerCase());

        char[] columns = {'A','B','C','D','E','F'};
        
//        if (totalSeats == null) {
//        	throw new RuntimeException("Invalid cabinClass: " + cabinClass);
//        }
//        
//        System.out.println("TotalSeats: " + totalSeats);

//        int rows = totalSeats / seatsPerRow;
        int rows = 6;
        
        System.out.println("TotalRows: " + rows);

        int startRow = 10;
        
//        System.out.println("Layout: " + layout);
//        System.out.println("Seats per row: " + seatsPerRow);
//        System.out.println("Total seats: " + totalSeats);
//        System.out.println("Total rows: " + rows);

        for (int i = 0; i < rows; i++) {

            int rowNum = startRow + i;
            System.out.println("Creating row: " + rowNum);

            SeatRow row = new SeatRow();
            row.setRowNum(rowNum);
            row.setSeatMap(seatMap);
            row.setIsExitRow(rowNum == 12 || rowNum == 24);

            row = rowRepo.save(row);
            
//            System.out.println("Saved Row: " + rowNum);

            for (int j = 0; j < seatsPerRow; j++) {

                char col = columns[j];

                Seat seat = new Seat();
                seat.setSeatNumber(rowNum + String.valueOf(col));
                seat.setRowNum(rowNum);
                seat.setColumnLetter(String.valueOf(col));

                // TYPE
                if (col == 'A' || col == 'F')
                    seat.setSeatType("WINDOW");
                else if (col == 'C' || col == 'D')
                    seat.setSeatType("AISLE");
                else
                    seat.setSeatType("STANDARD");

                seat.setSeatStatus("AVAILABLE");

                seat.setSeatMap(seatMap);
                seat.setRow(row);

                seatRepo.save(seat);
            }
        }
        System.out.println("===== GENERATOR FINISHED =====");
    }
}
