package com.airline.payment_service.client;

import com.airline.payment_service.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;

@FeignClient(
        name = "auth-service",
        url = "${services.auth}"
)
public interface AuthClient {

    // OPTIONAL: Only if you want validation via Auth Service
    @PostMapping("/api/auth/validate")
    Boolean validateJWT(@RequestHeader("Authorization") String token);

    // OPTIONAL: Fetch user details
    @GetMapping("/api/auth/me")
    UserDTO getUser(@RequestHeader("Authorization") String token);
}