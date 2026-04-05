package com.skyway.authservice.controller;

import com.skyway.authservice.dto.request.UpdateProfileRequest;
import com.skyway.authservice.dto.response.UserResponse;
import com.skyway.authservice.security.AuthenticatedUser;
import com.skyway.authservice.service.ProfileApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileApplicationService profileApplicationService;

    @GetMapping
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal AuthenticatedUser authenticatedUser) {
        return ResponseEntity.ok(profileApplicationService.getProfile(authenticatedUser));
    }

    @PutMapping
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal AuthenticatedUser authenticatedUser,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(profileApplicationService.updateProfile(authenticatedUser, request));
    }
}
