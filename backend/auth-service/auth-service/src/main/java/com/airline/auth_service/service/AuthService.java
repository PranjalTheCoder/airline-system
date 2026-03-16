package com.airline.auth_service.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.airline.auth_service.config.JwtService;
import com.airline.auth_service.dto.LoginRequest;
import com.airline.auth_service.dto.RegisterRequest;
import com.airline.auth_service.entity.Permission;
import com.airline.auth_service.entity.Role;
import com.airline.auth_service.entity.User;
import com.airline.auth_service.repository.PermissionRepository;
import com.airline.auth_service.repository.RoleRepository;
import com.airline.auth_service.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private JwtService jwtService;

    public String login(LoginRequest request){

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.getPassword().equals(request.getPassword())){
            throw new RuntimeException("Invalid password");
        }

        return jwtService.generateToken(user.getUsername());
    }

    public void register(RegisterRequest request){

        Optional<User> existingUser = userRepository.findByUsername(request.getUsername());

        if(existingUser.isPresent()){
            throw new RuntimeException("Username already exists");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());

        userRepository.save(user);
    }
    public String refreshToken(String username){
        return jwtService.generateToken(username);
    }

    public void forgotPassword(String email){
        // send email logic
    }

    public void resetPassword(String email,String password){

        User user = userRepository.findByEmail(email).orElseThrow();

        user.setPassword(password);

        userRepository.save(user);
    }

    public User getProfile(String username){
        return userRepository.findByUsername(username).orElseThrow();
    }

    public void updateProfile(User user){
        userRepository.save(user);
    }

    public List<Role> getRoles(){
        return roleRepository.findAll();
    }

    public List<Permission> getPermissions(){
        return permissionRepository.findAll();
    }
}