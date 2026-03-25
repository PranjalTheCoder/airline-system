package com.airline.payment_service.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.airline.payment_service.client.ReservationClient;
import com.airline.payment_service.dto.PnrDTO;

@Service
public class PricingService {

    private final ReservationClient reservationClient;

    public PricingService(ReservationClient reservationClient) {
        this.reservationClient = reservationClient;
    }

    public double calculateFare(String pnrCode) {
        PnrDTO pnr = reservationClient.getPNR(pnrCode);

        double base = pnr.getTotalAmount();
        double tax = base * 0.1;
        double fee = 200;

        return base + tax + fee;
    }

    public Map<String, Object> getBreakdown(String pnrCode) {

        PnrDTO pnr = reservationClient.getPNR(pnrCode);

        double base = pnr.getTotalAmount();
        double tax = base * 0.1;
        double fee = 200;

        Map<String, Object> map = new HashMap<>();
        map.put("baseFare", base);
        map.put("tax", tax);
        map.put("fee", fee);
        map.put("total", base + tax + fee);

        return map;
    }
}
