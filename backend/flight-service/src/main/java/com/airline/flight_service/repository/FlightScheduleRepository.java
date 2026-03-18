package com.airline.flight_service.repository;



import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.entity.FlightSchedule;

public interface FlightScheduleRepository extends JpaRepository<FlightSchedule, Long> {
	List<FlightSchedule> findByFlightIn(List<Flight> flights);
	
	List<FlightSchedule> findByFlightId(Long flightId);
}