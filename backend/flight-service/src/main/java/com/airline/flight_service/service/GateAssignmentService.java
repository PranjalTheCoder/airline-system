package com.airline.flight_service.service;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.entity.Gate;
import com.airline.flight_service.repository.FlightInstanceRepository;
import com.airline.flight_service.repository.GateRepository;

@Service
public class GateAssignmentService {

    private final FlightInstanceRepository instanceRepo;
    private final GateRepository gateRepo;

    public GateAssignmentService(FlightInstanceRepository instanceRepo,
                                 GateRepository gateRepo) {
        this.instanceRepo = instanceRepo;
        this.gateRepo = gateRepo;
    }

    // 🔥 ASSIGN GATE
    public FlightInstance assignGate(Long instanceId, Long gateId, String terminal) {

        FlightInstance instance = instanceRepo.findById(instanceId)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        Gate gate = gateRepo.findById(gateId)
                .orElseThrow(() -> new RuntimeException("Gate not found"));

        instance.setGate(gate);
        instance.setTerminal(terminal);

        return instanceRepo.save(instance);
    }

    // 🔥 GET GATE
    public Gate getGate(Long instanceId) {

        FlightInstance instance = instanceRepo.findById(instanceId)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        return instance.getGate();
    }
}