package com.airline_service.flight_service.mapper;



import java.util.List;

import com.airline_service.flight_service.dto.AirportDTO;
import com.airline_service.flight_service.dto.CabinClassDTO;
import com.airline_service.flight_service.dto.FlightDTO;
import com.airline_service.flight_service.entity.FlightEntity;
import com.airline_service.flight_service.entity.FlightInstanceEntity;
import com.airline_service.flight_service.entity.RouteEntity;

public class FlightMapper {

    public static FlightDTO mapToFlightDTO(
            FlightEntity flight,
            FlightInstanceEntity instance,
            RouteEntity route,
            String aircraftModel,
            AirportDTO origin,
            AirportDTO destination,
            List<String> amenities,
            List<CabinClassDTO> cabinClasses
    ) {

        FlightDTO dto = new FlightDTO();

        dto.setId(String.valueOf(instance.getId()));
        dto.setFlightNumber(flight.getFlightNumber());
        dto.setAircraftType(aircraftModel);

        dto.setOrigin(origin);
        dto.setDestination(destination);

        dto.setDepartureTime(instance.getDepartureDateTime().toString());
        dto.setArrivalTime(instance.getArrivalDateTime().toString());

        dto.setDurationMinutes(route.getDurationMinutes());

        dto.setStatus(instance.getStatus());
        dto.setGate(instance.getGate());
        dto.setTerminal(instance.getTerminal());

        dto.setAmenities(amenities);

        // Optional (if added in DTO later)
        // dto.setCabinClasses(cabinClasses);

        return dto;
    }
}