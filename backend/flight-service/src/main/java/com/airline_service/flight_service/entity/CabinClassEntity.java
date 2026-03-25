package com.airline_service.flight_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cabin_class_config")
public class CabinClassEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="flight_id")
    private Long flightId;
    @Column(name="class_type")
    private String classType;
    @Column(name="base_price")
    private double basePrice;
    @Column(name="currency")
    private String currency;
    @Column(name="total_seats")
    private int totalSeats;
    @Column(name="available_seats")
    private int availableSeats;
    @Column(name="cabin_baggage")
    private String cabinBaggage;
    @Column(name="checked_baggage")
    private String checkedBaggage;

    // No-argument constructor
    public CabinClassEntity() {}

    // All-argument constructor
    public CabinClassEntity(Long id, Long flightId, String classType,
                            double basePrice, String currency,
                            int totalSeats, int availableSeats,
                            String cabinBaggage, String checkedBaggage) {
        this.id = id;
        this.flightId = flightId;
        this.classType = classType;
        this.basePrice = basePrice;
        this.currency = currency;
        this.totalSeats = totalSeats;
        this.availableSeats = availableSeats;
        this.cabinBaggage = cabinBaggage;
        this.checkedBaggage = checkedBaggage;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getFlightId() { return flightId; }
    public void setFlightId(Long flightId) { this.flightId = flightId; }

    public String getClassType() { return classType; }
    public void setClassType(String classType) { this.classType = classType; }

    public double getBasePrice() { return basePrice; }
    public void setBasePrice(double basePrice) { this.basePrice = basePrice; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public int getTotalSeats() { return totalSeats; }
    public void setTotalSeats(int totalSeats) { this.totalSeats = totalSeats; }

    public int getAvailableSeats() { return availableSeats; }
    public void setAvailableSeats(int availableSeats) { this.availableSeats = availableSeats; }

    public String getCabinBaggage() { return cabinBaggage; }
    public void setCabinBaggage(String cabinBaggage) { this.cabinBaggage = cabinBaggage; }

    public String getCheckedBaggage() { return checkedBaggage; }
    public void setCheckedBaggage(String checkedBaggage) { this.checkedBaggage = checkedBaggage; }
}
