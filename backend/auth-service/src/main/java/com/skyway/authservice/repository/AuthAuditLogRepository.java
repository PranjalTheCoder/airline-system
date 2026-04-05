package com.skyway.authservice.repository;

import com.skyway.authservice.entity.AuthAuditLogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface AuthAuditLogRepository extends JpaRepository<AuthAuditLogEntity, UUID> {
}
