package com.airline.payment_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.payment_service.entity.Payment;
import com.airline.payment_service.service.PaymentService;
@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;

    public PaymentController(PaymentService paymentService) {
        this.paymentService = paymentService;
    }

    @PostMapping("/{pnr}/pay")
    public Payment pay(
            @PathVariable String pnr,
            @RequestHeader("Authorization") String token,
            @RequestHeader("Idempotency-Key") String key
    ) {
        return paymentService.processPayment(pnr, key, token);
    }

    @PostMapping("/{pnr}/retry")
    public Payment retry(
            @PathVariable String pnr,
            @RequestHeader("Authorization") String token
    ) {
        return paymentService.retryPayment(pnr, token);
    }

    @PostMapping("/{pnr}/cancel")
    public String cancel(@PathVariable String pnr) {
        paymentService.cancelPayment(pnr);
        return "Cancelled";
    }

    @GetMapping("/{id}")
    public Payment getById(@PathVariable Long id) {
        return paymentService.getById(id);
    }

    @GetMapping("/pnr/{pnr}")
    public Payment getByPnr(@PathVariable String pnr) {
        return paymentService.getByPnr(pnr);
    }

    @GetMapping("/{id}/status")
    public String status(@PathVariable Long id) {
        return paymentService.getStatus(id);
    }

    @GetMapping("/transaction/{txn}")
    public Payment txn(@PathVariable String txn) {
        return paymentService.getByTransactionId(txn);
    }
}