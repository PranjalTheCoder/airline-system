package com.skyway.authservice.support;

import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;

@Component
public class TimeProvider {

    public Instant now() {
        return Instant.now();
    }

    public LocalDate todayUtc() {
        return LocalDate.now(ZoneOffset.UTC);
    }
}
