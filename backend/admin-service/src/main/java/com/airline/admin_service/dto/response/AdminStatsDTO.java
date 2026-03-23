package com.airline.admin_service.dto.response;

public class AdminStatsDTO {

    private Integer totalFlights;
    private Integer totalAircraft;
    private Integer activeRoutes;
    private Integer totalPassengersToday;
    private Long revenue;
    private Double revenueGrowth;
    private Double loadFactor;
    private Double onTimePerformance;

    // Default constructor
    public AdminStatsDTO() {
    }

    // Parameterized constructor
    public AdminStatsDTO(Integer totalFlights, Integer totalAircraft, Integer activeRoutes,
                         Integer totalPassengersToday, Long revenue, Double revenueGrowth,
                         Double loadFactor, Double onTimePerformance) {
        this.totalFlights = totalFlights;
        this.totalAircraft = totalAircraft;
        this.activeRoutes = activeRoutes;
        this.totalPassengersToday = totalPassengersToday;
        this.revenue = revenue;
        this.revenueGrowth = revenueGrowth;
        this.loadFactor = loadFactor;
        this.onTimePerformance = onTimePerformance;
    }

    // Getters and Setters
    public Integer getTotalFlights() {
        return totalFlights;
    }

    public void setTotalFlights(Integer totalFlights) {
        this.totalFlights = totalFlights;
    }

    public Integer getTotalAircraft() {
        return totalAircraft;
    }

    public void setTotalAircraft(Integer totalAircraft) {
        this.totalAircraft = totalAircraft;
    }

    public Integer getActiveRoutes() {
        return activeRoutes;
    }

    public void setActiveRoutes(Integer activeRoutes) {
        this.activeRoutes = activeRoutes;
    }

    public Integer getTotalPassengersToday() {
        return totalPassengersToday;
    }

    public void setTotalPassengersToday(Integer totalPassengersToday) {
        this.totalPassengersToday = totalPassengersToday;
    }

    public Long getRevenue() {
        return revenue;
    }

    public void setRevenue(Long revenue) {
        this.revenue = revenue;
    }

    public Double getRevenueGrowth() {
        return revenueGrowth;
    }

    public void setRevenueGrowth(Double revenueGrowth) {
        this.revenueGrowth = revenueGrowth;
    }

    public Double getLoadFactor() {
        return loadFactor;
    }

    public void setLoadFactor(Double loadFactor) {
        this.loadFactor = loadFactor;
    }

    public Double getOnTimePerformance() {
        return onTimePerformance;
    }

    public void setOnTimePerformance(Double onTimePerformance) {
        this.onTimePerformance = onTimePerformance;
    }
}
