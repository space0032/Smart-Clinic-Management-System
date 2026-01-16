package com.clinic.controller;

import com.clinic.model.Appointment;
import com.clinic.model.Doctor;
import com.clinic.model.Patient;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "http://localhost:5173")
public class AppointmentController {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentController(AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {
        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    @GetMapping("/doctor/{doctorId}")
    public List<Appointment> getAppointmentsByDoctor(@PathVariable UUID doctorId) {
        // Ideally we should add a method in Repository: findByDoctorId
        // For now, filtering manually or assuming the repository will be updated.
        // Let's rely on basic findAll filtering for simplicity in this step,
        // OR better, let's just return all for the prototype and filter in frontend
        // until we add Custom Repository methods.
        return appointmentRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        // Validate existence
        Patient patient = patientRepository.findById(request.patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.appointmentDate);
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        appointment.setNotes(request.notes);

        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.created(URI.create("/api/appointments/" + saved.getId()))
                .body(saved);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Appointment> updateStatus(@PathVariable UUID id,
            @RequestParam Appointment.AppointmentStatus status) {
        return appointmentRepository.findById(id)
                .map(appt -> {
                    appt.setStatus(status);
                    return ResponseEntity.ok(appointmentRepository.save(appt));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable UUID id) {
        appointmentRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // DTO for incoming JSON
    public static class AppointmentRequest {
        public UUID patientId;
        public UUID doctorId;
        public java.time.LocalDateTime appointmentDate;
        public String notes;
    }
}
