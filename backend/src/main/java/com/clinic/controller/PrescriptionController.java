package com.clinic.controller;

import com.clinic.model.Prescription;
import com.clinic.model.Patient;
import com.clinic.model.Doctor;
import com.clinic.repository.PrescriptionRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.DoctorRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins = "http://localhost:5173")
public class PrescriptionController {

    private final PrescriptionRepository prescriptionRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public PrescriptionController(PrescriptionRepository prescriptionRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {
        this.prescriptionRepository = prescriptionRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Prescription> getAllPrescriptions() {
        return prescriptionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable Long id) {
        return prescriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable Long patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Prescription> getPrescriptionsByDoctor(@PathVariable Long doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    // Q7 Requirement: POST with @Valid and structured response
    @PostMapping
    public ResponseEntity<Map<String, String>> createPrescription(@Valid @RequestBody PrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.patientId).orElse(null);
        Doctor doctor = doctorRepository.findById(request.doctorId).orElse(null);

        if (patient == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Patient not found"));
        }

        if (doctor == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "status", "error",
                    "message", "Doctor not found"));
        }

        Prescription prescription = new Prescription();
        prescription.setPatient(patient);
        prescription.setDoctor(doctor);
        prescription.setDiagnosis(request.diagnosis);
        prescription.setMedications(request.medications);
        prescription.setInstructions(request.instructions);
        prescription.setPrescribedDate(LocalDateTime.now());
        prescription.setValidUntil(LocalDateTime.now().plusDays(request.validDays != null ? request.validDays : 30));
        prescription.setStatus("ACTIVE");

        prescriptionRepository.save(prescription);

        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Prescription created successfully"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, String>> updatePrescription(@PathVariable Long id,
            @Valid @RequestBody PrescriptionRequest request) {
        return prescriptionRepository.findById(id)
                .map(prescription -> {
                    if (request.diagnosis != null)
                        prescription.setDiagnosis(request.diagnosis);
                    if (request.medications != null)
                        prescription.setMedications(request.medications);
                    if (request.instructions != null)
                        prescription.setInstructions(request.instructions);
                    if (request.status != null)
                        prescription.setStatus(request.status);
                    prescriptionRepository.save(prescription);
                    return ResponseEntity.ok(Map.of(
                            "status", "success",
                            "message", "Prescription updated successfully"));
                })
                .orElse(ResponseEntity.badRequest().body(Map.of(
                        "status", "error",
                        "message", "Prescription not found")));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deletePrescription(@PathVariable Long id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "Prescription deleted successfully"));
        }
        return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Prescription not found"));
    }

    // DTO with validation
    public static class PrescriptionRequest {
        @NotNull(message = "Patient ID is required")
        public Long patientId;

        @NotNull(message = "Doctor ID is required")
        public Long doctorId;

        public String diagnosis;

        @NotBlank(message = "Medications are required")
        public String medications;

        public String instructions;
        public Integer validDays;
        public String status;
    }
}
