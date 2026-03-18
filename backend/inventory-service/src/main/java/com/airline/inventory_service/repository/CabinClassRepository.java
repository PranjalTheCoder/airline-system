package com.airline.inventory_service.repository;



import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.inventory_service.entity.CabinClass;

public interface CabinClassRepository extends JpaRepository<CabinClass, Long> {

    Optional<CabinClass> findByCode(String code);
}
