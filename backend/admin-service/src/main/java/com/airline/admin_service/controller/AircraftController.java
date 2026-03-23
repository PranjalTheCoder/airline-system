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

import com.airline.admin_service.dto.request.AircraftRequestDTO;
import com.airline.admin_service.dto.response.AircraftDTO;
import com.airline.admin_service.service.AircraftService;

@RestController
@RequestMapping("/api/admin/aircraft")
public class AircraftController {

	 private final AircraftService service;

	    public AircraftController(AircraftService service) {
	        this.service = service;
	    }

	    // ✅ GET ALL
	    @GetMapping
	    public List<AircraftDTO> getAll() {
	        return service.getAll();
	    }

	    // ✅ GET BY ID
	    @GetMapping("/{id}")
	    public AircraftDTO getById(@PathVariable String id) {
	        return service.getById(id);
	    }

	    // ✅ CREATE
	    @PostMapping
	    public AircraftDTO create(@RequestBody AircraftRequestDTO request) {
	        return service.create(request);
	    }

	    // ✅ UPDATE
	    @PutMapping("/{id}")
	    public AircraftDTO update(@PathVariable String id,
	                              @RequestBody AircraftRequestDTO request) {
	        return service.update(id, request);
	    }
	    
	    // ✅ Partial UPDATE
	    @PatchMapping("/{id}")
	    public AircraftDTO patch(@PathVariable String id,
	                              @RequestBody AircraftRequestDTO request) {
	        return service.patch(id, request);
	    }

	    // ✅ DELETE
	    @DeleteMapping("/{id}")
	    public void delete(@PathVariable String id) {
	        service.delete(id);
	    }
}