package com.clinic.controller;

import com.clinic.model.Bill;
import com.clinic.model.Patient;
import com.clinic.model.Appointment;
import com.clinic.repository.BillRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.AppointmentRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/bills")
@CrossOrigin(origins = "http://localhost:5173")
public class BillController {

    private final BillRepository billRepository;
    private final PatientRepository patientRepository;
    private final AppointmentRepository appointmentRepository;

    public BillController(BillRepository billRepository,
            PatientRepository patientRepository,
            AppointmentRepository appointmentRepository) {
        this.billRepository = billRepository;
        this.patientRepository = patientRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Bill> getBillById(@PathVariable @NonNull UUID id) {
        return billRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody BillRequest request) {
        Patient patient = patientRepository.findById(Objects.requireNonNull(request.patientId)).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().build();
        }

        Appointment appointment = null;
        if (request.appointmentId != null) {
            appointment = appointmentRepository.findById(Objects.requireNonNull(request.appointmentId)).orElse(null);
        }

        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setAppointment(appointment);
        bill.setAmount(request.amount);
        bill.setStatus(request.status != null ? request.status : Bill.BillStatus.PENDING);
        bill.setIssueDate(LocalDateTime.now());
        bill.setDescription(request.description);

        return ResponseEntity.ok(
                Optional.ofNullable(billRepository.save(bill))
                        .orElseThrow(() -> new RuntimeException("Failed to save bill")));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable @NonNull UUID id, @RequestBody BillRequest request) {
        return billRepository.findById(id)
                .map(bill -> {
                    if (request.amount != null)
                        bill.setAmount(request.amount);
                    if (request.status != null) {
                        bill.setStatus(request.status);
                        if (request.status == Bill.BillStatus.PAID && bill.getPaymentDate() == null) {
                            bill.setPaymentDate(LocalDateTime.now());
                        }
                    }
                    if (request.description != null)
                        bill.setDescription(request.description);
                    return ResponseEntity.ok(
                            Optional.ofNullable(billRepository.save(bill))
                                    .orElseThrow(() -> new RuntimeException("Failed to save bill")));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable @NonNull UUID id) {
        if (billRepository.existsById(id)) {
            billRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DTO
    public static class BillRequest {
        public UUID patientId;
        public UUID appointmentId;
        public java.math.BigDecimal amount;
        public Bill.BillStatus status;
        public String description;
    }
}
