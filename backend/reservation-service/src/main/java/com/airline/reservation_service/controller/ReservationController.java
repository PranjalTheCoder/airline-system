package com.airline.reservation_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation_service.dto.request.ReservationRequestDTO;
import com.airline.reservation_service.dto.response.ReservationResponseDTO;
import com.airline.reservation_service.service.ReservationService;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    // Constructor Injection (NO Lombok)
    public ReservationController(ReservationService service) {
        this.service = service;
    }

    // 🔥 1. CREATE RESERVATION
    @PostMapping
    public ReservationResponseDTO createReservation(
            @RequestBody ReservationRequestDTO request) {

        return service.createReservation(request);
    }

    // 🔹 2. GET BASIC RESERVATION BY ID
    @GetMapping("/{id}")
    public ReservationResponseDTO getReservationById(
            @PathVariable String id) {

        return service.getReservationById(id);
    }

    // 🔥 3. GET FULL RESERVATION (MAIN API)
    @GetMapping("/full/{id}")
    public ReservationResponseDTO getFullReservation(
            @PathVariable String id) {

        return service.getFullReservation(id);
    }

    // 🔹 4. GET BY PNR
    @GetMapping("/pnr/{pnr}")
    public ReservationResponseDTO getByPnr(
            @PathVariable String pnr) {

        return service.getByPnr(pnr);
    }

    // 🔹 5. GET ALL RESERVATIONS FOR USER
    @GetMapping("/user/{userId}")
    public List<ReservationResponseDTO> getByUser(
            @PathVariable String userId) {

        return service.getByUser(userId);
    }
}