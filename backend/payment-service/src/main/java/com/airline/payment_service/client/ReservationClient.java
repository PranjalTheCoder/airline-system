package com.airline.payment_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import com.airline.payment_service.dto.PnrDTO;

@FeignClient(
        name = "reservation-service",
        url = "${services.reservation}"
)
public interface ReservationClient {

    @GetMapping("/api/reservations/{pnr}")
    PnrDTO getPNR(@PathVariable("pnr") String pnrCode);

    @PostMapping("/api/reservations/{pnr}/confirm")
    void confirmBooking(@PathVariable("pnr") String pnrCode);

    @PostMapping("/api/reservations/{pnr}/cancel")
    void cancelBooking(@PathVariable("pnr") String pnrCode);
}