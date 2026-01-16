package com.clinic.controller;

import com.clinic.model.Appointment;
import com.clinic.model.Bill;
import com.clinic.model.Patient;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.BillRepository;
import com.clinic.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.net.URI;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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

    @GetMapping("/patient/{patientId}")
    public List<Bill> getBillsByPatient(@PathVariable UUID patientId) {
        // Ideally add findByPatientId to Repository
        // For prototype, filtering all (inefficient but works for small data)
        // or ensure Repository has the method.
        // I will assume standard JPA functionality or filter here if needed.
        // Better: let's stick to findAll for now to avoid compilation error if Repo is
        // missing the method
        // unless I am sure. I created BillRepository efficiently but didn't add
        // methods.
        // Let's rely on findAll and stream filter for safety in this iteration,
        // or just return all and filter in frontend.
        return billRepository.findAll().stream()
                .filter(b -> b.getPatient().getId().equals(patientId))
                .toList();
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody BillRequest request) {
        Patient patient = patientRepository.findById(request.patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Appointment appointment = appointmentRepository.findById(request.appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setAppointment(appointment);
        bill.setAmount(request.amount);
        bill.setStatus(Bill.BillStatus.PENDING);
        // paymentDate and method are null initially

        Bill saved = billRepository.save(bill);
        return ResponseEntity.created(URI.create("/api/bills/" + saved.getId()))
                .body(saved);
    }

    @PutMapping("/{id}/pay")
    public ResponseEntity<Bill> markAsPaid(@PathVariable UUID id, @RequestParam String method) {
        return billRepository.findById(id)
                .map(bill -> {
                    bill.setStatus(Bill.BillStatus.PAID);
                    bill.setPaymentDate(LocalDateTime.now());
                    bill.setPaymentMethod(method);
                    return ResponseEntity.ok(billRepository.save(bill));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    public static class BillRequest {
        public UUID patientId;
        public UUID appointmentId;
        public BigDecimal amount;
    }
}
