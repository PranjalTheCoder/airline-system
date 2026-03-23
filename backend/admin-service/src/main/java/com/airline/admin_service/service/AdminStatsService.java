package com.airline.admin_service.service;

import org.springframework.stereotype.Service;

import com.airline.admin_service.dto.response.AdminStatsDTO;
import com.airline.admin_service.entity.AdminStats;
import com.airline.admin_service.exception.ResourceNotFoundException;
import com.airline.admin_service.mapper.AdminStatsMapper;
import com.airline.admin_service.repository.AdminStatsRepository;

@Service
public class AdminStatsService {

    private final AdminStatsRepository repository;
    private final AdminStatsMapper mapper;

    public AdminStatsService(AdminStatsRepository repository, AdminStatsMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    // CREATE
    public AdminStatsDTO save(AdminStatsDTO dto) {

        AdminStats entity = new AdminStats();

        entity.setTotalFlights(dto.getTotalFlights());
        entity.setTotalAircraft(dto.getTotalAircraft());
        entity.setActiveRoutes(dto.getActiveRoutes());
        entity.setTotalPassengersToday(dto.getTotalPassengersToday());
        entity.setRevenue(dto.getRevenue());
        entity.setRevenueGrowth(dto.getRevenueGrowth());
        entity.setLoadFactor(dto.getLoadFactor());
        entity.setOnTimePerformance(dto.getOnTimePerformance());

        AdminStats saved = repository.save(entity);

        return mapper.toDTO(saved);
    }

    // READ
    public AdminStatsDTO getStats() {
    	AdminStats entity = repository.findAll()
                .stream()
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Stats not found"));

        return mapper.toDTO(entity);
    }

    // UPDATE
    public AdminStatsDTO update(Long id, AdminStatsDTO dto) {

    	AdminStats entity = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Stats not found"));

        entity.setTotalFlights(dto.getTotalFlights());
        entity.setTotalAircraft(dto.getTotalAircraft());
        entity.setActiveRoutes(dto.getActiveRoutes());
        entity.setTotalPassengersToday(dto.getTotalPassengersToday());
        entity.setRevenue(dto.getRevenue());
        entity.setRevenueGrowth(dto.getRevenueGrowth());
        entity.setLoadFactor(dto.getLoadFactor());
        entity.setOnTimePerformance(dto.getOnTimePerformance());

        AdminStats updated = repository.save(entity);

        return mapper.toDTO(updated);
    }

    // DELETE
    public void delete(Long id) {
        repository.deleteById(id);
    }
}