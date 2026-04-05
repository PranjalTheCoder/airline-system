package com.skyway.authservice.dto.response;

import java.time.Instant;
import java.time.LocalDate;

public record UserResponse(
        String id,
        String email,
        String firstName,
        String lastName,
        String role,
        String phone,
        LocalDate dateOfBirth,
        String passportNumber,
        String nationality,
        String profileImage,
        Instant createdAt
) {
}
