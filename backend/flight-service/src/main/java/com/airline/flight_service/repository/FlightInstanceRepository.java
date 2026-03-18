package com.airline.flight_service.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.FlightSchedule;

public interface FlightInstanceRepository extends JpaRepository<FlightInstance, Long> {

	List<FlightInstance> findByScheduleInAndDepartureDate(
	        List<FlightSchedule> schedules,
	        LocalDate departureDate
	);
	
	List<FlightInstance> findByDepartureDate(LocalDate date);

    List<FlightInstance> findByScheduleId(Long scheduleId);

    List<FlightInstance> findByScheduleFlightId(Long flightId);
    
    List<FlightInstance> findByScheduleFlightRouteOriginIataCodeAndDepartureDate(
            String airport, java.time.LocalDate date);
    
    List<FlightInstance> findByScheduleFlightRouteDestinationIataCodeAndDepartureDate(
            String airport, java.time.LocalDate date);
}