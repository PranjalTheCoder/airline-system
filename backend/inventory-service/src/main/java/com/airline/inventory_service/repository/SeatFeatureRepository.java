package com.airline.inventory_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.SeatFeature;

public interface SeatFeatureRepository extends JpaRepository<SeatFeature, Long> {

    List<SeatFeature> findBySeatId(String seatId);

}