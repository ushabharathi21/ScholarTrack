package com.example.scholartrack.repository;

import com.example.scholartrack.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
}