package com.airline.reservation_service.controller;

import com.airline.reservation_service.dto.CreatePnrRequest;
import com.airline.reservation_service.entity.Pnr;
import com.airline.reservation_service.service.ReservationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
public class ReservationController {

    private final ReservationService service;

    public ReservationController(ReservationService service) {
        this.service = service;
    }

    @PostMapping
    public Pnr create(@RequestBody CreatePnrRequest req){
        return service.createPnr(req);
    }

    @GetMapping
    public List<Pnr> getAll(){
        return service.getAll();
    }

    @GetMapping("/{pnr}")
    public Pnr get(@PathVariable String pnr){
        return service.getByCode(pnr);
    }

    @PutMapping("/{pnr}")
    public Pnr update(@PathVariable String pnr, @RequestBody Pnr p){
        return service.update(pnr, p);
    }

    @DeleteMapping("/{pnr}")
    public String delete(@PathVariable String pnr){
        service.cancel(pnr);
        return "CANCELLED";
    }

    @GetMapping("/status/{status}")
    public List<Pnr> getByStatus(@PathVariable String status){
        return service.getByStatus(status);
    }

    @PostMapping("/{pnr}/confirm")
    public String confirm(@PathVariable String pnr){
        service.confirm(pnr);
        return "CONFIRMED";
    }

    @PostMapping("/{pnr}/cancel")
    public String cancelBooking(@PathVariable String pnr){
        service.cancel(pnr);
        return "CANCELLED";
    }
}