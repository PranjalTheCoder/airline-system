package com.airline.inventory_service.service;

public interface SeatLockService {

    String holdSeat(String seatId, String userId);

}