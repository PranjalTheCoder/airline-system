package com.airline.reservation_service.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

@Service
public class PnrService {

    public String generate() {
        return "PNR" + UUID.randomUUID().toString().substring(0, 6);
    }
}
