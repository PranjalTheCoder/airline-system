package com.skyway.authservice.security;

import com.skyway.authservice.config.JwtProperties;
import com.skyway.authservice.entity.UserEntity;
import com.skyway.authservice.exception.InvalidRefreshTokenException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.UUID;

@Service
public class JwtTokenService {

    public static final String TOKEN_TYPE_CLAIM = "token_type";
    public static final String ROLE_CLAIM = "role";
    public static final String EMAIL_CLAIM = "email";

    private final JwtProperties jwtProperties;
    private final SecretKey accessKey;
    private final SecretKey refreshKey;

    public JwtTokenService(JwtProperties jwtProperties) {
        this.jwtProperties = jwtProperties;
        this.accessKey = Keys.hmacShaKeyFor(jwtProperties.accessSecret().getBytes(StandardCharsets.UTF_8));
        this.refreshKey = Keys.hmacShaKeyFor(jwtProperties.refreshSecret().getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(UserEntity user) {
        final Instant now = Instant.now();
        final Instant expiry = now.plusMillis(jwtProperties.accessTokenExpirationMs());
        return Jwts.builder()
                .issuer(jwtProperties.issuer())
                .subject(user.getId().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claim(TOKEN_TYPE_CLAIM, "access")
                .claim(EMAIL_CLAIM, user.getEmail())
                .claim(ROLE_CLAIM, user.getRole().name())
                .id(UUID.randomUUID().toString())
                .signWith(accessKey)
                .compact();
    }

    public String generateRefreshToken(UserEntity user, UUID tokenId) {
        final Instant now = Instant.now();
        final Instant expiry = now.plusMillis(jwtProperties.refreshTokenExpirationMs());
        return Jwts.builder()
                .issuer(jwtProperties.issuer())
                .subject(user.getId().toString())
                .issuedAt(Date.from(now))
                .expiration(Date.from(expiry))
                .claim(TOKEN_TYPE_CLAIM, "refresh")
                .claim(EMAIL_CLAIM, user.getEmail())
                .claim(ROLE_CLAIM, user.getRole().name())
                .id(tokenId.toString())
                .signWith(refreshKey)
                .compact();
    }

    public AuthenticatedUser parseAccessToken(String token) {
        final Claims claims = parse(token, accessKey).getPayload();
        ensureTokenType(claims, "access");
        return new AuthenticatedUser(
                UUID.fromString(claims.getSubject()),
                claims.get(EMAIL_CLAIM, String.class),
                claims.get(ROLE_CLAIM, String.class)
        );
    }

    public RefreshTokenPayload parseRefreshToken(String token) {
        try {
            final Claims claims = parse(token, refreshKey).getPayload();
            ensureTokenType(claims, "refresh");
            return new RefreshTokenPayload(
                    UUID.fromString(claims.getSubject()),
                    UUID.fromString(claims.getId()),
                    claims.get(EMAIL_CLAIM, String.class),
                    claims.get(ROLE_CLAIM, String.class)
            );
        } catch (IllegalArgumentException | JwtException ex) {
            throw new InvalidRefreshTokenException("Refresh token is invalid or expired");
        }
    }

    public long getAccessTokenExpiresInSeconds() {
        return jwtProperties.accessTokenExpirationMs() / 1000;
    }

    public long getRefreshTokenExpirationMs() {
        return jwtProperties.refreshTokenExpirationMs();
    }

    private Jws<Claims> parse(String token, SecretKey key) {
        return Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token);
    }

    private void ensureTokenType(Claims claims, String expectedType) {
        final String actualType = claims.get(TOKEN_TYPE_CLAIM, String.class);
        if (!expectedType.equals(actualType)) {
            throw new JwtException("Token type mismatch");
        }
    }

    public record RefreshTokenPayload(
            UUID userId,
            UUID tokenId,
            String email,
            String role
    ) {
    }
}
