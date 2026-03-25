package com.airline.payment_service.service;

import org.springframework.stereotype.Service;

import com.airline.payment_service.entity.Payment;
import com.airline.payment_service.entity.Refund;
import com.airline.payment_service.repository.PaymentRepository;
import com.airline.payment_service.repository.RefundRepository;

@Service
public class RefundService {

    private final RefundRepository refundRepo;
    private final PaymentRepository paymentRepo;
    private final GatewayService gatewayService;

    public RefundService(RefundRepository refundRepo,
                         PaymentRepository paymentRepo,
                         GatewayService gatewayService) {
        this.refundRepo = refundRepo;
        this.paymentRepo = paymentRepo;
        this.gatewayService = gatewayService;
    }

    public Refund processRefund(Long paymentId) {

        Payment payment = paymentRepo.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        double refundAmount = payment.getAmount() * 0.8; // example

        boolean success = gatewayService.refund(refundAmount);

        Refund refund = new Refund();
        refund.setPaymentId(paymentId);
        refund.setAmount(refundAmount);
        refund.setStatus(success ? "SUCCESS" : "FAILED");

        return refundRepo.save(refund);
    }

    public String getStatus(Long paymentId) {
        return refundRepo.findByPaymentId(paymentId)
                .stream()
                .findFirst()
                .map(Refund::getStatus)
                .orElse("NOT_FOUND");
    }
}