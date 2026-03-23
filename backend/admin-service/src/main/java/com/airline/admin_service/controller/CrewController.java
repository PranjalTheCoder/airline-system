package com.airline.admin_service.controller;

import com.airline.admin_service.dto.request.CrewRequestDTO;
import com.airline.admin_service.dto.response.CrewDTO;
import com.airline.admin_service.service.CrewService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/crew")
public class CrewController {

    private final CrewService service;

    public CrewController(CrewService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public CrewDTO create(@RequestBody CrewRequestDTO request) {
        return service.create(request);
    }

    // GET ALL
    @GetMapping
    public List<CrewDTO> getAll() {
        return service.getAll();
    }

    // GET BY ID
    @GetMapping("/{id}")
    public CrewDTO getById(@PathVariable String id) {
        return service.getById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public CrewDTO update(@PathVariable String id,
                          @RequestBody CrewRequestDTO request) {
        return service.update(id, request);
    }

    // PATCH
    @PatchMapping("/{id}")
    public CrewDTO patch(@PathVariable String id,
                         @RequestBody CrewRequestDTO request) {
        return service.patch(id, request);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public String delete(@PathVariable String id) {
        service.delete(id);
        return "Deleted successfully";
    }
}