package com.airline.admin_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.admin_service.dto.request.AircraftRequestDTO;
import com.airline.admin_service.dto.response.AircraftDTO;
import com.airline.admin_service.dto.response.AircraftModelResponseDTO;
import com.airline.admin_service.entity.Aircraft;
import com.airline.admin_service.exception.ResourceNotFoundException;
import com.airline.admin_service.mapper.AircraftMapper;
import com.airline.admin_service.repository.AircraftRepository;

@Service
public class AircraftService {

    private final AircraftRepository repository;
    private final AircraftMapper mapper;
    
    public AircraftService(AircraftRepository repository, AircraftMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    public List<AircraftDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }
    
    public AircraftDTO getById(String id) {
        Aircraft entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));
        return mapper.toDTO(entity);
    }
    
    public AircraftDTO create(AircraftRequestDTO request) {

        Aircraft entity = new Aircraft();

        entity.setId(request.getId());
        entity.setRegistration(request.getRegistration());
        entity.setModel(request.getModel());
        entity.setManufacturer(request.getManufacturer());
        entity.setCapacity(request.getCapacity());
        entity.setCabinConfig(request.getCabinConfig());
        entity.setStatus(request.getStatus());
        entity.setYearBuilt(request.getYearBuilt());
        entity.setLastMaintenance(request.getLastMaintenance());
        entity.setNextMaintenance(request.getNextMaintenance());

        return mapper.toDTO(repository.save(entity));
    }
    
    public AircraftDTO update(String id, AircraftRequestDTO request) {

        Aircraft entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        entity.setRegistration(request.getRegistration());
        entity.setModel(request.getModel());
        entity.setManufacturer(request.getManufacturer());
        entity.setCapacity(request.getCapacity());
        entity.setCabinConfig(request.getCabinConfig());
        entity.setStatus(request.getStatus());
        entity.setYearBuilt(request.getYearBuilt());
        entity.setLastMaintenance(request.getLastMaintenance());
        entity.setNextMaintenance(request.getNextMaintenance());

        return mapper.toDTO(repository.save(entity));
    }
    
    public AircraftDTO patch(String id, AircraftRequestDTO request) {

        Aircraft entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aircraft not found"));

        // 🔥 ONLY UPDATE NON-NULL FIELDS

        if (request.getRegistration() != null)
            entity.setRegistration(request.getRegistration());

        if (request.getModel() != null)
            entity.setModel(request.getModel());

        if (request.getManufacturer() != null)
            entity.setManufacturer(request.getManufacturer());

        if (request.getCapacity() != null)
            entity.setCapacity(request.getCapacity());

        if (request.getCabinConfig() != null)
            entity.setCabinConfig(request.getCabinConfig());

        if (request.getStatus() != null)
            entity.setStatus(request.getStatus());

        if (request.getYearBuilt() != null)
            entity.setYearBuilt(request.getYearBuilt());

        if (request.getLastMaintenance() != null)
            entity.setLastMaintenance(request.getLastMaintenance());

        if (request.getNextMaintenance() != null)
            entity.setNextMaintenance(request.getNextMaintenance());

        return mapper.toDTO(repository.save(entity));
    }
    
    public void delete(String id) {
        repository.deleteById(id);
    }
    
    public AircraftModelResponseDTO getByModel(String model) {

        Aircraft entity = repository.findByModel(model)
                .orElseThrow(() -> new ResourceNotFoundException("Aircraft not found"));

        return mapper.toModelResponse(entity);
    }
}
