package com.airline.admin_service.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.airline.admin_service.entity.AdminStats;

public interface AdminStatsRepository extends JpaRepository<AdminStats, Long> {
}