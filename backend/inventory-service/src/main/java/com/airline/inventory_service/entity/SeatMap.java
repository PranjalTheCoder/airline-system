package com.airline.inventory_service.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "seat_maps",
       uniqueConstraints = @UniqueConstraint(columnNames = {"flight_id", "cabin_class"}))
public class SeatMap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "flight_id", nullable = false)
    private String flightId;

    @Column(name = "aircraft_model", nullable = false)
    private String aircraftModel;

    @Column(name = "cabin_class", nullable = false)
    private String cabinClass;

    @Column(name = "total_rows")
    private Integer totalRows;

    @Column(name = "seat_layout")
    private String seatLayout;

    @Column(name = "created_at")
    private java.sql.Timestamp createdAt;

    @Column(name = "updated_at")
    private java.sql.Timestamp updatedAt;

    @OneToMany(mappedBy = "seatMap", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SeatRow> rows;

    // Constructors
    public SeatMap() {}

    public SeatMap(String flightId, String aircraftModel, String cabinClass) {
        this.flightId = flightId;
        this.aircraftModel = aircraftModel;
        this.cabinClass = cabinClass;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFlightId() { return flightId; }
    public void setFlightId(String flightId) { this.flightId = flightId; }

    public String getAircraftModel() { return aircraftModel; }
    public void setAircraftModel(String aircraftModel) { this.aircraftModel = aircraftModel; }

    public String getCabinClass() { return cabinClass; }
    public void setCabinClass(String cabinClass) { this.cabinClass = cabinClass; }

    public Integer getTotalRows() { return totalRows; }
    public void setTotalRows(Integer totalRows) { this.totalRows = totalRows; }

    public String getSeatLayout() { return seatLayout; }
    public void setSeatLayout(String seatLayout) { this.seatLayout = seatLayout; }

    public java.sql.Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.sql.Timestamp createdAt) { this.createdAt = createdAt; }

    public java.sql.Timestamp getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(java.sql.Timestamp updatedAt) { this.updatedAt = updatedAt; }

    public List<SeatRow> getRows() { return rows; }
    public void setRows(List<SeatRow> rows) { this.rows = rows; }
}