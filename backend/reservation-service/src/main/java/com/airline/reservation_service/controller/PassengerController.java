package com.airline.reservation_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.reservation_service.dto.PassengerDTO;
import com.airline.reservation_service.entity.PnrPassenger;
import com.airline.reservation_service.service.PassengerService;

@RestController
@RequestMapping("/api/reservations/{pnr}/passengers")
public class PassengerController {

    private final PassengerService service;

    public PassengerController(PassengerService service) {
        this.service = service;
    }

    // ✅ ADD PASSENGER
    @PostMapping
    public PnrPassenger add(@PathVariable String pnr,
                            @RequestBody PassengerDTO dto) {
        return service.add(pnr, dto);
    }

    // ✅ GET ALL
    @GetMapping
    public List<PnrPassenger> get(@PathVariable String pnr) {
        return service.get(pnr);
    }

    // ✅ GET ONE
    @GetMapping("/{id}")
    public PnrPassenger getOne(@PathVariable Long id) {
        return service.getOne(id);
    }

    // ✅ UPDATE
    @PutMapping("/{id}")
    public PnrPassenger update(@PathVariable Long id,
                               @RequestBody PassengerDTO dto) {
        return service.update(id, dto);
    }

    // ✅ DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id) {
        service.delete(id);
        return "DELETED";
    }
}