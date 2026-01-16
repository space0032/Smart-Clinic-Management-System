package com.clinic.controller;

import com.clinic.model.Patient;
import com.clinic.model.User;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientController(PatientRepository patientRepository, UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable @NonNull UUID id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        Patient savedPatient = Optional.ofNullable(patientRepository.save(patient))
                .orElseThrow(() -> new RuntimeException("Failed to save patient"));

        // Auto-create User account for Patient
        if (patient.getEmail() != null && !patient.getEmail().isEmpty()) {
            try {
                // Check if user already exists
                // Note: In real app, handle duplicate email gracefully.
                // Here we just attempt create.
                User newUser = new User();
                newUser.setEmail(patient.getEmail());
                newUser.setName(patient.getName());
                newUser.setPassword("Patient123"); // Default password
                newUser.setRole("PATIENT");
                userRepository.save(newUser);
            } catch (Exception e) {
                // Log error but don't fail patient creation?
                // Or maybe we should? For now, we print stack trace.
                System.err.println("Failed to create user account for patient: " + e.getMessage());
            }
        }

        return savedPatient;
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable @NonNull UUID id, @RequestBody Patient patientDetails) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setName(patientDetails.getName());
                    patient.setAge(patientDetails.getAge());
                    patient.setGender(patientDetails.getGender());
                    patient.setEmail(patientDetails.getEmail());
                    patient.setPhone(patientDetails.getPhone());
                    patient.setAddress(patientDetails.getAddress());
                    patient.setDateOfBirth(patientDetails.getDateOfBirth());
                    patient.setMedicalHistory(patientDetails.getMedicalHistory());
                    patient.setBloodGroup(patientDetails.getBloodGroup());
                    return ResponseEntity.ok(
                            Optional.ofNullable(patientRepository.save(patient))
                                    .orElseThrow(() -> new RuntimeException("Failed to save patient")));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable @NonNull UUID id) {
        return patientRepository.findById(id).map(patient -> {
            // Delete associated User account if exists
            if (patient.getEmail() != null) {
                userRepository.findByEmail(patient.getEmail())
                        .ifPresent(user -> {
                            try {
                                userRepository.delete(user);
                            } catch (Exception e) {
                                System.err.println(
                                        "Warning: Failed to delete associated user account: " + e.getMessage());
                            }
                        });
            }

            // Delete patient (Cascades to Appointments, MedicalRecords, etc.)
            patientRepository.delete(patient);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
