package com.airline.admin_service.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.admin_service.entity.Aircraft;

public interface AircraftRepository extends JpaRepository<Aircraft, String>  {
	Optional<Aircraft> findByModel(String model);
}
