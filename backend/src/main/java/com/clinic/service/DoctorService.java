package com.clinic.service;

import com.clinic.model.Doctor;
import com.clinic.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(UUID id) {
        return doctorRepository.findById(id);
    }

    public List<Doctor> getDoctorsBySpecialty(String specialty) {
        return doctorRepository.findBySpecialty(specialty);
    }

    public List<Doctor> getAvailableDoctors() {
        return doctorRepository.findByAvailable(true);
    }

    public List<Doctor> searchDoctorsByName(String name) {
        return doctorRepository.findByNameContainingIgnoreCase(name);
    }

    public Doctor createDoctor(Doctor doctor) {
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(UUID id, Doctor doctorDetails) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctorDetails.getName() != null)
            doctor.setName(doctorDetails.getName());
        if (doctorDetails.getEmail() != null)
            doctor.setEmail(doctorDetails.getEmail());
        if (doctorDetails.getPhone() != null)
            doctor.setPhone(doctorDetails.getPhone());
        if (doctorDetails.getSpecialty() != null)
            doctor.setSpecialty(doctorDetails.getSpecialty());
        doctor.setAvailable(doctorDetails.isAvailable());

        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(UUID id) {
        doctorRepository.deleteById(id);
    }

    public void setDoctorAvailability(UUID id, boolean available) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setAvailable(available);
        doctorRepository.save(doctor);
    }

    public long getDoctorCount() {
        return doctorRepository.count();
    }

    public Doctor getDoctorWithMostAppointments() {
        // This would require a custom query joining with appointments
        return doctorRepository.findAll().stream().findFirst().orElse(null);
    }
}
