package com.clinic.repository;

import com.clinic.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Q8 Requirement: Method to retrieve patient by email
    Optional<Patient> findByEmail(String email);

    // Search patients by name (case-insensitive)
    List<Patient> findByNameContainingIgnoreCase(String name);

    // Check if email exists
    boolean existsByEmail(String email);
}
