package com.clinic.controller;

import com.clinic.model.Doctor;
import com.clinic.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorRepository doctorRepository;

    public DoctorController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable @NonNull UUID id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @SuppressWarnings("null")
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return Optional.ofNullable(doctorRepository.save(doctor))
                .orElseThrow(() -> new RuntimeException("Failed to save doctor"));
    }

    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable @NonNull UUID id, @RequestBody Doctor doctorDetails) {
        return doctorRepository.findById(id)
                .map(doctor -> {
                    doctor.setName(doctorDetails.getName());
                    doctor.setSpecialization(doctorDetails.getSpecialization());
                    doctor.setEmail(doctorDetails.getEmail());
                    doctor.setPhone(doctorDetails.getPhone());
                    doctor.setQualifications(doctorDetails.getQualifications());
                    doctor.setExperience(doctorDetails.getExperience());
                    doctor.setAvailability(doctorDetails.getAvailability());
                    return ResponseEntity.ok(
                            Optional.ofNullable(doctorRepository.save(doctor))
                                    .orElseThrow(() -> new RuntimeException("Failed to save doctor")));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable @NonNull UUID id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
