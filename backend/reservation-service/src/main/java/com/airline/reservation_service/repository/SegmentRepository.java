package com.airline.reservation_service.repository;

import com.airline.reservation_service.entity.ItinerarySegment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SegmentRepository extends JpaRepository<ItinerarySegment, Long> {
    List<ItinerarySegment> findByPnrId(Long pnrId);
}