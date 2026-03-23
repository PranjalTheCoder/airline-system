package com.airline.admin_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.admin_service.dto.request.AirportRequestDTO;
import com.airline.admin_service.dto.response.AirportDTO;
import com.airline.admin_service.service.AirportService;

@RestController
@RequestMapping("/api/admin/airports")
public class AirportController {

    private final AirportService service;

    public AirportController(AirportService service) {
        this.service = service;
    }

    // ✅ CREATE
    @PostMapping
    public AirportDTO create(@RequestBody AirportRequestDTO request) {
        return service.create(request);
    }

    // ✅ GET ALL
    @GetMapping
    public List<AirportDTO> getAll() {
        return service.getAll();
    }

    // ✅ GET BY CODE
    @GetMapping("/{code}")
    public AirportDTO getByCode(@PathVariable String code) {
        return service.getByCode(code);
    }

    // ✅ UPDATE
    @PutMapping("/{code}")
    public AirportDTO update(@PathVariable String code,
                             @RequestBody AirportRequestDTO request) {
        return service.update(code, request);
    }
    
    // ✅ Partial UPDATE
    @PatchMapping("/{code}")
    public AirportDTO patch(@PathVariable String code,
                             @RequestBody AirportRequestDTO request) {
        return service.patch(code, request);
    }

    // ✅ DELETE
    @DeleteMapping("/{code}")
    public String delete(@PathVariable String code) {
        service.delete(code);
        return "Airport deleted successfully";
    }
}