package com.airline_service.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.client.AdminClient;
import com.airline_service.flight_service.dto.AirportDTO;

@Service
public class AirportService {

    private final AdminClient adminClient;

    public AirportService(AdminClient adminClient) {
        this.adminClient = adminClient;
    }

    public List<AirportDTO> getAllAirports() {
        return adminClient.getAllAirports();
    }
}