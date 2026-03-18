package com.airline.inventory_service.service;


import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.exception.ResourceNotFoundException;
import com.airline.inventory_service.repository.SeatRepository;

@Service
public class SeatService {

    private final SeatRepository seatRepository;

    public SeatService(SeatRepository seatRepository) {
        this.seatRepository = seatRepository;
    }

    public List<Seat> getSeatsByAircraft(Long aircraftId) {
        return seatRepository.findByAircraftId(aircraftId);
    }

    public Seat getSeat(Long seatId) {
        return seatRepository.findById(seatId)
                .orElseThrow();
    }
}
