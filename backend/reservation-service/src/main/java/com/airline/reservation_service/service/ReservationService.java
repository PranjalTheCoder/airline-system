package com.airline.reservation_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.dto.CreatePnrRequest;
import com.airline.reservation_service.dto.PassengerDTO;
import com.airline.reservation_service.dto.PnrResponseDTO;
import com.airline.reservation_service.dto.SegmentDTO;
import com.airline.reservation_service.entity.ItinerarySegment;
import com.airline.reservation_service.entity.Pnr;
import com.airline.reservation_service.entity.PnrContact;
import com.airline.reservation_service.entity.PnrPassenger;
import com.airline.reservation_service.repository.ContactRepository;
import com.airline.reservation_service.repository.PassengerRepository;
import com.airline.reservation_service.repository.PnrRepository;
import com.airline.reservation_service.repository.SegmentRepository;

@Service
public class ReservationService {

    private final PnrRepository repo;
    private final PassengerRepository passengerRepo;
    private final SegmentRepository segmentRepo;
    private final ContactRepository contactRepo;

    public ReservationService(PnrRepository repo, 
    			PassengerRepository passengerRepo, 
    			SegmentRepository segmentRepo, ContactRepository contactRepo) {
        this.repo = repo;
        this.passengerRepo = passengerRepo;
        this.segmentRepo = segmentRepo;
        this.contactRepo = contactRepo;
    }

    public Pnr createPnr(CreatePnrRequest req){

        // 1. Create PNR
        Pnr pnr = new Pnr();
        pnr.setPnrCode(UUID.randomUUID().toString().substring(0,6));
        pnr.setBookingStatus("HOLD");
        pnr.setCreatedAt(LocalDateTime.now());
        pnr.setCreatedBy(1L); // temp user

        Pnr savedPnr = repo.save(pnr);

        // ================= PASSENGERS =================
        if (req.getPassengers() != null) {
            for (PassengerDTO dto : req.getPassengers()) {

                PnrPassenger p = new PnrPassenger();
                p.setPassengerId(dto.getPassengerId());
                p.setPassengerType(dto.getPassengerType());
                p.setPnr(savedPnr);

                passengerRepo.save(p);
            }
        }

        // ================= SEGMENTS =================
        if (req.getSegments() != null) {
            for (SegmentDTO dto : req.getSegments()) {

                ItinerarySegment s = new ItinerarySegment();
                s.setFlightInstanceId(dto.getFlightInstanceId());
                s.setFareClassId(dto.getFareClassId());
                s.setSegmentStatus("HOLD");
                s.setPnr(savedPnr);

                segmentRepo.save(s);
            }
        }

        // ================= CONTACT =================
        if (req.getContact() != null) {

            PnrContact c = new PnrContact();
            c.setEmail(req.getContact().getEmail());
            c.setPhone(req.getContact().getPhone());
            c.setPnr(savedPnr);

            contactRepo.save(c);
        }

        return savedPnr;
    }

    public List<Pnr> getAll(){
        return repo.findAll();
    }

    public Pnr getByCode(String code){
        return repo.findByPnrCode(code).orElseThrow();
    }
    
    public PnrResponseDTO getPnrDetails(String code){

        Pnr pnr = repo.findByPnrCode(code).orElseThrow();

        PnrResponseDTO dto = new PnrResponseDTO();

        dto.setPnrCode(pnr.getPnrCode());
        dto.setBookingStatus(pnr.getBookingStatus());

        // temporary user
        dto.setCreatedBy(1L);

        // 🔥 amount (dummy for now)
//        dto.setTotalAmount(5000.0);

        // ✅ passengers
        List<PnrPassenger> passengers = passengerRepo.findByPnrId(pnr.getId());

        List<PassengerDTO> passengerDTOs = passengers.stream().map(p -> {
            PassengerDTO d = new PassengerDTO();
            d.setPassengerId(p.getPassengerId());
            d.setPassengerType(p.getPassengerType());
            return d;
        }).collect(Collectors.toList());

        dto.setPassengers(passengerDTOs);

        // ✅ segments
        List<ItinerarySegment> segments = segmentRepo.findByPnrId(pnr.getId());

        List<SegmentDTO> segmentDTOs = segments.stream().map(s -> {
            SegmentDTO d = new SegmentDTO();
            d.setFlightInstanceId(s.getFlightInstanceId());
            d.setFareClassId(s.getFareClassId());
            return d;
        }).collect(Collectors.toList());

        dto.setSegments(segmentDTOs);

        return dto;
    }

    public Pnr update(String code, Pnr update){
        Pnr p = getByCode(code);
        p.setBookingStatus(update.getBookingStatus());
        return repo.save(p);
    }

    public void cancel(String code){
        Pnr p = getByCode(code);
        p.setBookingStatus("CANCELLED");
        repo.save(p);
    }

    public void confirm(String code){
        Pnr p = getByCode(code);
        p.setBookingStatus("CONFIRMED");
        repo.save(p);
    }

    public List<Pnr> getByStatus(String status){
        return repo.findByBookingStatus(status);
    }
}