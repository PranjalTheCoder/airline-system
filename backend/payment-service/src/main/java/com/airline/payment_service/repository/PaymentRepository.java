package com.airline.payment_service.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.payment_service.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

    Optional<Payment> findByIdempotencyKey(String key);

    Optional<Payment> findByPnrCode(String pnrCode);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByStatus(String status);
}