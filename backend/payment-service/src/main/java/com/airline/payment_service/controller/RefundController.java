package com.airline.payment_service.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.payment_service.entity.Refund;
import com.airline.payment_service.service.RefundService;
@RestController
@RequestMapping("/api/payments")
public class RefundController {

    private final RefundService refundService;

    public RefundController(RefundService refundService) {
        this.refundService = refundService;
    }

    @PostMapping("/{id}/refund")
    public Refund refund(@PathVariable Long id) {
        return refundService.processRefund(id);
    }

    @GetMapping("/{id}/refund-status")
    public String status(@PathVariable Long id) {
        return refundService.getStatus(id);
    }
}