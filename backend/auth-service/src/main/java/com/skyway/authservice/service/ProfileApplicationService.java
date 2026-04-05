package com.skyway.authservice.service;

import com.skyway.authservice.dto.request.UpdateProfileRequest;
import com.skyway.authservice.dto.response.UserResponse;
import com.skyway.authservice.entity.UserEntity;
import com.skyway.authservice.mapper.UserMapper;
import com.skyway.authservice.repository.UserRepository;
import com.skyway.authservice.security.AuthenticatedUser;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProfileApplicationService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    @Transactional
    public UserResponse getProfile(AuthenticatedUser authenticatedUser) {
        return userMapper.toResponse(loadUser(authenticatedUser.id()));
    }

    @Transactional
    public UserResponse updateProfile(AuthenticatedUser authenticatedUser, UpdateProfileRequest request) {
        final UserEntity user = loadUser(authenticatedUser.id());

        if (request.firstName() != null) {
            user.setFirstName(normalizeRequiredText(request.firstName(), "First name"));
        }
        if (request.lastName() != null) {
            user.setLastName(normalizeRequiredText(request.lastName(), "Last name"));
        }
        if (request.phone() != null) {
            user.setPhone(normalizeOptionalText(request.phone()));
        }
        if (request.dateOfBirth() != null) {
            user.setDateOfBirth(parseOptionalDate(request.dateOfBirth()));
        }
        if (request.passportNumber() != null) {
            user.setPassportNumber(normalizeOptionalText(request.passportNumber()));
        }
        if (request.nationality() != null) {
            user.setNationality(normalizeOptionalText(request.nationality()));
        }
        if (request.profileImage() != null) {
            user.setProfileImage(normalizeOptionalText(request.profileImage()));
        }

        return userMapper.toResponse(userRepository.save(user));
    }

    private UserEntity loadUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private String normalizeRequiredText(String value, String fieldName) {
        final String normalized = normalizeOptionalText(value);
        if (normalized == null) {
            throw new IllegalArgumentException(fieldName + " cannot be blank");
        }
        return normalized;
    }

    private String normalizeOptionalText(String value) {
        if (value == null) {
            return null;
        }

        final String normalized = value.trim();
        return normalized.isEmpty() ? null : normalized;
    }

    private LocalDate parseOptionalDate(String value) {
        final String normalized = normalizeOptionalText(value);
        if (normalized == null) {
            return null;
        }

        try {
            return LocalDate.parse(normalized);
        } catch (DateTimeException ex) {
            throw new IllegalArgumentException("Date of birth must be in yyyy-MM-dd format");
        }
    }
}
