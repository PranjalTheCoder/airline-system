package com.airline.admin_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.admin_service.dto.request.CrewRequestDTO;
import com.airline.admin_service.dto.response.CrewDTO;
import com.airline.admin_service.entity.Crew;
import com.airline.admin_service.entity.Rating;
import com.airline.admin_service.exception.ResourceNotFoundException;
import com.airline.admin_service.mapper.CrewMapper;
import com.airline.admin_service.repository.CrewRatingRepository;
import com.airline.admin_service.repository.CrewRepository;

@Service
public class CrewService {

    private final CrewRepository crewRepo;
    private final CrewRatingRepository ratingRepo;
    private final CrewMapper mapper;

    public CrewService(CrewRepository crewRepo,
                       CrewRatingRepository ratingRepo,
                       CrewMapper mapper) {
        this.crewRepo = crewRepo;
        this.ratingRepo = ratingRepo;
        this.mapper = mapper;
    }

    // ✅ CREATE
    public CrewDTO create(CrewRequestDTO request) {

    	Crew entity = new Crew();
        entity.setId(request.getId());
        entity.setEmployeeId(request.getEmployeeId());
        entity.setFirstName(request.getFirstName());
        entity.setLastName(request.getLastName());
        entity.setRole(request.getRole());
        entity.setLicense(request.getLicense());
        entity.setBase(request.getBase());
        entity.setStatus(request.getStatus());
        entity.setFlightHoursMonth(request.getFlightHoursMonth());
        entity.setFlightHoursMax(request.getFlightHoursMax());

        crewRepo.save(entity);

        // 🔥 Save ratings
        if (request.getRating() != null) {
            for (String r : request.getRating()) {
                Rating rating = new Rating();
                rating.setCrewId(entity.getId());
                rating.setAircraftType(r);
                ratingRepo.save(rating);
            }
        }

        return mapper.toDTO(entity);
    }

    // ✅ GET ALL
    public List<CrewDTO> getAll() {
        return crewRepo.findAll()
                .stream()
                .map(mapper::toDTO)
                .toList();
    }

    // ✅ GET BY ID
    public CrewDTO getById(String id) {
    	Crew entity = crewRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crew not found"));

        return mapper.toDTO(entity);
    }

    // ✅ UPDATE (PUT → FULL REPLACE)
    public CrewDTO update(String id, CrewRequestDTO request) {

    	Crew entity = crewRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crew not found"));

        entity.setEmployeeId(request.getEmployeeId());
        entity.setFirstName(request.getFirstName());
        entity.setLastName(request.getLastName());
        entity.setRole(request.getRole());
        entity.setLicense(request.getLicense());
        entity.setBase(request.getBase());
        entity.setStatus(request.getStatus());
        entity.setFlightHoursMonth(request.getFlightHoursMonth());
        entity.setFlightHoursMax(request.getFlightHoursMax());

        crewRepo.save(entity);

        // 🔥 Replace ratings
        ratingRepo.deleteAll(ratingRepo.findByCrewId(id));

        if (request.getRating() != null) {
            for (String r : request.getRating()) {
            	Rating rating = new Rating();
                rating.setCrewId(id);
                rating.setAircraftType(r);
                ratingRepo.save(rating);
            }
        }

        return mapper.toDTO(entity);
    }

    // ✅ PATCH (PARTIAL UPDATE)
    public CrewDTO patch(String id, CrewRequestDTO request) {

    	Crew entity = crewRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crew not found"));

        if (request.getStatus() != null)
            entity.setStatus(request.getStatus());

        if (request.getBase() != null)
            entity.setBase(request.getBase());

        crewRepo.save(entity);

        return mapper.toDTO(entity);
    }

    // ✅ DELETE
    public void delete(String id) {

        Crew entity = crewRepo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Crew not found"));

        ratingRepo.deleteAll(ratingRepo.findByCrewId(id));
        crewRepo.delete(entity);
    }
}