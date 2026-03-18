package com.airline.flight_service.repository;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.FlightSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface FlightInstanceRepository extends JpaRepository<FlightInstance, Long> {
}