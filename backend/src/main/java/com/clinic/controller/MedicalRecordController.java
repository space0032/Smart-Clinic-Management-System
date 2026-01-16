package com.clinic.controller;

import com.clinic.model.Appointment;
import com.clinic.model.Doctor;
import com.clinic.model.MedicalRecord;
import com.clinic.model.Patient;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.MedicalRecordRepository;
import com.clinic.repository.PatientRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/medical-records")
@CrossOrigin(origins = "http://localhost:5173")
public class MedicalRecordController {

    private final MedicalRecordRepository medicalRecordRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;

    public MedicalRecordController(MedicalRecordRepository medicalRecordRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
    }

    @GetMapping
    public List<MedicalRecord> getAllMedicalRecords() {
        return medicalRecordRepository.findAll();
    }

    @GetMapping("/patient/{patientId}")
    public List<MedicalRecord> getRecordsByPatient(@PathVariable UUID patientId) {
        return medicalRecordRepository.findByPatientId(patientId);
    }

    @PostMapping
    public ResponseEntity<MedicalRecord> createMedicalRecord(@RequestBody MedicalRecordRequest request) {
        Patient patient = patientRepository.findById(request.patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
        Doctor doctor = doctorRepository.findById(request.doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        MedicalRecord record = new MedicalRecord();
        record.setPatient(patient);
        record.setDoctor(doctor);
        record.setDiagnosis(request.diagnosis);
        record.setPrescription(request.prescription);

        if (request.appointmentId != null) {
            Appointment appointment = appointmentRepository.findById(request.appointmentId)
                    .orElse(null); // Optional
            record.setAppointment(appointment);
        }

        MedicalRecord saved = medicalRecordRepository.save(record);
        return ResponseEntity.created(URI.create("/api/medical-records/" + saved.getId()))
                .body(saved);
    }

    public static class MedicalRecordRequest {
        public UUID patientId;
        public UUID doctorId;
        public UUID appointmentId;
        public String diagnosis;
        public String prescription;
    }
}
