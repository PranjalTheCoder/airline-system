package com.airline.flight_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.airline.flight_service.entity.CrewAssignment;
import com.airline.flight_service.entity.FlightInstance;
import com.airline.flight_service.repository.CrewAssignmentRepository;
import com.airline.flight_service.repository.FlightInstanceRepository;

@Service
public class CrewService {

    private final CrewAssignmentRepository crewRepo;
    private final FlightInstanceRepository instanceRepo;

    public CrewService(CrewAssignmentRepository crewRepo,
                       FlightInstanceRepository instanceRepo) {
        this.crewRepo = crewRepo;
        this.instanceRepo = instanceRepo;
    }

    // GET CREW
    public List<CrewAssignment> getCrew(Long instanceId) {
        return crewRepo.findByFlightInstanceId(instanceId);
    }

    // ASSIGN CREW
    public CrewAssignment assignCrew(Long instanceId, Long crewId, String role) {

        FlightInstance instance = instanceRepo.findById(instanceId)
                .orElseThrow(() -> new RuntimeException("Instance not found"));

        CrewAssignment assignment = new CrewAssignment();
        assignment.setCrewId(crewId);
        assignment.setRole(role);
        assignment.setFlightInstance(instance);

        return crewRepo.save(assignment);
    }
}