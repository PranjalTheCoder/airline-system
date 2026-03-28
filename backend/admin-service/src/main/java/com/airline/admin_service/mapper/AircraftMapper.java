package com.airline.admin_service.mapper;

import java.util.Map;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.airline.admin_service.dto.response.AircraftDTO;
import com.airline.admin_service.dto.response.AircraftModelResponseDTO;
import com.airline.admin_service.dto.response.CabinConfigDTO;
import com.airline.admin_service.entity.Aircraft;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;


@Component
public class AircraftMapper {

	public AircraftModelResponseDTO toModelResponse(Aircraft entity) {

	    AircraftModelResponseDTO dto = new AircraftModelResponseDTO();
	    dto.setId(entity.getId());
	    dto.setModel(entity.getModel());

	    try {
	        Map<String, Integer> cabinMap = objectMapper.readValue(
	                entity.getCabinConfig(),
	                new TypeReference<Map<String, Integer>>() {}
	        );

	        dto.setCabinConfig(cabinMap);

	        // calculate total seats
	        int total = cabinMap.values().stream().mapToInt(Integer::intValue).sum();
	        dto.setTotalSeats(total);

	    } catch (Exception e) {
	        throw new RuntimeException("Error parsing cabin config");
	    }

	    // static for now (later dynamic)
	    dto.setSeatLayout("3-3-3");

	    return dto;
	}
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