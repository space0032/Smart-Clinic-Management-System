package com.clinic.controller;

import com.clinic.model.Doctor;
import com.clinic.repository.DoctorRepository;
import com.clinic.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "http://localhost:5173")
public class DoctorController {

    private final DoctorRepository doctorRepository;
    private final TokenService tokenService;

    public DoctorController(DoctorRepository doctorRepository, TokenService tokenService) {
        this.doctorRepository = doctorRepository;
        this.tokenService = tokenService;
    }

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(@PathVariable Long id) {
        return doctorRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/specialty/{specialty}")
    public List<Doctor> getDoctorsBySpecialty(@PathVariable String specialty) {
        return doctorRepository.findBySpecialty(specialty);
    }

    @GetMapping("/available")
    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailable(true);
    }

    // Q5 Requirement: Get doctor's availability with token validation
    @GetMapping("/availability/{user}/{doctorId}/{date}/{token}")
    public ResponseEntity<Map<String, Object>> getDoctorAvailability(
            @PathVariable String user,
            @PathVariable Long doctorId,
            @PathVariable String date,
            @PathVariable String token) {

        // Validate token
        if (!tokenService.validateToken(token)) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid or expired token"));
        }

        // Find doctor
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Doctor doctor = doctorOpt.get();
        LocalDate requestedDate = LocalDate.parse(date);

        // Generate available time slots (9 AM to 5 PM, hourly slots)
        List<Map<String, Object>> availableSlots = new ArrayList<>();
        for (int hour = 9; hour < 17; hour++) {
            LocalDateTime slotTime = LocalDateTime.of(requestedDate, LocalTime.of(hour, 0));
            availableSlots.add(Map.of(
                    "time", slotTime.toString(),
                    "available", doctor.isAvailable()));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "doctorId", doctorId,
                "doctorName", doctor.getName(),
                "date", date,
                "slots", availableSlots));
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        return doctorRepository.findById(id)
                .map(doctor -> {
                    if (doctorDetails.getName() != null)
                        doctor.setName(doctorDetails.getName());
                    if (doctorDetails.getEmail() != null)
                        doctor.setEmail(doctorDetails.getEmail());
                    if (doctorDetails.getPhone() != null)
                        doctor.setPhone(doctorDetails.getPhone());
                    if (doctorDetails.getSpecialty() != null)
                        doctor.setSpecialty(doctorDetails.getSpecialty());
                    doctor.setAvailable(doctorDetails.isAvailable());
                    return ResponseEntity.ok(doctorRepository.save(doctor));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDoctor(@PathVariable Long id) {
        if (doctorRepository.existsById(id)) {
            doctorRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}
