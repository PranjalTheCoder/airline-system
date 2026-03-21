package com.airline.reservation_service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "pnr_contacts")
public class PnrContact {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String phone;

    @ManyToOne
    @JoinColumn(name = "pnr_id")
    private Pnr pnr;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public Pnr getPnr() { return pnr; }
    public void setPnr(Pnr pnr) { this.pnr = pnr; }
}