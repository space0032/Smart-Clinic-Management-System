package com.clinic.controller;

import com.clinic.model.*;
import com.clinic.repository.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/lab")
@CrossOrigin(origins = "http://localhost:5173")
public class LabController {

    private final LabTestRepository labTestRepository;
    private final LabOrderRepository labOrderRepository;
    private final LabResultRepository labResultRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public LabController(LabTestRepository labTestRepository,
            LabOrderRepository labOrderRepository,
            LabResultRepository labResultRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {
        this.labTestRepository = labTestRepository;
        this.labOrderRepository = labOrderRepository;
        this.labResultRepository = labResultRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // --- Lab Tests (Catalog) ---

    @GetMapping("/tests")
    public List<LabTest> getAllTests() {
        return labTestRepository.findAll();
    }

    @PostMapping("/tests")
    public LabTest createTest(@RequestBody LabTest labTest) {
        return labTestRepository.save(labTest);
    }

    // --- Lab Orders ---

    @GetMapping("/orders")
    public List<LabOrder> getAllOrders(@RequestParam(required = false) String status) {
        if (status != null) {
            return labOrderRepository.findByStatus(status);
        }
        return labOrderRepository.findAll();
    }

    @GetMapping("/orders/patient/{patientId}")
    public List<LabOrder> getOrdersByPatient(@PathVariable UUID patientId) {
        return labOrderRepository.findByPatientId(patientId);
    }

    @PostMapping("/orders")
    public ResponseEntity<?> createOrder(@RequestBody OrderRequest request) {
        if (request.patientId == null || request.doctorId == null) {
            System.out.println("Error: Missing Patient ID or Doctor ID");
            return ResponseEntity.badRequest().body("Patient ID and Doctor ID are required");
        }

        Optional<Patient> patient = patientRepository.findById(request.patientId);
        Optional<Doctor> doctor = doctorRepository.findById(request.doctorId);

        if (patient.isEmpty() || doctor.isEmpty()) {
            System.out.println("Error: Patient or Doctor not found");
            return ResponseEntity.badRequest().body("Invalid Patient ID or Doctor ID");
        }

        LabOrder order = new LabOrder();
        order.setPatient(patient.get());
        order.setDoctor(doctor.get());
        order.setStatus("PENDING");
        order.setNotes(request.notes);
        // orderDate is set by @PrePersist

        return ResponseEntity.ok(labOrderRepository.save(order));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<LabOrder> updateOrderStatus(@PathVariable UUID id, @RequestBody String status) {
        return labOrderRepository.findById(id)
                .map(order -> {
                    order.setStatus(status);
                    return ResponseEntity.ok(labOrderRepository.save(order));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // --- Lab Results ---

    @GetMapping("/results/{orderId}")
    public List<LabResult> getResultsByOrder(@PathVariable UUID orderId) {
        return labResultRepository.findByLabOrderId(orderId);
    }

    @PostMapping("/results")
    public ResponseEntity<LabResult> addResult(@RequestBody ResultRequest request) {
        Optional<LabOrder> order = labOrderRepository.findById(request.labOrderId);
        if (order.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        LabResult result = new LabResult();
        result.setLabOrder(order.get());
        result.setTestName(request.testName);
        result.setResultValue(request.resultValue);
        result.setUnit(request.unit);
        result.setReferenceRange(request.referenceRange);
        result.setAbnormal(request.isAbnormal);
        result.setRemarks(request.remarks);

        return ResponseEntity.ok(labResultRepository.save(result));
    }

    // DTOs
    public static class OrderRequest {
        public UUID patientId;
        public UUID doctorId;
        public String notes;
    }

    public static class ResultRequest {
        public UUID labOrderId;
        public String testName;
        public String resultValue;
        public String unit;
        public String referenceRange;
        public boolean isAbnormal;
        public String remarks;
    }
}
