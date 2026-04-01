package com.airline.reservation_service.mapper;

import org.springframework.stereotype.Component;

import com.airline.reservation_service.dto.response.TaxDTO;
import com.airline.reservation_service.entity.TaxEntity;

@Component
public class TaxMapper {

    public TaxEntity toEntity(TaxDTO dto, Long pricingId) {

        TaxEntity entity = new TaxEntity();
        entity.setCode(dto.getCode());
        entity.setName(dto.getName());
        entity.setAmount(dto.getAmount());
        entity.setPricingId(pricingId);

        return entity;
    }

    public TaxDTO toDTO(TaxEntity entity) {

        TaxDTO dto = new TaxDTO();
        dto.setCode(entity.getCode());
        dto.setName(entity.getName());
        dto.setAmount(entity.getAmount());

        return dto;
    }
}