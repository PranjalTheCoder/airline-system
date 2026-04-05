package com.skyway.authservice.dto.response;

public record AuthResponse(
        UserResponse user,
        AuthTokensResponse tokens
) {
}
