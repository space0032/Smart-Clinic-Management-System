package com.clinic.repository;

import com.clinic.model.LabResult;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LabResultRepository extends JpaRepository<LabResult, UUID> {
    List<LabResult> findByLabOrderId(UUID labOrderId);
}
