package com.example.scholartrack.repository;

import com.example.scholartrack.entity.Verification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VerificationRepository extends JpaRepository<Verification, Long> {

    Optional<Verification> findByApplicationId(Long applicationId);
}