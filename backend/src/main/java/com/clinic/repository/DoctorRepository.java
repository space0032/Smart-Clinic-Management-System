package com.clinic.repository;

import com.clinic.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {

    // Find doctors by specialty
    List<Doctor> findBySpecialty(String specialty);

    // Find available doctors
    List<Doctor> findByAvailable(boolean available);

    // Search doctors by name (case-insensitive)
    List<Doctor> findByNameContainingIgnoreCase(String name);

    // Q10 Requirement: Find doctor by email for login validation
    Optional<Doctor> findByEmail(String email);
}
