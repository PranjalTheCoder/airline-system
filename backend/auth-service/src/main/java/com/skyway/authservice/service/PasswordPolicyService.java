package com.skyway.authservice.service;

import org.springframework.stereotype.Service;

@Service
public class PasswordPolicyService {

    public void validate(String password) {
        if (password == null || password.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long");
        }
    }
}
