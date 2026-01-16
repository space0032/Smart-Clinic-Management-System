package com.clinic.repository;

import com.clinic.model.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    // Q8 Requirement: Method to retrieve patient by email
    Optional<Patient> findByEmail(String email);

    // Q8 Requirement: Method to retrieve patient by phone
    Optional<Patient> findByPhone(String phone);

    // Q8 Requirement: Method retrieves patient using either email or phone number
    @Query("SELECT p FROM Patient p WHERE p.email = :emailOrPhone OR p.phone = :emailOrPhone")
    Optional<Patient> findByEmailOrPhone(@Param("emailOrPhone") String emailOrPhone);

    // Search patients by name (case-insensitive)
    List<Patient> findByNameContainingIgnoreCase(String name);

    // Check if email exists
    boolean existsByEmail(String email);
}
