package com.airline.payment_service.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.payment_service.service.PricingService;
@RestController
@RequestMapping("/api/payments")
public class FareController {

    private final PricingService pricingService;

    public FareController(PricingService pricingService) {
        this.pricingService = pricingService;
    }

    @PostMapping("/calculate")
    public double calculate(@RequestParam String pnr) {
        return pricingService.calculateFare(pnr);
    }

    @GetMapping("/{pnr}/breakdown")
    public Map<String, Object> breakdown(@PathVariable String pnr) {
        return pricingService.getBreakdown(pnr);
    }
}