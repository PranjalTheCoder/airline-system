package com.airline.admin_service.mapper;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.airline.admin_service.dto.response.AircraftDTO;
import com.airline.admin_service.dto.response.CabinConfigDTO;
import com.airline.admin_service.entity.Aircraft;
import com.fasterxml.jackson.databind.ObjectMapper;
@Component
public class AircraftMapper {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public AircraftDTO toDTO(Aircraft entity) {

        AircraftDTO dto = new AircraftDTO();

        BeanUtils.copyProperties(entity, dto);

        try {
            CabinConfigDTO cabin = objectMapper.readValue(
                entity.getCabinConfig(),
                CabinConfigDTO.class
            );
            dto.setCabinConfig(cabin);
        } catch (Exception e) {
            throw new RuntimeException("Error parsing cabin config");
        }

        return dto;
    }
}