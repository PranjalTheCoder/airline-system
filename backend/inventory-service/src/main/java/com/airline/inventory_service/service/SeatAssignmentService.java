package com.airline.inventory_service.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.airline.inventory_service.entity.Seat;
import com.airline.inventory_service.entity.SeatAssignment;
import com.airline.inventory_service.entity.SeatInventory;
import com.airline.inventory_service.exception.BusinessException;
import com.airline.inventory_service.repository.SeatAssignmentRepository;
import com.airline.inventory_service.repository.SeatInventoryRepository;
import com.airline.inventory_service.repository.SeatRepository;

    @Service
    public class SeatAssignmentService {

        private final SeatAssignmentRepository assignmentRepository;
        private final SeatRepository seatRepository;
        private final SeatInventoryRepository inventoryRepository;

        public SeatAssignmentService(SeatAssignmentRepository assignmentRepository,
                                     SeatRepository seatRepository,
                                     SeatInventoryRepository inventoryRepository) {
            this.assignmentRepository = assignmentRepository;
            this.seatRepository = seatRepository;
            this.inventoryRepository = inventoryRepository;
        }

        // 🔥 HOLD SEAT
        @Transactional
        public void holdSeat(Long flightInstanceId, Long seatId, Long passengerId) {

            // 1. Check seat exists
            Seat seat = seatRepository.findById(seatId)
                    .orElseThrow();

            // 2. Check already assigned
            assignmentRepository.findBySeat_IdAndFlightInstanceId(seatId, flightInstanceId)
                    .ifPresent(a -> {
                        throw new BusinessException("Seat already taken");
                    });

            // 3. Create HOLD
            SeatAssignment assignment = new SeatAssignment();
            assignment.setSeat(seat);
            assignment.setFlightInstanceId(flightInstanceId);
            assignment.setPassengerId(passengerId);
            assignment.setStatus("HOLD");
            assignment.setHoldExpiry(LocalDateTime.now().plusMinutes(10));

            assignmentRepository.save(assignment);
        }
        
        @Transactional
        public void confirmSeat(Long flightInstanceId, Long seatId) {

            SeatAssignment assignment = assignmentRepository
                    .findBySeat_IdAndFlightInstanceId(seatId, flightInstanceId)
                    .orElseThrow();

            if (!"HOLD".equals(assignment.getStatus())) {
                throw new BusinessException("Seat is not on hold");
            }

            // 🔒 LOCK INVENTORY
            SeatInventory inventory = inventoryRepository.findByIdForUpdate(
                    assignment.getSeat().getId()
            );

            if (inventory.getAvailableSeats() <= 0) {
                throw new BusinessException("No seats available");
            }

            inventory.setReservedSeats(inventory.getReservedSeats() + 1);
            inventory.setAvailableSeats(inventory.getAvailableSeats() - 1);

            assignment.setStatus("BOOKED");

            inventoryRepository.save(inventory);
            assignmentRepository.save(assignment);
        }

		public void releaseSeat(Long flightInstanceId, Long seatId) {
			// TODO Auto-generated method stub
			
		}
    }

