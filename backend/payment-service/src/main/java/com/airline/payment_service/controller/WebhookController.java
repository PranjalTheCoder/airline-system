package com.airline.payment_service.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.payment_service.service.PaymentService;
@RestController
@RequestMapping("/api/payments")
public class WebhookController {

    private final PaymentService service;

    public WebhookController(PaymentService service) {
        this.service = service;
    }

    @PostMapping("/webhook")
    public String webhook(@RequestBody String payload) {
        // process gateway callback
        return "Webhook processed";
    }

    @PostMapping("/verify")
    public String verify(@RequestBody String payload) {
        return "Verified";
    }
}