package com.airline.admin_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.admin_service.entity.Crew;

public interface CrewRepository extends JpaRepository<Crew, String> {}
