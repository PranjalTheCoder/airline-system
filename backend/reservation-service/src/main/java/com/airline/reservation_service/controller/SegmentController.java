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

import com.airline.reservation_service.dto.SegmentDTO;
import com.airline.reservation_service.entity.ItinerarySegment;
import com.airline.reservation_service.service.SegmentService;

@RestController
@RequestMapping("/api/reservations/{pnr}/segments")
public class SegmentController {

    private final SegmentService service;

    public SegmentController(SegmentService service) {
        this.service = service;
    }

    @PostMapping
    public ItinerarySegment add(@PathVariable String pnr, @RequestBody SegmentDTO dto){
        return service.add(pnr, dto);
    }

    @GetMapping
    public List<ItinerarySegment> get(@PathVariable String pnr){
        return service.get(pnr);
    }

    @GetMapping("/{id}")
    public ItinerarySegment getOne(@PathVariable Long id){
        return service.getOne(id);
    }

    @PutMapping("/{id}")
    public ItinerarySegment update(@PathVariable Long id, @RequestBody SegmentDTO dto){
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public String delete(@PathVariable Long id){
        service.delete(id);
        return "DELETED";
    }
}