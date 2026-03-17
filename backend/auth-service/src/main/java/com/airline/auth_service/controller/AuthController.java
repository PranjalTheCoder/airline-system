package com.airline.auth_service.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.airline.auth_service.dto.AuthResponse;
import com.airline.auth_service.dto.LoginRequest;
import com.airline.auth_service.dto.RegisterRequest;
import com.airline.auth_service.dto.ResetPasswordRequest;
import com.airline.auth_service.entity.Permission;
import com.airline.auth_service.entity.Role;
import com.airline.auth_service.entity.User;
import com.airline.auth_service.service.AuthService;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin("*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request){

        authService.register(request);
        return ResponseEntity.ok("User registered successfully");
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request){

        String token = authService.login(request);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    // LOGOUT
    @PostMapping("/logout")
    public ResponseEntity<?> logout(){
        return ResponseEntity.ok("User logged out");
    }

    // REFRESH TOKEN
    @PostMapping("/refresh-token")
    public ResponseEntity<AuthResponse> refreshToken(@RequestParam String username){

        String token = authService.refreshToken(username);

        return ResponseEntity.ok(new AuthResponse(token));
    }

    // FORGOT PASSWORD
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email){

        authService.forgotPassword(email);

        return ResponseEntity.ok("Password reset email sent");
    }

    // RESET PASSWORD
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request){

        authService.resetPassword(request);

        return ResponseEntity.ok("Password reset successful");
    }

    // PROFILE
    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(@RequestParam String username){

        return ResponseEntity.ok(authService.getProfile(username));
    }

    // UPDATE PROFILE
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User user){

        authService.updateProfile(user);

        return ResponseEntity.ok("Profile updated");
    }

    // ROLES
    @GetMapping("/roles")
    public ResponseEntity<List<Role>> getRoles(){
        return ResponseEntity.ok(authService.getRoles());
    }


    // PERMISSIONS
    @GetMapping("/permissions")
    public ResponseEntity<List<Permission>> getPermissions(){
        return ResponseEntity.ok(authService.getPermissions());
    }
}