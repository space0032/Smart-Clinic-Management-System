package com.clinic.controller;

import com.clinic.model.Bill;
import com.clinic.model.Appointment;
import com.clinic.model.Patient;
import com.clinic.repository.BillRepository;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
    public ResponseEntity<Bill> getBillById(@PathVariable Long id) {
        return billRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Bill> getBillsByPatient(@PathVariable Long patientId) {
        return billRepository.findByPatientId(patientId);
    }

    @PostMapping
    public ResponseEntity<Bill> createBill(@RequestBody BillRequest request) {
        Patient patient = patientRepository.findById(request.patientId).orElse(null);
        if (patient == null) {
            return ResponseEntity.badRequest().build();
        }

        Appointment appointment = null;
        if (request.appointmentId != null) {
            appointment = appointmentRepository.findById(request.appointmentId).orElse(null);
        }

        Bill bill = new Bill();
        bill.setPatient(patient);
        bill.setAppointment(appointment);
        bill.setAmount(request.amount);
        bill.setDescription(request.description);
        bill.setStatus(Bill.BillStatus.PENDING);

        Bill saved = billRepository.save(bill);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Bill> updateBill(@PathVariable Long id, @RequestBody BillRequest request) {
        return billRepository.findById(id)
                .map(bill -> {
                    if (request.amount != null)
                        bill.setAmount(request.amount);
                    if (request.description != null)
                        bill.setDescription(request.description);
                    if (request.status != null) {
                        bill.setStatus(Bill.BillStatus.valueOf(request.status));
                        if (request.status.equals("PAID")) {
                            bill.setPaymentDate(LocalDateTime.now());
                        }
                    }
                    return ResponseEntity.ok(billRepository.save(bill));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBill(@PathVariable Long id) {
        if (billRepository.existsById(id)) {
            billRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DTO
    public static class BillRequest {
        public Long patientId;
        public Long appointmentId;
        public BigDecimal amount;
        public String description;
        public String status;
    }
}
