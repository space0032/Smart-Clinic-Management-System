package com.clinic.controller;

import com.clinic.model.Prescription;
import com.clinic.model.Patient;
import com.clinic.model.Doctor;
import com.clinic.repository.PrescriptionRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<Prescription> getPrescriptionById(@PathVariable UUID id) {
        return prescriptionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public List<Prescription> getPrescriptionsByPatient(@PathVariable UUID patientId) {
        return prescriptionRepository.findByPatientId(patientId);
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Prescription> getPrescriptionsByDoctor(@PathVariable UUID doctorId) {
        return prescriptionRepository.findByDoctorId(doctorId);
    }

    @PostMapping
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionRequest request) {
        Patient patient = patientRepository.findById(request.patientId).orElse(null);
        Doctor doctor = doctorRepository.findById(request.doctorId).orElse(null);

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
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prescription> updatePrescription(@PathVariable UUID id,
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
                    return ResponseEntity.ok(prescriptionRepository.save(prescription));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrescription(@PathVariable UUID id) {
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
