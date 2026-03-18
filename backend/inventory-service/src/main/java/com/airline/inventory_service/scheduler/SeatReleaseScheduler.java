package com.airline.inventory_service.scheduler;


import java.time.LocalDateTime;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.airline.inventory_service.entity.SeatAssignment;
import com.airline.inventory_service.repository.SeatAssignmentRepository;

@Component
public class SeatReleaseScheduler {

    private final SeatAssignmentRepository repository;

    public SeatReleaseScheduler(SeatAssignmentRepository repository) {
        this.repository = repository;
    }

    @Scheduled(fixedRate = 60000) // every 1 min
    public void releaseExpiredSeats() {

        List<SeatAssignment> expired = repository
                .findByHoldExpiryBefore(LocalDateTime.now());

        for (SeatAssignment a : expired) {
            if ("HOLD".equals(a.getStatus())) {
                a.setStatus("RELEASED");
                repository.save(a);
            }
        }
    }
}
