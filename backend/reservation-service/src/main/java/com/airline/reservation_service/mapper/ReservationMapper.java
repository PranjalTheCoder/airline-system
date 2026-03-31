package com.airline.reservation_service.mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Component;

import com.airline.reservation_service.dto.request.ReservationRequestDTO;
import com.airline.reservation_service.dto.response.PassengerResponseDTO;
import com.airline.reservation_service.dto.response.PricingDTO;
import com.airline.reservation_service.dto.response.ReservationResponseDTO;
import com.airline.reservation_service.entity.ReservationEntity;

@Component
public class ReservationMapper {

    public ReservationEntity toEntity(ReservationRequestDTO dto, String pnr) {

        ReservationEntity entity = new ReservationEntity();
        entity.setId(UUID.randomUUID().toString());
        entity.setPnr(pnr);

        entity.setUserId(dto.getUserId());
        entity.setFlightId(dto.getFlightId());
        entity.setCabinClass(dto.getCabinClass());

        entity.setContactEmail(dto.getContactEmail());
        entity.setContactPhone(dto.getContactPhone());

        entity.setStatus("CONFIRMED");
        entity.setCreatedAt(LocalDateTime.now());
        entity.setExpiresAt(LocalDateTime.now().plusHours(24));

        return entity;
    }

    public ReservationResponseDTO toDTO(
            ReservationEntity entity,
            List<PassengerResponseDTO> passengers,
            PricingDTO pricing) {

        ReservationResponseDTO dto = new ReservationResponseDTO();

        dto.setId(entity.getId());
        dto.setPnr(entity.getPnr());
        dto.setStatus(entity.getStatus());

        dto.setUserId(entity.getUserId());
        dto.setOutboundFlightId(entity.getFlightId());
        dto.setCabinClass(entity.getCabinClass());

        dto.setContactEmail(entity.getContactEmail());
        dto.setContactPhone(entity.getContactPhone());

        dto.setCreatedAt(entity.getCreatedAt());
        dto.setExpiresAt(entity.getExpiresAt());

        dto.setPassengers(passengers);
        dto.setPricing(pricing);

        return dto;
    }
}