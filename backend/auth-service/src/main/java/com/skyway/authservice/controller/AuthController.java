package com.skyway.authservice.controller;

import com.skyway.authservice.dto.request.LoginRequest;
import com.skyway.authservice.dto.request.RefreshTokenRequest;
import com.skyway.authservice.dto.request.RegisterRequest;
import com.skyway.authservice.dto.response.AuthResponse;
import com.skyway.authservice.dto.response.AuthTokensResponse;
import com.skyway.authservice.service.AuthApplicationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthApplicationService authApplicationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpServletRequest
    ) {
        return ResponseEntity.ok(authApplicationService.login(
                request,
                extractClientIp(httpServletRequest),
                httpServletRequest.getHeader("User-Agent")
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpServletRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authApplicationService.register(
                request,
                extractClientIp(httpServletRequest),
                httpServletRequest.getHeader("User-Agent")
        ));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthTokensResponse> refresh(
            @Valid @RequestBody RefreshTokenRequest request,
            HttpServletRequest httpServletRequest
    ) {
        return ResponseEntity.ok(authApplicationService.refresh(
                request,
                extractClientIp(httpServletRequest),
                httpServletRequest.getHeader("User-Agent")
        ));
    }

    private String extractClientIp(HttpServletRequest request) {
        final String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
