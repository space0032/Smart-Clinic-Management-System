package com.clinic.controller;

import com.clinic.model.Patient;
import com.clinic.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientRepository patientRepository;

    public PatientController(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    @GetMapping
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public List<Patient> searchPatients(@RequestParam String name) {
        return patientRepository.findByNameContainingIgnoreCase(name);
    }

    @PostMapping
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        return patientRepository.findById(id)
                .map(patient -> {
                    if (patientDetails.getName() != null)
                        patient.setName(patientDetails.getName());
                    if (patientDetails.getEmail() != null)
                        patient.setEmail(patientDetails.getEmail());
                    if (patientDetails.getPhone() != null)
                        patient.setPhone(patientDetails.getPhone());
                    if (patientDetails.getDob() != null)
                        patient.setDob(patientDetails.getDob());
                    if (patientDetails.getAddress() != null)
                        patient.setAddress(patientDetails.getAddress());
                    if (patientDetails.getGender() != null)
                        patient.setGender(patientDetails.getGender());
                    return ResponseEntity.ok(patientRepository.save(patient));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable Long id) {
        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
