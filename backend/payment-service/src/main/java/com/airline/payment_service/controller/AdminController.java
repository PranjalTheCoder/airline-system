
package com.airline.payment_service.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.payment_service.entity.Payment;
import com.airline.payment_service.service.PaymentService;
@RestController
@RequestMapping("/api/admin/payments")
public class AdminController {

    private final PaymentService service;

    public AdminController(PaymentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Payment> all() {
        return service.getAllPayments();
    }

    @GetMapping("/status/{status}")
    public List<Payment> byStatus(@PathVariable String status) {
        return service.getByStatus(status);
    }

    @GetMapping("/summary")
    public Map<String, Object> summary() {
        return service.getSummary();
    }
}