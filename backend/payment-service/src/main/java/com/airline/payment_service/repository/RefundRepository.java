package com.airline.payment_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.payment_service.entity.Refund;

public interface RefundRepository extends JpaRepository<Refund, Long> {
	List<Refund> findByPaymentId(Long paymentId);
}
