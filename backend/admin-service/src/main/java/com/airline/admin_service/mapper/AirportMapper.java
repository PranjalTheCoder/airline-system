package com.airline.admin_service.mapper;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.airline.admin_service.dto.response.AirportDTO;
import com.airline.admin_service.entity.Airport;
import com.airline.admin_service.entity.Terminal;
import com.airline.admin_service.repository.AirportTerminalRepository;

@Component
public class AirportMapper {

    private final AirportTerminalRepository terminalRepo;

    // Manual constructor instead of @RequiredArgsConstructor
    public AirportMapper(AirportTerminalRepository terminalRepo) {
        this.terminalRepo = terminalRepo;
    }

    public AirportDTO toDTO(Airport entity) {
        AirportDTO dto = new AirportDTO();
        BeanUtils.copyProperties(entity, dto);

        List<String> terminals = terminalRepo.findByAirportCode(entity.getCode())
                .stream()
                .map(Terminal::getTerminal)
                .toList();

        dto.setTerminals(terminals);

        return dto;
    }
}
