package com.clinic.repository;

import com.clinic.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface BillRepository extends JpaRepository<Bill, UUID> {
    List<Bill> findByPatientId(UUID patientId);

    List<Bill> findByStatus(Bill.BillStatus status);
}
