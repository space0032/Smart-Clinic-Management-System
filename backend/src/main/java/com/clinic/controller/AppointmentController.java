package com.clinic.controller;

import com.clinic.model.Appointment;
import com.clinic.model.Patient;
import com.clinic.model.Doctor;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.PatientRepository;
import com.clinic.repository.DoctorRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;
import java.util.Objects;
import java.util.Optional;

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

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointmentById(@PathVariable @NonNull UUID id) {
        return appointmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Appointment> createAppointment(@RequestBody AppointmentRequest request) {
        Patient patient = patientRepository.findById(Objects.requireNonNull(request.patientId)).orElse(null);
        Doctor doctor = doctorRepository.findById(Objects.requireNonNull(request.doctorId)).orElse(null);

        if (patient == null || doctor == null) {
            return ResponseEntity.badRequest().build();
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.appointmentDate);
        appointment.setStatus(request.status != null ? request.status : "SCHEDULED");
        appointment.setReason(request.reason);
        appointment.setNotes(request.notes);

        return ResponseEntity.ok(
                Optional.ofNullable(appointmentRepository.save(appointment))
                        .orElseThrow(() -> new RuntimeException("Failed to save appointment")));
    }

    @PutMapping("/{id}")
    @SuppressWarnings("null")
    public ResponseEntity<Appointment> updateAppointment(@PathVariable @NonNull UUID id,
            @RequestBody AppointmentRequest request) {
        return appointmentRepository.findById(id)
                .map(appointment -> {
                    if (request.appointmentDate != null)
                        appointment.setAppointmentDate(request.appointmentDate);
                    if (request.status != null)
                        appointment.setStatus(request.status);
                    if (request.reason != null)
                        appointment.setReason(request.reason);
                    if (request.notes != null)
                        appointment.setNotes(request.notes);
                    return ResponseEntity.ok(
                            Optional.ofNullable(appointmentRepository.save(appointment))
                                    .orElseThrow(() -> new RuntimeException("Failed to save appointment")));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAppointment(@PathVariable @NonNull UUID id) {
        if (appointmentRepository.existsById(id)) {
            appointmentRepository.deleteById(id);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    // DTO
    public static class AppointmentRequest {
        public UUID patientId;
        public UUID doctorId;
        public java.time.LocalDateTime appointmentDate;
        public String status;
        public String reason;
        public String notes;
    }
}
