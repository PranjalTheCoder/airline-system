package com.airline.reservation_service.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.airline.reservation_service.dto.CreatePnrRequest;
import com.airline.reservation_service.entity.Pnr;
import com.airline.reservation_service.repository.PnrRepository;

@Service
public class ReservationService {

    private final PnrRepository repo;

    public ReservationService(PnrRepository repo) {
        this.repo = repo;
    }

    public Pnr createPnr(CreatePnrRequest req){
        Pnr p = new Pnr();
        p.setPnrCode(UUID.randomUUID().toString().substring(0,6));
        p.setBookingStatus("HOLD");
        p.setCreatedAt(LocalDateTime.now());
        return repo.save(p);
    }

    public List<Pnr> getAll(){
        return repo.findAll();
    }

    public Pnr getByCode(String code){
        return repo.findByPnrCode(code).orElseThrow();
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