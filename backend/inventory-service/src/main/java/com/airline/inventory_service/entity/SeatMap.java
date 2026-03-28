package com.airline.inventory_service.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

    @Entity
    @Table(name = "seat_maps",
    uniqueConstraints = @UniqueConstraint(columnNames = {"flight_id", "cabin_class"}))
public class SeatMap {

 @Id
 @GeneratedValue(strategy = GenerationType.IDENTITY)
 private Long id;

 @Column(name = "flight_id")
 private String flightId;

 @Column(name = "aircraft_model")
 private String aircraftModel;

 @Column(name = "cabin_class")
 private String cabinClass;

 @Column(name = "total_rows")
 private Integer totalRows;

 @Column(name = "seat_layout")
 private String seatLayout;

 // --- Constructors ---
 public SeatMap() {
     // Default constructor required by JPA
 }

 public SeatMap(String flightId, String aircraftModel, String cabinClass,
                Integer totalRows, String seatLayout) {
     this.flightId = flightId;
     this.aircraftModel = aircraftModel;
     this.cabinClass = cabinClass;
     this.totalRows = totalRows;
     this.seatLayout = seatLayout;
 }

 // --- Getters and Setters ---
 public Long getId() {
     return id;
 }

 public void setId(Long id) {
     this.id = id;
 }

 public String getFlightId() {
     return flightId;
 }

 public void setFlightId(String flightId) {
     this.flightId = flightId;
 }

 public String getAircraftModel() {
     return aircraftModel;
 }

 public void setAircraftModel(String aircraftModel) {
     this.aircraftModel = aircraftModel;
 }

 public String getCabinClass() {
     return cabinClass;
 }

 public void setCabinClass(String cabinClass) {
     this.cabinClass = cabinClass;
 }

 public Integer getTotalRows() {
     return totalRows;
 }

 public void setTotalRows(Integer totalRows) {
     this.totalRows = totalRows;
 }

 public String getSeatLayout() {
     return seatLayout;
 }

 public void setSeatLayout(String seatLayout) {
     this.seatLayout = seatLayout;
 }
}