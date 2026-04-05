package com.skyway.authservice.dto.response;

public record AuthTokensResponse(
        String accessToken,
        String refreshToken,
        long expiresIn
) {
}
