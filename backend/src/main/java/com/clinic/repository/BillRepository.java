package com.clinic.repository;

import com.clinic.model.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillRepository extends JpaRepository<Bill, Long> {

    List<Bill> findByPatientId(Long patientId);

    List<Bill> findByStatus(Bill.BillStatus status);
}
