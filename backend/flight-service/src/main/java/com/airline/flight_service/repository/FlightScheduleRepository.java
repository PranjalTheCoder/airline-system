package com.airline.flight_service.repository;



import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.FlightSchedule;

public interface FlightScheduleRepository extends JpaRepository<FlightSchedule, Long> {
}