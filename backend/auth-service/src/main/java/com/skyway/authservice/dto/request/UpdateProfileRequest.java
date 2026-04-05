package com.skyway.authservice.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 100, message = "First name must be at most 100 characters long")
        String firstName,

        @Size(max = 100, message = "Last name must be at most 100 characters long")
        String lastName,

        @Pattern(
                regexp = "^$|^[+]?[0-9 ()-]{7,30}$",
                message = "Phone number format is invalid"
        )
        String phone,

        String dateOfBirth,

        @Size(max = 50, message = "Passport number must be at most 50 characters long")
        String passportNumber,

        @Size(max = 100, message = "Nationality must be at most 100 characters long")
        String nationality,

        @Size(max = 500, message = "Profile image URL must be at most 500 characters long")
        String profileImage
) {
}
