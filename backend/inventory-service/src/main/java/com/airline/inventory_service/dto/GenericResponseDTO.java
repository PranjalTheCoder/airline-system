package com.airline.inventory_service.dto;

public class GenericResponseDTO {

    private boolean success;
    private String message;

    // Default constructor
    public GenericResponseDTO() {
    }

    // Parameterized constructor
    public GenericResponseDTO(boolean success, String message) {
        this.success = success;
        this.message = message;
    }

    // Getter and Setter for success
    public boolean isSuccess() {
        return success;
    }
    public void setSuccess(boolean success) {
        this.success = success;
    }

    // Getter and Setter for message
    public String getMessage() {
        return message;
    }
    public void setMessage(String message) {
        this.message = message;
    }
}
