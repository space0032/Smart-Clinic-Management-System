package com.clinic.controller;

import com.clinic.model.Prescription;
import com.clinic.model.Patient;
import com.clinic.model.Doctor;
import com.clinic.repository.PrescriptionRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.Objects;
import java.util.Optional;

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
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable @NonNull UUID id) {
        return prescriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable @NonNull UUID patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Prescription> getPrescriptionsByDoctor(@PathVariable @NonNull UUID doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionRequest request) {
        Patient patient = patientRepository.findById(Objects.requireNonNull(request.patientId)).orElse(null);
        Doctor doctor = doctorRepository.findById(Objects.requireNonNull(request.doctorId)).orElse(null);

        if (patient == null || doctor == null) {
            return ResponseEntity.badRequest().build();
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

        Prescription saved = prescriptionRepository.save(prescription);
        return ResponseEntity.ok(
                Optional.ofNullable(saved)
                        .orElseThrow(() -> new RuntimeException("Failed to save prescription")));
    }

    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable @NonNull UUID id,
            @RequestBody PrescriptionRequest request) {
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
                    return ResponseEntity.ok(
                            Optional.ofNullable(prescriptionRepository.save(prescription))
                                    .orElseThrow(() -> new RuntimeException("Failed to save prescription")));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable @NonNull UUID id) {
        if (prescriptionRepository.existsById(id)) {
            prescriptionRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DTO
    public static class PrescriptionRequest {
        public UUID patientId;
        public UUID doctorId;
        public String diagnosis;
        public String medications;
        public String instructions;
        public Integer validDays;
        public String status;
    }
}
