package com.skyway.authservice.support;

import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
public class UuidProvider {

    public UUID randomUuid() {
        return UUID.randomUUID();
    }
}
