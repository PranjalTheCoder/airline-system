package com.airline.inventory_service.controller;


import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.airline.inventory_service.dto.request.AssignSeatRequest;
import com.airline.inventory_service.dto.request.HoldSeatRequest;
import com.airline.inventory_service.dto.request.ReleaseSeatRequest;
import com.airline.inventory_service.dto.response.ApiResponse;
import com.airline.inventory_service.service.SeatAssignmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/inventory")
public class SeatController {

    private final SeatAssignmentService assignmentService;

    public SeatController(SeatAssignmentService assignmentService) {
        this.assignmentService = assignmentService;
    }

    // 🔥 HOLD SEAT
    @PostMapping("/{flightInstanceId}/hold")
    public ApiResponse<String> holdSeat(
            @PathVariable Long flightInstanceId,
            @Valid @RequestBody HoldSeatRequest request) {

        assignmentService.holdSeat(
                flightInstanceId,
                request.getSeatId(),
                request.getPassengerId()
        );

        return new ApiResponse<>(true, "Seat held successfully", null);
    }

    // ❌ RELEASE SEAT
    @PostMapping("/{flightInstanceId}/release")
    public ApiResponse<String> releaseSeat(
            @PathVariable Long flightInstanceId,
            @Valid @RequestBody ReleaseSeatRequest request) {

        assignmentService.releaseSeat(
                flightInstanceId,
                request.getSeatId()
        );

        return new ApiResponse<>(true, "Seat released", null);
    }

    // ✅ CONFIRM BOOKING
    @PostMapping("/{flightInstanceId}/assign-seat")
    public ApiResponse<String> confirmSeat(
            @PathVariable Long flightInstanceId,
            @Valid @RequestBody AssignSeatRequest request) {

        assignmentService.confirmSeat(
                flightInstanceId,
                request.getSeatId()
        );

        return new ApiResponse<>(true, "Seat booked successfully", null);
    }
}