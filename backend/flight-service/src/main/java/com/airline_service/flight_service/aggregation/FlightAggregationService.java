package com.airline_service.flight_service.aggregation;


import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.airline_service.flight_service.client.AdminClient;
import com.airline_service.flight_service.dto.AirportDTO;
import com.airline_service.flight_service.dto.BaggageDTO;
import com.airline_service.flight_service.dto.CabinClassDTO;
import com.airline_service.flight_service.dto.FlightDTO;
import com.airline_service.flight_service.dto.FlightSearchResponseDTO;
import com.airline_service.flight_service.entity.AirlineEntity;
import com.airline_service.flight_service.entity.CabinClassEntity;
import com.airline_service.flight_service.entity.FlightEntity;
import com.airline_service.flight_service.entity.FlightInstanceEntity;
import com.airline_service.flight_service.entity.RouteEntity;
import com.airline_service.flight_service.service.AirlineService;
import com.airline_service.flight_service.service.AmenityService;
import com.airline_service.flight_service.service.CabinClassService;
import com.airline_service.flight_service.service.FlightInstanceService;
import com.airline_service.flight_service.service.FlightService;
import com.airline_service.flight_service.service.RouteService;

@Service
public class FlightAggregationService {


    private final RouteService routeService;
    private final FlightService flightService;
    private final FlightInstanceService instanceService;
    private final AdminClient adminClient;
    private final AmenityService amenityService;
    private final AirlineService airlineService;
    private final CabinClassService cabinClassService;

    public FlightAggregationService(RouteService routeService,
                                    FlightService flightService,
                                    FlightInstanceService instanceService,
                                    AdminClient adminClient,
                                    AmenityService amenityService,
                                    AirlineService airlineService,
                                    CabinClassService cabinClassService) {
        this.routeService = routeService;
        this.flightService = flightService;
        this.instanceService = instanceService;
        this.adminClient = adminClient;
        this.amenityService = amenityService;
        this.airlineService = airlineService;
        this.cabinClassService = cabinClassService;
    }


    public FlightSearchResponseDTO searchFlights(String origin, String destination) {
    	
    	
    	
        RouteEntity route = routeService.getRoute(origin, destination);
        
        if (route == null) {
        	return new FlightSearchResponseDTO(new ArrayList<>());
        }
        System.out.println("Origin Code: " + route.getOriginCode());
        System.out.println("Destination Code: " + route.getDestinationCode());
        List<FlightEntity> flights = flightService.getFlightsByRoute(route.getId());

        if (flights == null || flights.isEmpty()) {
            return new FlightSearchResponseDTO(new ArrayList<>());
        }
        
        List<FlightDTO> response = new ArrayList<>();
        
        // 🔥 DEBUG: Call airport API once (to verify)
        AirportDTO originAirportDebug = adminClient.getAirport(route.getOriginCode());
        System.out.println("DEBUG Origin Airport Response: " + originAirportDebug);

        AirportDTO destinationAirportDebug = adminClient.getAirport(route.getDestinationCode());
        System.out.println("DEBUG Destination Airport Response: " + destinationAirportDebug);

        // ❗ If above prints null → Admin API issue
        // ❗ If object prints → mapping is correct
//        
//        private final AirlineService airlineService;
//        private final CabinClassService cabinClassService;

        for (FlightEntity flight : flights) {

            List<FlightInstanceEntity> instances = instanceService.getInstances(flight.getId());
            
            if (instances == null || instances.isEmpty()) {
                continue;
            }

            for (FlightInstanceEntity instance : instances) {

            	FlightDTO dto = new FlightDTO();
            	
            	AirlineEntity airline = airlineService.getAirline(flight.getAirlineId());

            	if (airline != null) {
            	    dto.setAirline(airline.getName());
            	    dto.setAirlineCode(airline.getAirlineCode());
            	}

            	dto.setId(String.valueOf(instance.getId()));
            	dto.setFlightNumber(flight.getFlightNumber());

            	// ✅ Aircraft
            	dto.setAircraftType(adminClient.getAircraftModel(flight.getAircraftId()));

            	// ✅ Airports (FIXED)
            	 // ✅ Airports (SAFE HANDLING)
                AirportDTO originAirport = adminClient.getAirport(route.getOriginCode());
                AirportDTO destinationAirport = adminClient.getAirport(route.getDestinationCode());

                if (originAirport == null) {
                    System.out.println("⚠️ Origin airport NULL for code: " + route.getOriginCode());
                }

                if (destinationAirport == null) {
                    System.out.println("⚠️ Destination airport NULL for code: " + route.getDestinationCode());
                }
            	dto.setOrigin(adminClient.getAirport(route.getOriginCode()));
            	dto.setDestination(adminClient.getAirport(route.getDestinationCode()));

            	// ✅ Time
            	dto.setDepartureTime(instance.getDepartureDateTime().toString());
            	dto.setArrivalTime(instance.getArrivalDateTime().toString());

            	// ✅ Duration (FIXED below)
            	int duration = (int) java.time.Duration.between(
            	        instance.getDepartureDateTime(),
            	        instance.getArrivalDateTime()
            	).toMinutes();
            	dto.setDurationMinutes(duration);

            	// ✅ Status
            	dto.setStatus(instance.getStatus());
            	dto.setGate(instance.getGate());
            	dto.setTerminal(instance.getTerminal());

            	// ✅ Amenities (FIXED below)
            	dto.setAmenities(amenityService.getAmenitiesByFlightId(flight.getId()));

            	response.add(dto);
            }
        }
        
     
        return new FlightSearchResponseDTO(response);
    }
    
