package com.clinic.repository;

import com.clinic.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DoctorRepository extends JpaRepository<Doctor, UUID> {
    List<Doctor> findByNameContainingIgnoreCase(String name);

    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}
