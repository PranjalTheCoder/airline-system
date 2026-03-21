package com.airline.payment_service.service;

import com.airline.payment_service.client.ReservationClient;
import com.airline.payment_service.dto.PnrDTO;
import com.airline.payment_service.entity.Payment;
import com.airline.payment_service.enums.PaymentStatus;
import com.airline.payment_service.repository.PaymentRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PaymentService {

    private final ReservationClient reservationClient;
    private final PaymentRepository paymentRepo;

    public PaymentService(ReservationClient reservationClient,
                          PaymentRepository paymentRepo) {
        this.reservationClient = reservationClient;
        this.paymentRepo = paymentRepo;
    }

    @Transactional
    public Payment processPayment(String pnrCode, String idempotencyKey) {

        // ✅ 1. IDEMPOTENCY CHECK
        var existing = paymentRepo.findByIdempotencyKey(idempotencyKey);
        if (existing.isPresent()) {
            return existing.get();
        }

        // ✅ 2. FETCH PNR
        PnrDTO pnr = reservationClient.getPNR(pnrCode);

        if (pnr == null) {
            throw new RuntimeException("PNR not found");
        }

        // ✅ 3. VALIDATE PNR
        if (!"HOLD".equalsIgnoreCase(pnr.getBookingStatus())) {
            throw new RuntimeException("PNR not eligible for payment");
        }

        // ✅ 4. CALCULATE AMOUNT (BACKEND ONLY)
        double amount = calculateFare(pnr);

        // ✅ 5. CREATE PAYMENT
        Payment payment = new Payment();
        payment.setPnrCode(pnrCode);
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.INITIATED);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setIdempotencyKey(idempotencyKey);

        paymentRepo.save(payment);

        try {
            // ✅ 6. MOCK PAYMENT GATEWAY
            boolean success = mockPaymentGateway();

            if (success) {

                payment.setStatus(PaymentStatus.SUCCESS);

                // ✅ 7. CONFIRM BOOKING
                reservationClient.confirmBooking(pnrCode);

            } else {

                payment.setStatus(PaymentStatus.FAILED);

                // ✅ 8. CANCEL BOOKING
                reservationClient.cancelBooking(pnrCode);
            }

        } catch (Exception e) {

            payment.setStatus(PaymentStatus.FAILED);

            // SAFETY ROLLBACK
            reservationClient.cancelBooking(pnrCode);

            throw new RuntimeException("Payment failed", e);
        }

        return paymentRepo.save(payment);
    }

    // 🔥 DYNAMIC PRICING
    private double calculateFare(PnrDTO pnr) {

        double base = pnr.getTotalAmount() != null ? pnr.getTotalAmount() : 5000;

        double tax = base * 0.1;
        double fee = 200;

        return base + tax + fee;
    }

    // 🔥 MOCK GATEWAY
    private boolean mockPaymentGateway() {
        return true; // replace with real gateway
    }
}