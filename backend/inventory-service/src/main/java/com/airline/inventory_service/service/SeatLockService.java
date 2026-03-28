package com.airline.inventory_service.service;

import org.springframework.stereotype.Service;

@Service
public class SeatLockService {

    public String holdSeat(String seatId) {
        return "Seat locked: " + seatId;
    }

    public String releaseSeat(String seatId) {
        return "Seat released: " + seatId;
    }
}