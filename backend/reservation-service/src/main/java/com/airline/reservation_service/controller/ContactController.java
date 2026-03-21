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

import com.airline.reservation_service.dto.ContactDTO;
import com.airline.reservation_service.entity.PnrContact;
import com.airline.reservation_service.service.ContactService;

@RestController
@RequestMapping("/api/reservations/{pnr}/contacts")
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    public PnrContact add(@PathVariable String pnr, @RequestBody ContactDTO dto){
        return service.add(pnr, dto);
    }

    @GetMapping
    public List<PnrContact> get(@PathVariable String pnr){
        return service.get(pnr);
    }

    @PutMapping("/{id}")
    public PnrContact update(@PathVariable Long id, @RequestBody ContactDTO dto){
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        service.delete(id);
        return "DELETED";
    }
}