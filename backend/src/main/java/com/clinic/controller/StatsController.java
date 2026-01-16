package com.clinic.controller;

import com.clinic.model.Bill;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.BillRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "http://localhost:5173")
public class StatsController {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;

    public StatsController(PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            BillRepository billRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.billRepository = billRepository;
    }

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();

        // Total Patients
        long totalPatients = patientRepository.count();
        stats.put("totalPatients", totalPatients);

        // Total Doctors
        long totalDoctors = doctorRepository.count();
        stats.put("totalDoctors", totalDoctors);

        // Appointments Today
        LocalDate today = LocalDate.now();
        long appointmentsToday = appointmentRepository.findAll().stream()
                .filter(a -> a.getAppointmentDate() != null && a.getAppointmentDate().toLocalDate().equals(today))
                .count();
        stats.put("appointmentsToday", appointmentsToday);

        // Pending Appointments (SCHEDULED status)
        long pendingAppointments = appointmentRepository.findAll().stream()
                .filter(a -> "SCHEDULED".equals(a.getStatus()))
                .count();
        stats.put("pendingAppointments", pendingAppointments);

        // Total Revenue (sum of PAID bills)
        BigDecimal totalRevenue = billRepository.findAll().stream()
                .filter(b -> b.getStatus() == Bill.BillStatus.PAID)
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        // Pending Bills Amount
        BigDecimal pendingBills = billRepository.findAll().stream()
                .filter(b -> b.getStatus() == Bill.BillStatus.PENDING)
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("pendingBills", pendingBills);

        return stats;
    }
}
