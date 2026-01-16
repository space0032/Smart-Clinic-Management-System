package com.clinic.controller;

import com.clinic.model.Doctor;
import com.clinic.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

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
    public ResponseEntity<Doctor> getDoctorById(@PathVariable UUID id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.created(URI.create("/api/doctors/" + savedDoctor.getId()))
                .body(savedDoctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable UUID id, @RequestBody Doctor doctor) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctor.setId(id);
        return ResponseEntity.ok(doctorRepository.save(doctor));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable UUID id) {
        if (!doctorRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        doctorRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
