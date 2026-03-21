package com.airline.reservation_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.reservation_service.entity.PnrContact;

public interface ContactRepository extends JpaRepository<PnrContact, Long> {
    List<PnrContact> findByPnrId(Long pnrId);
}