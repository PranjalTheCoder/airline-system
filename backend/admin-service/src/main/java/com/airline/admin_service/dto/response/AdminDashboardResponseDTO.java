package com.airline.admin_service.dto.response;

import java.util.List;

public class AdminDashboardResponseDTO {

    private List<AircraftDTO> aircraft;
    private List<AirportDTO> airports;
    private List<CrewDTO> crews;
    private AdminStatsDTO adminStats;

    // Default constructor
    public AdminDashboardResponseDTO() {}

    // Parameterized constructor
    public AdminDashboardResponseDTO(List<AircraftDTO> aircraft,
                                     List<AirportDTO> airports,
                                     List<CrewDTO> crews,
                                     AdminStatsDTO adminStats) {
        this.aircraft = aircraft;
        this.airports = airports;
        this.crews = crews;
        this.adminStats = adminStats;
    }

    // Getters and Setters
    public List<AircraftDTO> getAircraft() {
        return aircraft;
    }
    public void setAircraft(List<AircraftDTO> aircraft) {
        this.aircraft = aircraft;
    }

    public List<AirportDTO> getAirports() {
        return airports;
    }
    public void setAirports(List<AirportDTO> airports) {
        this.airports = airports;
    }

    public List<CrewDTO> getCrews() {
        return crews;
    }
    public void setCrews(List<CrewDTO> crews) {
        this.crews = crews;
    }

    public AdminStatsDTO getAdminStats() {
        return adminStats;
    }
    public void setAdminStats(AdminStatsDTO adminStats) {
        this.adminStats = adminStats;
    }
}
