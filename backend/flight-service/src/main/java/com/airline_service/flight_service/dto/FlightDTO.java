package com.airline_service.flight_service.dto;

import java.util.List;

public class FlightDTO {

    private String id;
    private String flightNumber;
    private String airline;
    private String airlineCode;
    private String aircraftType;

    private AirportDTO origin;
    private AirportDTO destination;

    private String departureTime;
    private String arrivalTime;
    private int durationMinutes;

    private int stops;
    private String status;
    private String gate;
    private String terminal;

    private List<String> amenities;
    private List<CabinClassDTO> cabinClasses;

    // No-argument constructor
    public FlightDTO() {}

    // All-argument constructor
    public FlightDTO(String id, String flightNumber, String airline, String airlineCode,
                     String aircraftType, AirportDTO origin, AirportDTO destination,
                     String departureTime, String arrivalTime, int durationMinutes,
                     int stops, String status, String gate, String terminal,
                     List<String> amenities, List<CabinClassDTO> cabinClasses) {
        this.id = id;
        this.flightNumber = flightNumber;
        this.airline = airline;
        this.airlineCode = airlineCode;
        this.aircraftType = aircraftType;
        this.origin = origin;
        this.destination = destination;
        this.departureTime = departureTime;
        this.arrivalTime = arrivalTime;
        this.durationMinutes = durationMinutes;
        this.stops = stops;
        this.status = status;
        this.gate = gate;
        this.terminal = terminal;
        this.amenities = amenities;
        this.cabinClasses = cabinClasses;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getFlightNumber() { return flightNumber; }
    public void setFlightNumber(String flightNumber) { this.flightNumber = flightNumber; }

    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }

    public String getAirlineCode() { return airlineCode; }
    public void setAirlineCode(String airlineCode) { this.airlineCode = airlineCode; }

    public String getAircraftType() { return aircraftType; }
    public void setAircraftType(String aircraftType) { this.aircraftType = aircraftType; }

    public AirportDTO getOrigin() { return origin; }
    public void setOrigin(AirportDTO origin) { this.origin = origin; }

    public AirportDTO getDestination() { return destination; }
    public void setDestination(AirportDTO destination) { this.destination = destination; }

    public String getDepartureTime() { return departureTime; }
    public void setDepartureTime(String departureTime) { this.departureTime = departureTime; }

    public String getArrivalTime() { return arrivalTime; }
    public void setArrivalTime(String arrivalTime) { this.arrivalTime = arrivalTime; }

    public int getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(int durationMinutes) { this.durationMinutes = durationMinutes; }

    public int getStops() { return stops; }
    public void setStops(int stops) { this.stops = stops; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getGate() { return gate; }
    public void setGate(String gate) { this.gate = gate; }

    public String getTerminal() { return terminal; }
    public void setTerminal(String terminal) { this.terminal = terminal; }

    public List<String> getAmenities() { return amenities; }
    public void setAmenities(List<String> amenities) { this.amenities = amenities; }

    public List<CabinClassDTO> getCabinClasses() { return cabinClasses; }
    public void setCabinClasses(List<CabinClassDTO> cabinClasses) { this.cabinClasses = cabinClasses; }
}
