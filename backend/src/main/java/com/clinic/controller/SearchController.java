package com.clinic.controller;

import com.clinic.model.Doctor;
import com.clinic.model.Patient;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/search")
@CrossOrigin(origins = "http://localhost:5173")
public class SearchController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public SearchController(PatientRepository patientRepository, DoctorRepository doctorRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    @GetMapping
    public Map<String, Object> search(@RequestParam String query) {
        Map<String, Object> results = new HashMap<>();

        if (query == null || query.trim().isEmpty()) {
            return results;
        }

        List<Patient> patients = patientRepository.findByNameContainingIgnoreCase(query);
        List<Doctor> doctors = doctorRepository.findByNameContainingIgnoreCase(query);
        List<Doctor> specialists = doctorRepository.findBySpecializationContainingIgnoreCase(query);

        // Merge doctors results to avoid duplicates if name and specialization match
        // Or just return meaningful categories

        results.put("patients", patients);
        results.put("doctors", doctors);

        // If query matches specialization, include those too (could be separate or
        // merged)
        // For simplicity, let's add a "specialists" list or merge into doctors if we
        // handle duplicates (Set)
        // Let's keep it separate for UI clarity: "Doctors matching Name" vs "Doctors in
        // Specialization"
        results.put("specialists", specialists);

        return results;
    }
}
