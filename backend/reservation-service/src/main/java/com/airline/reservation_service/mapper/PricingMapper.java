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
        dto.setSeatCharges(45);
        dto.setBaggageCharges(0);
        dto.setServiceFee(9.99);
        dto.setDiscount(0);
        dto.setTotalAmount(entity.getTotalAmount());
        dto.setCurrency("USD");

        dto.setTaxes(taxes);

        return dto;
    }
}