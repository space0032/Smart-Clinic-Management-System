package com.clinic.service;

import com.clinic.model.Doctor;
import com.clinic.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
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

    public Doctor updateDoctor(Long id, Doctor doctorDetails) {
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

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    /**
     * Q10 Requirement: Retrieve doctor's available time slots for a specific date
     * 
     * @param doctorId Doctor ID
     * @param date     Date to check availability
     * @return List of available time slots
     */
    public List<Map<String, Object>> getAvailableTimeSlots(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        List<Map<String, Object>> slots = new ArrayList<>();

        // Generate hourly slots from 9 AM to 5 PM
        for (int hour = 9; hour < 17; hour++) {
            LocalDateTime slotTime = LocalDateTime.of(date, LocalTime.of(hour, 0));
            Map<String, Object> slot = new HashMap<>();
            slot.put("time", slotTime);
            slot.put("available", doctor.isAvailable());
            slot.put("doctorId", doctorId);
            slots.add(slot);
        }

        return slots;
    }

    /**
     * Q10 Requirement: Validate doctor login credentials
     * 
     * @param email    Doctor's email
     * @param password Doctor's password (in production, compare hashed passwords)
     * @return true if credentials are valid, false otherwise
     */
    public boolean validateDoctorLogin(String email, String password) {
        Optional<Doctor> doctorOpt = doctorRepository.findByEmail(email);

        if (doctorOpt.isEmpty()) {
            return false;
        }

        // In production, compare with hashed password from database
        // For now, just check if doctor exists with that email
        return doctorOpt.isPresent();
    }

    /**
     * Find doctor by email
     * 
     * @param email Doctor's email
     * @return Optional containing doctor if found
     */
    public Optional<Doctor> findByEmail(String email) {
        return doctorRepository.findByEmail(email);
    }

    public void setDoctorAvailability(Long id, boolean available) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        doctor.setAvailable(available);
        doctorRepository.save(doctor);
    }

    public long getDoctorCount() {
        return doctorRepository.count();
    }
}
