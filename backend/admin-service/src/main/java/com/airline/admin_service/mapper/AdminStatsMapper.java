package com.airline.admin_service.mapper;

import org.springframework.stereotype.Component;

import com.airline.admin_service.dto.response.AdminStatsDTO;
import com.airline.admin_service.entity.AdminStats;

@Component
public class AdminStatsMapper {

    public AdminStatsDTO toDTO(AdminStats entity) {

        AdminStatsDTO dto = new AdminStatsDTO();

        dto.setTotalFlights(entity.getTotalFlights());
        dto.setTotalAircraft(entity.getTotalAircraft());
        dto.setActiveRoutes(entity.getActiveRoutes());
        dto.setTotalPassengersToday(entity.getTotalPassengersToday());
        dto.setRevenue(entity.getRevenue());
        dto.setRevenueGrowth(entity.getRevenueGrowth());
        dto.setLoadFactor(entity.getLoadFactor());
        dto.setOnTimePerformance(entity.getOnTimePerformance());

        return dto;
    }
}