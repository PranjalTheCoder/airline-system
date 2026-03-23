package com.airline.admin_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.admin_service.entity.Rating;

public interface CrewRatingRepository extends JpaRepository<Rating, Long> {
    List<Rating> findByCrewId(String crewId);
}