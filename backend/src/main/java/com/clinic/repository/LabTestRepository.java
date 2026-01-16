package com.clinic.repository;

import com.clinic.model.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import java.util.Optional;

public interface LabTestRepository extends JpaRepository<LabTest, UUID> {
    Optional<LabTest> findByCode(String code);
}
