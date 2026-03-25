package com.airline.reservation_service.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(Exception.class)
    public String handle(Exception ex) {
    	Map<String, Object> error = new HashMap<>();
        error.put("success", false);
        error.put("message", e.getMessage()); // ✅ show real error
        error.put("data", null);

        return error;    }
}