package com.example.scholartrack.repository;

import com.example.scholartrack.entity.Scheme;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SchemeRepository extends JpaRepository<Scheme, Long> {
}
