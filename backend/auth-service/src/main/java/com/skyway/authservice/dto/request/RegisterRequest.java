package com.skyway.authservice.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Email is required")
        @Email(message = "Email must be valid")
        String email,

        @NotBlank(message = "Password is required")
        @Size(min = 8, message = "Password must be at least 8 characters long")
        String password,

        @NotBlank(message = "First name is required")
        @Size(max = 100, message = "First name must be at most 100 characters long")
        String firstName,

        @NotBlank(message = "Last name is required")
        @Size(max = 100, message = "Last name must be at most 100 characters long")
        String lastName,

        @Pattern(
                regexp = "^$|^[+]?[0-9 ()-]{7,30}$",
                message = "Phone number format is invalid"
        )
        String phone
) {
}
