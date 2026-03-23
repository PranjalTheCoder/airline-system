package com.airline.admin_service.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.admin_service.dto.response.AdminStatsDTO;
import com.airline.admin_service.service.AdminStatsService;

@RestController
@RequestMapping("/api/admin/stats")
public class AdminStatsController {

    private final AdminStatsService service;

    public AdminStatsController(AdminStatsService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public ResponseEntity<AdminStatsDTO> create(@RequestBody AdminStatsDTO dto) {
        return ResponseEntity.ok(service.save(dto));
    }

    // GET
    @GetMapping
    public ResponseEntity<AdminStatsDTO> get() {
        return ResponseEntity.ok(service.getStats());
    }

    // UPDATE
    @PutMapping("/{id}")
    public ResponseEntity<AdminStatsDTO> update(
            @PathVariable Long id,
            @RequestBody AdminStatsDTO dto
    ) {
        return ResponseEntity.ok(service.update(id, dto));
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.ok("Deleted successfully");
    }
}