package com.airline.payment_service.event;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
public class PaymentProducer {

    private final KafkaTemplate<String, String> kafkaTemplate;

    public PaymentProducer(KafkaTemplate<String, String> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishSuccess(String pnr) {
        kafkaTemplate.send("payment-success", pnr);
    }

    public void publishFailure(String pnr) {
        kafkaTemplate.send("payment-failed", pnr);
    }

    public void publishRefund(String pnr) {
        kafkaTemplate.send("refund-initiated", pnr);
    }
}