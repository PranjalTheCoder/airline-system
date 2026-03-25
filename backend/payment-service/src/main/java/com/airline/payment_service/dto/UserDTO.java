package com.airline.payment_service.dto;

public class UserDTO {

    private Long id;
    private String email;
    private String role;

    // Default constructor (no-args)
    public UserDTO() {
    }

    // Parameterized constructor
    public UserDTO(Long id, String email, String role) {
        this.id = id;
        this.email = email;
        this.role = role;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
