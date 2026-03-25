package com.airline.payment_service.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.airline.payment_service.client.AuthClient;
import com.airline.payment_service.client.InventoryClient;
import com.airline.payment_service.client.ReservationClient;
import com.airline.payment_service.dto.InventoryRequestDTO;
import com.airline.payment_service.dto.PassengerDTO;
import com.airline.payment_service.dto.PnrDTO;
import com.airline.payment_service.dto.UserDTO;
import com.airline.payment_service.entity.Payment;
import com.airline.payment_service.enums.PaymentStatus;
import com.airline.payment_service.repository.PaymentRepository;

import jakarta.transaction.Transactional;

@Service
public class PaymentService {

    private final ReservationClient reservationClient;
    private final InventoryClient inventoryClient;
    private final AuthClient authClient;
    private final PaymentRepository paymentRepo;

    public PaymentService(ReservationClient reservationClient,
                          InventoryClient inventoryClient,
                          AuthClient authClient,
                          PaymentRepository paymentRepo) {
        this.reservationClient = reservationClient;
        this.inventoryClient = inventoryClient;
        this.authClient = authClient;
        this.paymentRepo = paymentRepo;
    }

    // ================================
    // 💳 MAIN PAYMENT
    // ================================

    @Transactional
    public Payment processPayment(String pnrCode, String key, String token) {

        // 1. IDEMPOTENCY
        var existing = paymentRepo.findByIdempotencyKey(key);
        if (existing.isPresent()) return existing.get();

        // 2. USER VALIDATION
        UserDTO user = authClient.getUser(token);

        // 3. FETCH PNR
        PnrDTO pnr = reservationClient.getPNR(pnrCode);

        if (pnr == null) throw new RuntimeException("PNR not found");

        // 4. OWNER CHECK
        if (!pnr.getCreatedBy().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        // 5. STATUS CHECK
        if (!"HOLD".equalsIgnoreCase(pnr.getBookingStatus())) {
            throw new RuntimeException("Invalid PNR state");
        }

        // 6. CALCULATE
        double amount = calculateFare(pnr);

        // 7. SAVE INITIATED
        Payment payment = new Payment();
        payment.setPnrCode(pnrCode);
        payment.setAmount(amount);
        payment.setStatus(PaymentStatus.INITIATED);
        payment.setTransactionId(UUID.randomUUID().toString());
        payment.setIdempotencyKey(key);

        paymentRepo.save(payment);

        try {
            boolean success = mockGateway();

            if (success) {

                payment.setStatus(PaymentStatus.SUCCESS);

                reservationClient.confirmBooking(pnrCode);

                inventoryClient.confirmSeats(buildInventoryRequest(pnr));

            } else {

                payment.setStatus(PaymentStatus.FAILED);

                reservationClient.cancelBooking(pnrCode);

                inventoryClient.releaseSeats(buildInventoryRequest(pnr));
            }

        } catch (Exception e) {

            payment.setStatus(PaymentStatus.FAILED);

            reservationClient.cancelBooking(pnrCode);
            inventoryClient.releaseSeats(buildInventoryRequest(pnr));

            throw new RuntimeException("Payment failed");
        }

        return paymentRepo.save(payment);
    }

    // ================================
    // 🔁 RETRY
    // ================================

    public Payment retryPayment(String pnr, String token) {
        return processPayment(pnr, UUID.randomUUID().toString(), token);
    }

    // ================================
    // ❌ CANCEL
    // ================================

    public void cancelPayment(String pnr) {
        Payment payment = paymentRepo.findByPnrCode(pnr)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);
        paymentRepo.save(payment);

        reservationClient.cancelBooking(pnr);
    }

    // ================================
    // 🔍 FETCH APIs
    // ================================

    public Payment getById(Long id) {
        return paymentRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public Payment getByPnr(String pnr) {
        return paymentRepo.findByPnrCode(pnr)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    public String getStatus(Long id) {
        return getById(id).getStatus().name();
    }

    public Payment getByTransactionId(String txnId) {
        return paymentRepo.findAll()
                .stream()
                .filter(p -> txnId.equals(p.getTransactionId()))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    // ================================
    // 💰 FARE
    // ================================

    public double calculateFareByPnr(String pnrCode) {
        PnrDTO pnr = reservationClient.getPNR(pnrCode);
        return calculateFare(pnr);
    }

    public Map<String, Object> getFareBreakdown(String pnrCode) {

        PnrDTO pnr = reservationClient.getPNR(pnrCode);

        double base = pnr.getTotalAmount();
        double tax = base * 0.1;
        double fee = 200;

        Map<String, Object> map = new HashMap<>();
        map.put("baseFare", base);
        map.put("tax", tax);
        map.put("fee", fee);
        map.put("total", base + tax + fee);

        return map;
    }

    // ================================
    // 📊 ADMIN
    // ================================

    public List<Payment> getAllPayments() {
        return paymentRepo.findAll();
    }

    public List<Payment> getByStatus(String status) {
        return paymentRepo.findAll()
                .stream()
                .filter(p -> p.getStatus().name().equalsIgnoreCase(status))
                .toList();
    }

    public Map<String, Object> getSummary() {

        List<Payment> all = paymentRepo.findAll();

        double total = all.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCESS)
                .mapToDouble(Payment::getAmount)
                .sum();

        Map<String, Object> map = new HashMap<>();
        map.put("totalRevenue", total);
        map.put("totalTransactions", all.size());

        return map;
    }

    // ================================
    // 🔧 HELPERS
    // ================================

    private double calculateFare(PnrDTO pnr) {
        double base = pnr.getTotalAmount() != null ? pnr.getTotalAmount() : 5000;
        return base + (base * 0.1) + 200;
    }

    private boolean mockGateway() {
        return true;
    }

    private InventoryRequestDTO buildInventoryRequest(PnrDTO pnr) {

        InventoryRequestDTO req = new InventoryRequestDTO();
        req.setPnrCode(pnr.getPnrCode());

        // ✅ SAFE SEGMENT HANDLING
        if (pnr.getSegments() != null && !pnr.getSegments().isEmpty()) {
            if (pnr.getSegments().get(0) != null) {
                req.setFlightInstanceId(
                    (pnr.getSegments().get(0)).getFlightInstanceId()
                );
            }
        }

        // ✅ SAFE PASSENGER HANDLING
        if (pnr.getPassengers() != null && !pnr.getPassengers().isEmpty()) {

            List<String> seats = pnr.getPassengers().stream()
                    .filter(Objects::nonNull)
                    .map(PassengerDTO::getSeatNumber)   // 🔥 FIXED
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());      // 🔥 Java 8+ safe

            req.setSeatNumbers(seats);
        }

        return req;
    }
}