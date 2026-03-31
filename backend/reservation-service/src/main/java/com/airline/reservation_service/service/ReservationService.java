package com.airline.reservation_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.client.AdminClient;
import com.airline.reservation_service.client.FlightClient;
import com.airline.reservation_service.client.InventoryClient;
import com.airline.reservation_service.dto.request.PassengerRequestDTO;
import com.airline.reservation_service.dto.request.ReservationRequestDTO;
import com.airline.reservation_service.dto.response.PassengerResponseDTO;
import com.airline.reservation_service.dto.response.PricingDTO;
import com.airline.reservation_service.dto.response.ReservationResponseDTO;
import com.airline.reservation_service.dto.response.TaxDTO;
import com.airline.reservation_service.entity.PassengerEntity;
import com.airline.reservation_service.entity.PricingEntity;
import com.airline.reservation_service.entity.ReservationEntity;
import com.airline.reservation_service.entity.TaxEntity;
import com.airline.reservation_service.mapper.PassengerMapper;
import com.airline.reservation_service.mapper.PricingMapper;
import com.airline.reservation_service.mapper.ReservationMapper;
import com.airline.reservation_service.mapper.TaxMapper;
import com.airline.reservation_service.repository.PassengerRepository;
import com.airline.reservation_service.repository.PricingRepository;
import com.airline.reservation_service.repository.ReservationRepository;
import com.airline.reservation_service.repository.TaxRepository;

@Service
public class ReservationService {

    private final ReservationRepository reservationRepo;
    private final PassengerRepository passengerRepo;
    private final PricingRepository pricingRepo;
    private final TaxRepository taxRepo;

    private final FlightClient flightClient;
    private final InventoryClient inventoryClient;
    private final AdminClient adminClient;

    private final ReservationMapper reservationMapper;
    private final PassengerMapper passengerMapper;
    private final PricingMapper pricingMapper;
    private final TaxMapper taxMapper;

    private final PricingService pricingService;
    private final PnrService pnrService;

    public ReservationService(
            ReservationRepository reservationRepo,
            PassengerRepository passengerRepo,
            PricingRepository pricingRepo,
            TaxRepository taxRepo,
            FlightClient flightClient,
            InventoryClient inventoryClient,
            AdminClient adminClient,
            ReservationMapper reservationMapper,
            PassengerMapper passengerMapper,
            PricingMapper pricingMapper,
            TaxMapper taxMapper,
            PricingService pricingService,
            PnrService pnrService
    ) {
        this.reservationRepo = reservationRepo;
        this.passengerRepo = passengerRepo;
        this.pricingRepo = pricingRepo;
        this.taxRepo = taxRepo;
        this.flightClient = flightClient;
        this.inventoryClient = inventoryClient;
        this.adminClient = adminClient;
        this.reservationMapper = reservationMapper;
        this.passengerMapper = passengerMapper;
        this.pricingMapper = pricingMapper;
        this.taxMapper = taxMapper;
        this.pricingService = pricingService;
        this.pnrService = pnrService;
    }

    // 🔥 CREATE RESERVATION
    public ReservationResponseDTO createReservation(ReservationRequestDTO request) {

        // 1. Validate via other services
        flightClient.getFlight(request.getFlightId());
        inventoryClient.getSeatMap(request.getFlightId());
        adminClient.getAircraft("AC001");

        // 2. Generate PNR
        String pnr = pnrService.generate();

        // 3. Map Reservation
        ReservationEntity reservation = reservationMapper.toEntity(request, pnr);
        reservationRepo.save(reservation);

        // 4. Map Passengers
        List<PassengerEntity> passengerEntities = new ArrayList<>();

        for (int i = 0; i < request.getPassengers().size(); i++) {
            PassengerRequestDTO p = request.getPassengers().get(i);
            String seat = request.getSelectedSeats().get(i);

            PassengerEntity entity =
                    passengerMapper.toEntity(p, reservation.getId(), seat);

            passengerEntities.add(entity);
        }

        passengerRepo.saveAll(passengerEntities);

        // 5. Pricing
        PricingDTO pricingDTO = pricingService.calculate(request);

        PricingEntity pricingEntity =
                pricingMapper.toEntity(pricingDTO, reservation.getId());

        pricingRepo.save(pricingEntity);

        // 6. Taxes
        List<TaxEntity> taxEntities = new ArrayList<>();

        for (TaxDTO taxDTO : pricingDTO.getTaxes()) {
            taxEntities.add(
                    taxMapper.toEntity(taxDTO, pricingEntity.getId())
            );
        }

        taxRepo.saveAll(taxEntities);

        // 7. Build response
        List<PassengerResponseDTO> passengerResponses =
                passengerEntities.stream()
                        .map(passengerMapper::toDTO)
                        .toList();

        PricingDTO finalPricing =
                pricingMapper.toDTO(pricingEntity, pricingDTO.getTaxes());

        return reservationMapper.toDTO(
                reservation,
                passengerResponses,
                finalPricing
        );
    }

    // 🔹 BASIC GET
    public ReservationResponseDTO getReservationById(String id) {

        ReservationEntity entity = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Reservation not found"));

        return reservationMapper.toDTO(entity, null, null);
    }

    // 🔥 FULL API (IMPORTANT)
    public ReservationResponseDTO getFullReservation(String id) {

        // 1. Reservation
        ReservationEntity reservation = reservationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));

        // 2. Passengers
        List<PassengerEntity> passengers =
                passengerRepo.findByReservationId(id);

        // 3. Pricing
        PricingEntity pricing =
                pricingRepo.findByReservationId(id);

        // 4. Taxes
        List<TaxEntity> taxes =
                taxRepo.findByPricingId(pricing.getId());

        // 5. Map
        List<PassengerResponseDTO> passengerDTOs =
                passengers.stream()
                        .map(passengerMapper::toDTO)
                        .toList();

        List<TaxDTO> taxDTOs =
                taxes.stream()
                        .map(taxMapper::toDTO)
                        .toList();

        PricingDTO pricingDTO =
                pricingMapper.toDTO(pricing, taxDTOs);

        return reservationMapper.toDTO(
                reservation,
                passengerDTOs,
                pricingDTO
        );
    }

    public ReservationResponseDTO getByPnr(String pnr) {

        ReservationEntity entity = reservationRepo.findByPnr(pnr)
                .orElseThrow(() -> new RuntimeException("Not found"));

        return reservationMapper.toDTO(entity, null, null);
    }

    public List<ReservationResponseDTO> getByUser(String userId) {

        List<ReservationEntity> list =
                reservationRepo.findByUserId(userId);

        return list.stream()
                .map(e -> reservationMapper.toDTO(e, null, null))
                .toList();
    }
}