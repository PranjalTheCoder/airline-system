package com.airline.reservation_service.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.dto.external.FlightDTO;
import com.airline.reservation_service.dto.external.SeatDTO;
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
    private PricingDTO calculatePricing(
            ReservationRequestDTO request,
            FlightDTO flight,
            List<SeatDTO> seats) {

        int passengers = request.getPassengers().size();

        double baseFare = 580 * passengers; // OR from flight

        double seatCharges = request.getSelectedSeats().stream()
                .map(seat ->
                        seats.stream()
                                .filter(s -> s.getSeatNumber().equals(seat))
                                .findFirst()
                                .get()
                                .getPrice()
                )
                .reduce(0.0, Double::sum);

        double baggageCharges = 0;
        double serviceFee = 9.99;
        double discount = 0;

        // 🔥 MULTIPLE TAXES
        List<TaxDTO> taxes = new ArrayList<>();

        TaxDTO t1 = new TaxDTO();
        t1.setCode("YQ");
        t1.setName("Fuel surcharge");
        t1.setAmount(45);

        TaxDTO t2 = new TaxDTO();
        t2.setCode("US");
        t2.setName("US customs fee");
        t2.setAmount(18.9);

        TaxDTO t3 = new TaxDTO();
        t3.setCode("YR");
        t3.setName("Service charge");
        t3.setAmount(25);

        taxes.add(t1);
        taxes.add(t2);
        taxes.add(t3);

        double taxTotal = taxes.stream()
                .mapToDouble(TaxDTO::getAmount)
                .sum();

        double total = baseFare + seatCharges + baggageCharges + serviceFee + taxTotal - discount;

        PricingDTO dto = new PricingDTO();
        dto.setBaseFare(baseFare);
        dto.setSeatCharges(seatCharges);
        dto.setBaggageCharges(baggageCharges);
        dto.setServiceFee(serviceFee);
        dto.setDiscount(discount);
        dto.setTaxes(taxes);
        dto.setTotalAmount(total);
        dto.setCurrency("USD");

        return dto;
    }
}