    public FlightSearchResponseDTO searchFlights(
            String origin,
            String destination,
            String date,
            Integer passengers,
            String cabinClass) {

        RouteEntity route = routeService.getRoute(origin, destination);

        if (route == null) {
            return new FlightSearchResponseDTO(new ArrayList<>());
        }

        List<FlightEntity> flights = flightService.getFlightsByRoute(route.getId());

        List<FlightDTO> response = new ArrayList<>();

        for (FlightEntity flight : flights) {

            List<FlightInstanceEntity> instances = instanceService.getInstances(flight.getId());

            if (instances == null || instances.isEmpty()) continue;

            for (FlightInstanceEntity instance : instances) {

                // ✅ DATE FILTER
                if (date != null) {
                    String instanceDate = instance.getDepartureDateTime().toLocalDate().toString();
                    if (!instanceDate.equals(date)) continue;
                }

                FlightDTO dto = new FlightDTO();

                dto.setId(String.valueOf(instance.getId()));
                dto.setFlightNumber(flight.getFlightNumber());

                // ✅ Airline
                AirlineEntity airline = airlineService.getAirline(flight.getAirlineId());
                if (airline != null) {
                    dto.setAirline(airline.getName());
                    dto.setAirlineCode(airline.getAirlineCode());
                }

                // ✅ Aircraft
                dto.setAircraftType(adminClient.getAircraftModel(flight.getAircraftId()));

                // ✅ Airports (with timezone)
                dto.setOrigin(adminClient.getAirport(route.getOriginCode()));
                dto.setDestination(adminClient.getAirport(route.getDestinationCode()));

                // ✅ Time
                dto.setDepartureTime(instance.getDepartureDateTime().toString());
                dto.setArrivalTime(instance.getArrivalDateTime().toString());

                int duration = (int) java.time.Duration.between(
                        instance.getDepartureDateTime(),
                        instance.getArrivalDateTime()
                ).toMinutes();

                dto.setDurationMinutes(duration);

                // ✅ Status
                dto.setStops(flight.getStops());
                dto.setStatus(instance.getStatus());
                dto.setGate(instance.getGate());
                dto.setTerminal(instance.getTerminal());

                // ✅ Amenities
                dto.setAmenities(amenityService.getAmenitiesByFlightId(flight.getId()));

                // ✅ CABIN CLASSES
                List<CabinClassEntity> cabins = cabinClassService.getCabinClasses(flight.getId());
                List<CabinClassDTO> cabinDTOs = new ArrayList<>();

                for (CabinClassEntity c : cabins) {

                    if (cabinClass != null &&
                            !c.getClassType().equalsIgnoreCase(cabinClass)) continue;

                    if (passengers != null &&
                            c.getAvailableSeats() < passengers) continue;

                    CabinClassDTO cabinDTO = new CabinClassDTO();

                    cabinDTO.setType(c.getClassType());
                    cabinDTO.setBasePrice(c.getBasePrice());
                    cabinDTO.setCurrency(c.getCurrency());
                    cabinDTO.setAvailableSeats(c.getAvailableSeats());
                    cabinDTO.setTotalSeats(c.getTotalSeats());

                    BaggageDTO baggage = new BaggageDTO();
                    baggage.setCabin(c.getCabinBaggage());
                    baggage.setChecked(c.getCheckedBaggage());

                    cabinDTO.setBaggage(baggage);

                    cabinDTOs.add(cabinDTO);
                }

                if (cabinDTOs.isEmpty()) continue;

                dto.setCabinClasses(cabinDTOs);

                response.add(dto);
            }
        }

        return new FlightSearchResponseDTO(response);
    }
}