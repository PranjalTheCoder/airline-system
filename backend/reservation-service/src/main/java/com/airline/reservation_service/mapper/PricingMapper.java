package com.airline.reservation_service.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.airline.reservation_service.dto.response.PricingDTO;
import com.airline.reservation_service.dto.response.TaxDTO;
import com.airline.reservation_service.entity.PricingEntity;

@Component
public class PricingMapper {

    public PricingEntity toEntity(PricingDTO dto, String reservationId) {

        PricingEntity entity = new PricingEntity();
        entity.setReservationId(reservationId);
        entity.setBaseFare(dto.getBaseFare());
        entity.setTotalAmount(dto.getTotalAmount());

        return entity;
    }

    public PricingDTO toDTO(PricingEntity entity, List<TaxDTO> taxes) {

        PricingDTO dto = new PricingDTO();
        dto.setBaseFare(entity.getBaseFare());
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setTaxes(taxes);

        return dto;
    }
}