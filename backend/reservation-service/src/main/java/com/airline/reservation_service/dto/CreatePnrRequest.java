package com.airline.reservation_service.dto;

import java.util.List;
import com.airline.reservation_service.dto.*;

public class CreatePnrRequest {

    private List<PassengerDTO> passengers;
    private List<SegmentDTO> segments;
    private ContactDTO contact;

    public List<PassengerDTO> getPassengers() { return passengers; }
    public void setPassengers(List<PassengerDTO> passengers) { this.passengers = passengers; }

    public List<SegmentDTO> getSegments() { return segments; }
    public void setSegments(List<SegmentDTO> segments) { this.segments = segments; }

    public ContactDTO getContact() { return contact; }
    public void setContact(ContactDTO contact) { this.contact = contact; }
}