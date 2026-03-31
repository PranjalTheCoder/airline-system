package com.airline.reservation_service.mapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.airline.reservation_service.dto.request.PassengerRequestDTO;
import com.airline.reservation_service.dto.response.PassengerResponseDTO;
import com.airline.reservation_service.entity.PassengerEntity;

@Component
public class PassengerMapper {

    public PassengerEntity toEntity(PassengerRequestDTO dto, String reservationId, String seat) {

        PassengerEntity entity = new PassengerEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setReservationId(reservationId);

        entity.setFirstName(dto.getFirstName());
        entity.setLastName(dto.getLastName());
        entity.setSeatNumber(seat);

        return entity;
    }

    public PassengerResponseDTO toDTO(PassengerEntity entity) {

        PassengerResponseDTO dto = new PassengerResponseDTO();
        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());
        dto.setSeatNumber(entity.getSeatNumber());

        return dto;
    }
}