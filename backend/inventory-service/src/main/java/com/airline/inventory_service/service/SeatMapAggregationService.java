package com.airline.inventory_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.airline.inventory_service.client.AdminClient;
import com.airline.inventory_service.client.FlightClient;
import com.airline.inventory_service.dto.AircraftDTO;
import com.airline.inventory_service.dto.FlightDTO;
import com.airline.inventory_service.dto.SeatMapResponseDTO;
import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.entity.SeatMap;
import com.airline.inventory_service.entity.SeatRow;
import com.airline.inventory_service.mapper.SeatMapMapper;
import com.airline.inventory_service.repository.SeatMapRepository;
import com.airline.inventory_service.repository.SeatRepository;
import com.airline.inventory_service.repository.SeatRowRepository;

@Service
public class SeatMapAggregationService {

	private final SeatMapRepository seatMapRepo;
    private final SeatRepository seatRepo;
    private final SeatRowRepository rowRepo;

    private final FlightClient flightClient;
    private final AdminClient adminClient;

    private final SeatGeneratorService generator;
    private final PricingService pricing;
    private final SeatMapMapper mapper;

    public SeatMapAggregationService(
            SeatMapRepository seatMapRepo,
            SeatRepository seatRepo,
            SeatRowRepository rowRepo,
            FlightClient flightClient,
            AdminClient adminClient,
            SeatGeneratorService generator,
            PricingService pricing,
            SeatMapMapper mapper
    ) {
        this.seatMapRepo = seatMapRepo;
        this.seatRepo = seatRepo;
        this.rowRepo = rowRepo;
        this.flightClient = flightClient;
        this.adminClient = adminClient;
        this.generator = generator;
        this.pricing = pricing;
        this.mapper = mapper;
    }

    public SeatMapResponseDTO getSeatMap(String flightId, String cabinClass) {

        Optional<SeatMap> existing =
                seatMapRepo.findByFlightIdAndCabinClass(flightId, cabinClass);

        SeatMap seatMap;

        if (existing.isPresent()) {
            seatMap = existing.get();

            List<Seat> seats = seatRepo.findBySeatMap_Id(seatMap.getId());

            // 🔥 IMPORTANT FIX
            if (seats.isEmpty()) {
                System.out.println("⚠️ Empty seat map found → regenerating");

                FlightDTO flight = flightClient.getFlight(flightId);
                AircraftDTO aircraft = adminClient.getAircraft(flight.getAircraftId());

                generator.generateSeats(seatMap, aircraft, cabinClass);
            }

        } else {

            FlightDTO flight = flightClient.getFlight(flightId);
            AircraftDTO aircraft = adminClient.getAircraft(flight.getAircraftId());

            seatMap = new SeatMap();
            seatMap.setFlightId(flightId);
            seatMap.setAircraftModel(aircraft.getModel());
            seatMap.setCabinClass(cabinClass);

            seatMap = seatMapRepo.save(seatMap);

            generator.generateSeats(seatMap, aircraft, cabinClass);
        }

        List<Seat> seats = seatRepo.findBySeatMap_Id(seatMap.getId());
        List<SeatRow> rows = rowRepo.findBySeatMap_Id(seatMap.getId());
        System.out.println("Rows count: " + rows.size());
        System.out.println("Seats count: " + seats.size());

        // APPLY PRICING
        seats.forEach(s -> s.setPrice(pricing.calculatePrice(s.getSeatType())));

        return mapper.map(seatMap, rows, seats);
    }
}
