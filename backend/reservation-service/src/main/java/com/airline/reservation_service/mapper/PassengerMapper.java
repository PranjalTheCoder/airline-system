package com.airline.reservation_service.mapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import com.airline.reservation_service.dto.request.PassengerRequestDTO;
import com.airline.reservation_service.dto.response.PassengerResponseDTO;
import com.airline.reservation_service.entity.PassengerEntity;

@Component
public class PassengerMapper {

	public PassengerEntity toEntity(
	        PassengerRequestDTO dto,
	        String reservationId,
	        String seatNumber) {

	    PassengerEntity entity = new PassengerEntity();

	    entity.setId(UUID.randomUUID().toString());
	    entity.setReservationId(reservationId);

	    entity.setType(dto.getType());
	    entity.setTitle(dto.getTitle());

	    entity.setFirstName(dto.getFirstName());
	    entity.setLastName(dto.getLastName());

	    entity.setDateOfBirth(dto.getDateOfBirth());
	    entity.setGender(dto.getGender());
	    entity.setNationality(dto.getNationality());

	    entity.setPassportNumber(dto.getPassportNumber());
	    entity.setPassportExpiry(dto.getPassportExpiry());

	    entity.setMealPreference(dto.getMealPreference());

	    entity.setSeatNumber(seatNumber);

	    return entity;
	}

    public PassengerResponseDTO toDTO(PassengerEntity entity) {

        PassengerResponseDTO dto = new PassengerResponseDTO();

        dto.setId(entity.getId());
        dto.setFirstName(entity.getFirstName());
        dto.setLastName(entity.getLastName());

        dto.setType(entity.getType());
        dto.setTitle(entity.getTitle());

        dto.setSelectedSeatNumber(entity.getSeatNumber());

        // Optional fields (if stored)
        dto.setGender(entity.getGender());
        dto.setNationality(entity.getNationality());

        return dto;
    }
    
}