package com.airline.reservation_service.dto.request;

import java.util.List;

public class ReservationRequestDTO {

    private String userId;
    private String flightId;
    private String cabinClass;

    private String contactEmail;
    private String contactPhone;

    private List<PassengerRequestDTO> passengers;
    private List<String> selectedSeats;

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getCabinClass() { return cabinClass; }
    public void setCabinClass(String cabinClass) { this.cabinClass = cabinClass; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getContactPhone() { return contactPhone; }
    public void setContactPhone(String contactPhone) { this.contactPhone = contactPhone; }

    public List<PassengerRequestDTO> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerRequestDTO> passengers) { this.passengers = passengers; }

    public List<String> getSelectedSeats() { return selectedSeats; }
    public void setSelectedSeats(List<String> selectedSeats) { this.selectedSeats = selectedSeats; }
}