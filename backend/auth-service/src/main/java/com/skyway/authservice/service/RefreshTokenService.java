package com.skyway.authservice.service;

import com.skyway.authservice.entity.RefreshTokenEntity;
import com.skyway.authservice.entity.UserEntity;
import com.skyway.authservice.exception.InvalidRefreshTokenException;
import com.skyway.authservice.repository.RefreshTokenRepository;
import com.skyway.authservice.security.JwtTokenService;
import com.skyway.authservice.support.TimeProvider;
import com.skyway.authservice.support.UuidProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenService jwtTokenService;
    private final TimeProvider timeProvider;
    private final UuidProvider uuidProvider;

    @Transactional
    public String issueRefreshToken(UserEntity user, String ipAddress, String userAgent) {
        final UUID tokenId = uuidProvider.randomUuid();
        final String rawToken = jwtTokenService.generateRefreshToken(user, tokenId);

        final RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.setId(tokenId);
        entity.setUser(user);
        entity.setTokenHash(hash(rawToken));
        entity.setExpiresAt(timeProvider.now().plusMillis(jwtTokenService.getRefreshTokenExpirationMs()));
        entity.setCreatedIp(ipAddress);
        entity.setUserAgent(truncate(userAgent, 500));
        refreshTokenRepository.save(entity);

        return rawToken;
    }

    @Transactional
    public RefreshSession rotateRefreshToken(String rawRefreshToken, String ipAddress, String userAgent) {
        final JwtTokenService.RefreshTokenPayload payload = jwtTokenService.parseRefreshToken(rawRefreshToken);
        final RefreshTokenEntity existing = refreshTokenRepository.findByTokenHash(hash(rawRefreshToken))
                .orElseThrow(() -> new InvalidRefreshTokenException("Refresh token is invalid or expired"));

        if (!existing.getId().equals(payload.tokenId())
                || !existing.getUser().getId().equals(payload.userId())) {
            throw new InvalidRefreshTokenException("Refresh token is invalid or expired");
        }
        if (existing.getRevokedAt() != null) {
            throw new InvalidRefreshTokenException("Refresh token has already been revoked");
        }
        if (existing.getExpiresAt().isBefore(timeProvider.now())) {
            throw new InvalidRefreshTokenException("Refresh token is invalid or expired");
        }
        if (existing.getUser().getStatus() != UserEntity.Status.ACTIVE) {
            throw new InvalidRefreshTokenException("User account is not active");
        }

        existing.setRevokedAt(timeProvider.now());

        final UUID newTokenId = uuidProvider.randomUuid();
        final String newRawToken = jwtTokenService.generateRefreshToken(existing.getUser(), newTokenId);

        final RefreshTokenEntity replacement = new RefreshTokenEntity();
        replacement.setId(newTokenId);
        replacement.setUser(existing.getUser());
        replacement.setTokenHash(hash(newRawToken));
        replacement.setExpiresAt(timeProvider.now().plusMillis(jwtTokenService.getRefreshTokenExpirationMs()));
        replacement.setCreatedIp(ipAddress);
        replacement.setUserAgent(truncate(userAgent, 500));

        existing.setReplacedByTokenId(newTokenId);
        refreshTokenRepository.save(existing);
        refreshTokenRepository.save(replacement);

        return new RefreshSession(existing.getUser(), newRawToken);
    }

    private String hash(String token) {
        try {
            final MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException ex) {
            throw new IllegalStateException("Unable to hash refresh token", ex);
        }
    }

    private String truncate(String value, int maxLength) {
        if (value == null) {
            return null;
        }
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }

    public record RefreshSession(UserEntity user, String refreshToken) {
    }
}
