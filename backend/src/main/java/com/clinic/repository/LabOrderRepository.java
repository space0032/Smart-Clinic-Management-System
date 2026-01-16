package com.clinic.repository;

import com.clinic.model.LabOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface LabOrderRepository extends JpaRepository<LabOrder, UUID> {
    List<LabOrder> findByPatientId(UUID patientId);

    List<LabOrder> findByStatus(String status);
}
