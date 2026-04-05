package com.skyway.authservice.mapper;

import com.skyway.authservice.dto.response.UserResponse;
import com.skyway.authservice.entity.UserEntity;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public UserResponse toResponse(UserEntity entity) {
        return new UserResponse(
                entity.getId().toString(),
                entity.getEmail(),
                entity.getFirstName(),
                entity.getLastName(),
                entity.getRole().name(),
                entity.getPhone(),
                entity.getDateOfBirth(),
                entity.getPassportNumber(),
                entity.getNationality(),
                entity.getProfileImage(),
                entity.getCreatedAt()
        );
    }
}
