package com.airline.payment_service.controller;

import com.airline.payment_service.entity.Payment;
import com.airline.payment_service.service.PaymentService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/{pnr}")
    public Payment pay(
            @PathVariable String pnr,
            @RequestHeader("Idempotency-Key") String key
    ) {
        return service.processPayment(pnr, key);
    }
}