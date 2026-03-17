package com.airline.auth_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.airline.auth_service.entity.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
}