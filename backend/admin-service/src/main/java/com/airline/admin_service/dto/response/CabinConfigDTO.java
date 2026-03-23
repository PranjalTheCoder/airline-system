package com.airline.admin_service.dto.response;

public class CabinConfigDTO {
    private Integer first;
    private Integer business;
    private Integer premiumEconomy;
    private Integer economy;

    // Default constructor
    public CabinConfigDTO() {}

    // Parameterized constructor
    public CabinConfigDTO(Integer first, Integer business, Integer premiumEconomy, Integer economy) {
        this.first = first;
        this.business = business;
        this.premiumEconomy = premiumEconomy;
        this.economy = economy;
    }

    // Getters and Setters
    public Integer getFirst() { return first; }
    public void setFirst(Integer first) { this.first = first; }

    public Integer getBusiness() { return business; }
    public void setBusiness(Integer business) { this.business = business; }

    public Integer getPremiumEconomy() { return premiumEconomy; }
    public void setPremiumEconomy(Integer premiumEconomy) { this.premiumEconomy = premiumEconomy; }

    public Integer getEconomy() { return economy; }
    public void setEconomy(Integer economy) { this.economy = economy; }
}
