package com.airline.flight_service.repository;



import com.airline.flight_service.entity.Flight;
import com.airline.flight_service.entity.FlightSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FlightScheduleRepository extends JpaRepository<FlightSchedule, Long> {

    List<FlightSchedule> findByFlightIn(List<Flight> flights);

    List<FlightSchedule> findByFlightId(Long flightId);
}