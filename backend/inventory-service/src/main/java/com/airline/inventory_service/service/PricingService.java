package com.airline.inventory_service.service;

import org.springframework.stereotype.Service;

@Service
public class PricingService {

    public double calculatePrice(String type) {

        switch (type) {
            case "WINDOW": return 25;
            case "AISLE": return 20;
            case "PREMIUM": return 60;
            default: return 0;
        }
    }
}