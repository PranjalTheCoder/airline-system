package com.airline.admin_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.admin_service.dto.request.AirportRequestDTO;
import com.airline.admin_service.dto.response.AirportDTO;
import com.airline.admin_service.entity.Airport;
import com.airline.admin_service.entity.Terminal;
import com.airline.admin_service.exception.ResourceNotFoundException;
import com.airline.admin_service.mapper.AirportMapper;
import com.airline.admin_service.repository.AirportRepository;
import com.airline.admin_service.repository.AirportTerminalRepository;

@Service
public class AirportService {

    private final AirportRepository airportRepo;
    private final AirportTerminalRepository terminalRepo;
    private final AirportMapper mapper;

    public AirportService(AirportRepository airportRepo,
                          AirportTerminalRepository terminalRepo,
                          AirportMapper mapper) {
        this.airportRepo = airportRepo;
        this.terminalRepo = terminalRepo;
        this.mapper = mapper;
    }

    // ✅ CREATE
    public AirportDTO create(AirportRequestDTO request) {

        Airport airport = new Airport();
        airport.setCode(request.getCode());
        airport.setName(request.getName());
        airport.setCity(request.getCity());
        airport.setCountry(request.getCountry());
        airport.setStatus(request.getStatus());
        airport.setTimezone(request.getTimezone());

        airportRepo.save(airport);

        // save terminals
        for (String t : request.getTerminals()) {
            Terminal terminal = new Terminal();
            terminal.setAirportCode(request.getCode());
            terminal.setTerminal(t);
            terminalRepo.save(terminal);
        }

        return mapper.toDTO(airport);
    }

    // ✅ GET ALL
    public List<AirportDTO> getAll() {
        return airportRepo.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    // ✅ GET BY CODE
    public AirportDTO getByCode(String code) {
    	Airport airport = airportRepo.findById(code)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found"));
        return mapper.toDTO(airport);
    }

    // ✅ UPDATE
    public AirportDTO update(String code, AirportRequestDTO request) {

    	Airport airport = airportRepo.findById(code)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found"));

        airport.setName(request.getName());
        airport.setCity(request.getCity());
        airport.setCountry(request.getCountry());
        airport.setStatus(request.getStatus());
        airport.setTimezone(request.getTimezone());

        airportRepo.save(airport);

        // delete old terminals
        terminalRepo.findByAirportCode(code)
                .forEach(terminalRepo::delete);

        // insert new terminals
        for (String t : request.getTerminals()) {
            Terminal terminal = new Terminal();
            terminal.setAirportCode(code);
            terminal.setTerminal(t);
            terminalRepo.save(terminal);
        }

        return mapper.toDTO(airport);
    }

    public AirportDTO patch(String code, AirportRequestDTO request) {

        Airport airport = airportRepo.findById(code)
                .orElseThrow(() -> new ResourceNotFoundException("Airport not found"));

        // 🔥 Partial updates
        if (request.getName() != null) {
            airport.setName(request.getName());
        }

        if (request.getCity() != null) {
            airport.setCity(request.getCity());
        }

        if (request.getCountry() != null) {
            airport.setCountry(request.getCountry());
        }

        if (request.getStatus() != null) {
            airport.setStatus(request.getStatus());
        }

        airportRepo.save(airport);

        // 🔥 terminals (special handling)
        if (request.getTerminals() != null) {

            // delete old terminals
            terminalRepo.findByAirportCode(code)
                    .forEach(terminalRepo::delete);

            // insert new terminals
            for (String t : request.getTerminals()) {
                Terminal terminal = new Terminal();
                terminal.setAirportCode(code);
                terminal.setTerminal(t);
                terminalRepo.save(terminal);
            }
        }

        if (request.getTimezone() != null) {
            airport.setTimezone(request.getTimezone());
        }

        return mapper.toDTO(airport);
    }	
    
    // ✅ DELETE
    public void delete(String code) {

        if (!airportRepo.existsById(code)) {
            throw new ResourceNotFoundException("Airport not found");
        }

        // delete terminals first
        terminalRepo.findByAirportCode(code)
                .forEach(terminalRepo::delete);

        airportRepo.deleteById(code);
    }
}