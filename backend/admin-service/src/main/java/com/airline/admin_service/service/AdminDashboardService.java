package com.airline.admin_service.service;
import org.springframework.stereotype.Service;

import com.airline.admin_service.dto.response.AdminDashboardResponseDTO;
import com.airline.admin_service.dto.response.AdminStatsDTO;

@Service
public class AdminDashboardService {

    private final AircraftService aircraftService;
    private final AirportService airportService;
    private final CrewService crewService;
    private final AdminStatsService adminStatsService;

    // Manual constructor instead of @RequiredArgsConstructor
    public AdminDashboardService(AircraftService aircraftService,
                                 AirportService airportService,
                                 CrewService crewService, AdminStatsService adminStatsService) {
        this.aircraftService = aircraftService;
        this.airportService = airportService;
        this.crewService = crewService;
        this.adminStatsService = adminStatsService;
    }

    public AdminDashboardResponseDTO getDashboard() {
        AdminDashboardResponseDTO response = new AdminDashboardResponseDTO();

        response.setAircraft(aircraftService.getAll());
        response.setAirports(airportService.getAll());
        response.setCrews(crewService.getAll());
        

        // TODO: implement stats service
        response.setAdminStats(adminStatsService.getStats());

        return response;
    }
}
