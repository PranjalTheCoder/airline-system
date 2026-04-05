package com.skyway.authservice.service;

import com.skyway.authservice.dto.request.LoginRequest;
import com.skyway.authservice.dto.request.RefreshTokenRequest;
import com.skyway.authservice.dto.request.RegisterRequest;
import com.skyway.authservice.dto.response.AuthResponse;
import com.skyway.authservice.dto.response.AuthTokensResponse;
import com.skyway.authservice.entity.AuthAuditLogEntity;
import com.skyway.authservice.entity.UserEntity;
import com.skyway.authservice.exception.EmailAlreadyExistsException;
import com.skyway.authservice.exception.InvalidCredentialsException;
import com.skyway.authservice.mapper.UserMapper;
import com.skyway.authservice.repository.AuthAuditLogRepository;
import com.skyway.authservice.repository.UserRepository;
import com.skyway.authservice.security.JwtTokenService;
import com.skyway.authservice.support.TimeProvider;
import com.skyway.authservice.support.UuidProvider;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthApplicationService {

    private final UserRepository userRepository;
    private final AuthAuditLogRepository authAuditLogRepository;
    private final PasswordPolicyService passwordPolicyService;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final RefreshTokenService refreshTokenService;
    private final UserMapper userMapper;
    private final UuidProvider uuidProvider;
    private final TimeProvider timeProvider;

    @Transactional
    public AuthResponse register(RegisterRequest request, String ipAddress, String userAgent) {
        final String normalizedEmail = request.email().trim().toLowerCase();
        if (userRepository.existsByEmailIgnoreCase(normalizedEmail)) {
            audit(null, normalizedEmail, "REGISTER_FAILED_EMAIL_EXISTS", ipAddress, userAgent);
            throw new EmailAlreadyExistsException("Email already registered");
        }

        passwordPolicyService.validate(request.password());

        final UserEntity user = new UserEntity();
        user.setId(uuidProvider.randomUuid());
        user.setEmail(normalizedEmail);
        user.setPasswordHash(passwordEncoder.encode(request.password()));
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setPhone(blankToNull(request.phone()));
        user.setRole(UserEntity.Role.PASSENGER);
        user.setStatus(UserEntity.Status.ACTIVE);
        user.setEmailVerified(false);

        final UserEntity savedUser = userRepository.save(user);
        final String accessToken = jwtTokenService.generateAccessToken(savedUser);
        final String refreshToken = refreshTokenService.issueRefreshToken(savedUser, ipAddress, userAgent);

        audit(savedUser, normalizedEmail, "REGISTER_SUCCESS", ipAddress, userAgent);

        return new AuthResponse(
                userMapper.toResponse(savedUser),
                new AuthTokensResponse(
                        accessToken,
                        refreshToken,
                        jwtTokenService.getAccessTokenExpiresInSeconds()
                )
        );
    }

    @Transactional
    public AuthResponse login(LoginRequest request, String ipAddress, String userAgent) {
        final String normalizedEmail = request.email().trim().toLowerCase();
        final UserEntity user = userRepository.findByEmailIgnoreCase(normalizedEmail)
                .orElseThrow(() -> {
                    audit(null, normalizedEmail, "LOGIN_FAILED_INVALID_CREDENTIALS", ipAddress, userAgent);
                    return new InvalidCredentialsException("Invalid email or password");
                });

        if (user.getStatus() != UserEntity.Status.ACTIVE) {
            audit(user, normalizedEmail, "LOGIN_FAILED_INACTIVE_ACCOUNT", ipAddress, userAgent);
            throw new InvalidCredentialsException("Account is not active");
        }
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            audit(user, normalizedEmail, "LOGIN_FAILED_INVALID_CREDENTIALS", ipAddress, userAgent);
            throw new InvalidCredentialsException("Invalid email or password");
        }

        user.setLastLoginAt(timeProvider.now());
        final UserEntity savedUser = userRepository.save(user);
        final String accessToken = jwtTokenService.generateAccessToken(savedUser);
        final String refreshToken = refreshTokenService.issueRefreshToken(savedUser, ipAddress, userAgent);

        audit(savedUser, normalizedEmail, "LOGIN_SUCCESS", ipAddress, userAgent);

        return new AuthResponse(
                userMapper.toResponse(savedUser),
                new AuthTokensResponse(
                        accessToken,
                        refreshToken,
                        jwtTokenService.getAccessTokenExpiresInSeconds()
                )
        );
    }

    @Transactional
    public AuthTokensResponse refresh(RefreshTokenRequest request, String ipAddress, String userAgent) {
        final RefreshTokenService.RefreshSession refreshSession =
                refreshTokenService.rotateRefreshToken(request.refreshToken(), ipAddress, userAgent);

        audit(refreshSession.user(), refreshSession.user().getEmail(), "TOKEN_REFRESH_SUCCESS", ipAddress, userAgent);

        return new AuthTokensResponse(
                jwtTokenService.generateAccessToken(refreshSession.user()),
                refreshSession.refreshToken(),
                jwtTokenService.getAccessTokenExpiresInSeconds()
        );
    }

    private void audit(
            UserEntity user,
            String email,
            String eventType,
            String ipAddress,
            String userAgent
    ) {
        final AuthAuditLogEntity log = new AuthAuditLogEntity();
        log.setId(uuidProvider.randomUuid());
        log.setUser(user);
        log.setEmail(email);
        log.setEventType(eventType);
        log.setIpAddress(ipAddress);
        log.setUserAgent(truncate(userAgent, 500));
        log.setMetadata("{}");
        log.setCreatedAt(timeProvider.now());
        authAuditLogRepository.save(log);
    }

    private String blankToNull(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        return value.trim();
    }

    private String truncate(String value, int maxLength) {
        if (value == null) {
            return null;
        }
        return value.length() <= maxLength ? value : value.substring(0, maxLength);
    }
}
