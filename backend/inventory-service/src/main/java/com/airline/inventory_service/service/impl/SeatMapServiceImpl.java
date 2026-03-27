package com.airline.inventory_service.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.airline.inventory_service.client.AdminClient;
import com.airline.inventory_service.client.FlightClient;
import com.airline.inventory_service.dto.SeatMapResponseDTO;
import com.airline.inventory_service.dto.external.AircraftDTO;
import com.airline.inventory_service.dto.external.FlightDTO;
import com.airline.inventory_service.entity.SeatMap;
import com.airline.inventory_service.generator.SeatGenerator;
import com.airline.inventory_service.mapper.SeatMapMapper;
import com.airline.inventory_service.repository.SeatMapRepository;
import com.airline.inventory_service.service.SeatMapService;

@Service
public class SeatMapServiceImpl implements SeatMapService {

    private final SeatMapRepository seatMapRepository;
    private final FlightClient flightClient;
    private final AdminClient adminClient;
    private final SeatGenerator seatGenerator;

    public SeatMapServiceImpl(SeatMapRepository seatMapRepository,
                             FlightClient flightClient,
                             AdminClient adminClient,
                             SeatGenerator seatGenerator) {
        this.seatMapRepository = seatMapRepository;
        this.flightClient = flightClient;
        this.adminClient = adminClient;
        this.seatGenerator = seatGenerator;
    }

    @Override
    @Transactional
    public SeatMapResponseDTO getSeatMap(String flightId, String cabinClass) {

        // 🔥 STEP 1: CHECK DB
        Optional<SeatMap> existing =
                seatMapRepository.findByFlightIdAndCabinClass(flightId, cabinClass);

        if (existing.isPresent()) {
            return SeatMapMapper.toResponseDTO(existing.get());
        }

     // 🔥 STEP 2: CALL FLIGHT SERVICE
        List<FlightDTO> flights = flightClient.getFlights();

        // 🔍 DEBUG (ADD THIS)
        for (FlightDTO f : flights) {
            System.out.println("FlightId from API = " + f.getFlightId());
        }
        
        // 🔥 STEP 2: CALL FLIGHT SERVICE
        FlightDTO flight = flights
                .stream()
                .filter(f -> flightId.equals(f.getFlightId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Flight not found"));
        

        // 🔥 STEP 3: CALL ADMIN SERVICE
        AircraftDTO aircraft = adminClient.getAircrafts()
                .stream()
                .filter(a -> a.getModel().equals(flight.getAircraftType()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        // 🔥 STEP 4: GENERATE SEAT MAP
        SeatMap seatMap = seatGenerator.generate(flight, aircraft, cabinClass);

        // 🔥 STEP 5: SAVE TO DB
        seatMapRepository.save(seatMap);

        // 🔥 STEP 6: MAP TO DTO
        return SeatMapMapper.toResponseDTO(seatMap);
    }
}