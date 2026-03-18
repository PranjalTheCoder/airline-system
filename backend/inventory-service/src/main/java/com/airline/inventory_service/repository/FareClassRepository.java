package com.airline.inventory_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.FareClass;

public interface FareClassRepository extends JpaRepository<FareClass, Long> {

    List<FareClass> findByCabinClass_Id(Long cabinClassId);

    Optional<FareClass> findByCode(String code);
}