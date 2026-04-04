package com.airline.reservation_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation_service.entity.TaxEntity;

public interface TaxRepository
extends JpaRepository<TaxEntity, Long> {

List<TaxEntity> findByPricingId(Long pricingId);
}