package com.skyway.authservice.config;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "auth.jwt")
public record JwtProperties(
        @NotBlank String issuer,
        @Positive long accessTokenExpirationMs,
        @Positive long refreshTokenExpirationMs,
        @NotBlank String accessSecret,
        @NotBlank String refreshSecret
) {
}
