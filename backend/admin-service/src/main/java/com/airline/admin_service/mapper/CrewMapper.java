package com.airline.admin_service.mapper;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Component;

import com.airline.admin_service.dto.response.CrewDTO;
import com.airline.admin_service.entity.Crew;
import com.airline.admin_service.entity.Rating;
import com.airline.admin_service.repository.CrewRatingRepository;

@Component
public class CrewMapper {

    private final CrewRatingRepository ratingRepo;

    // Manual constructor instead of @RequiredArgsConstructor
    public CrewMapper(CrewRatingRepository ratingRepo) {
        this.ratingRepo = ratingRepo;
    }

    public CrewDTO toDTO(Crew entity) {
        CrewDTO dto = new CrewDTO();
        BeanUtils.copyProperties(entity, dto);

        List<String> ratings = ratingRepo.findByCrewId(entity.getId())
                .stream()
                .map(Rating::getAircraftType)
                .toList();

        dto.setRating(ratings);

        return dto;
    }
}

