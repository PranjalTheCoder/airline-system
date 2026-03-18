package com.airline.inventory_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.airline.inventory_service.entity.SeatInventory;

import jakarta.persistence.LockModeType;

public interface SeatInventoryRepository extends JpaRepository<SeatInventory, Long> {

    List<SeatInventory> findByFlightInstanceId(Long flightInstanceId);

    Optional<SeatInventory> findByFlightInstanceIdAndFareClass_Id(
            Long flightInstanceId,
            Long fareClassId
    );

    List<SeatInventory> findByAvailableSeatsLessThan(int threshold);
    
    @Query("SELECT s FROM SeatInventory s WHERE s.flightInstanceId = :flightId")
    List<SeatInventory> getInventory(@Param("flightId") Long flightId);
    
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM SeatInventory s WHERE s.id = :id")
    SeatInventory findByIdForUpdate(@Param("id") Long id);
}
