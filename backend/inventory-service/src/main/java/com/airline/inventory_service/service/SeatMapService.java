package com.airline.inventory_service.service;

import com.airline.inventory_service.dto.SeatMapResponseDTO;

public interface SeatMapService {

    SeatMapResponseDTO getSeatMap(String flightId, String cabinClass);

}