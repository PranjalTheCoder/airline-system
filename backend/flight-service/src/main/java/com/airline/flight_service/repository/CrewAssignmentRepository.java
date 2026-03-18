package com.airline.flight_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.CrewAssignment;

public interface CrewAssignmentRepository extends JpaRepository<CrewAssignment, Long> {

    List<CrewAssignment> findByFlightInstanceId(Long flightInstanceId);
}