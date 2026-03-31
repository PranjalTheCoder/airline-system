package com.airline.reservation_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.dto.request.ReservationRequestDTO;
import com.airline.reservation_service.dto.response.PricingDTO;
import com.airline.reservation_service.dto.response.TaxDTO;

@Service
public class PricingService {

    public PricingDTO calculate(ReservationRequestDTO request) {

        double baseFare = 500 * request.getPassengers().size();
        double serviceFee = 50;

        double total = baseFare + serviceFee;

        PricingDTO dto = new PricingDTO();
        dto.setBaseFare(baseFare);
        dto.setServiceFee(serviceFee);
        dto.setTotalAmount(total);

        // taxes
        TaxDTO tax = new TaxDTO();
        tax.setCode("GST");
        tax.setName("Tax");
        tax.setAmount(50);

        dto.setTaxes(List.of(tax));

        return dto;
    }
}