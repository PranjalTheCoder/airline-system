package com.airline.payment_service.service;

import org.springframework.stereotype.Service;

@Service
public class GatewayService {

    public boolean processPayment(double amount) {
        // mock gateway
        return true;
    }

    public boolean refund(double amount) {
        return true;
    }
}