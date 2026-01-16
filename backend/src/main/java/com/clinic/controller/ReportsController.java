package com.clinic.controller;

import com.clinic.model.Appointment;
import com.clinic.model.Bill;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.BillRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportsController {

        private final PatientRepository patientRepository;
        private final DoctorRepository doctorRepository;
        private final AppointmentRepository appointmentRepository;
        private final BillRepository billRepository;

        public ReportsController(PatientRepository patientRepository,
                        DoctorRepository doctorRepository,
                        AppointmentRepository appointmentRepository,
                        BillRepository billRepository) {
                this.patientRepository = patientRepository;
                this.doctorRepository = doctorRepository;
                this.appointmentRepository = appointmentRepository;
                this.billRepository = billRepository;
        }

        @GetMapping("/analytics")
        public Map<String, Object> getAnalytics() {
                Map<String, Object> analytics = new HashMap<>();

                // Basic counts
                analytics.put("totalPatients", patientRepository.count());
                analytics.put("totalDoctors", doctorRepository.count());
                analytics.put("totalAppointments", appointmentRepository.count());
                analytics.put("totalBills", billRepository.count());

                // Revenue analytics
                List<Bill> allBills = billRepository.findAll();
                BigDecimal totalRevenue = allBills.stream()
                                .filter(b -> b.getStatus() == Bill.BillStatus.PAID)
                                .map(Bill::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                BigDecimal pendingRevenue = allBills.stream()
                                .filter(b -> b.getStatus() == Bill.BillStatus.PENDING)
                                .map(Bill::getAmount)
                                .reduce(BigDecimal.ZERO, BigDecimal::add);

                analytics.put("totalRevenue", totalRevenue);
                analytics.put("pendingRevenue", pendingRevenue);

                // Appointment status breakdown
                List<Appointment> allAppointments = appointmentRepository.findAll();
                Map<String, Long> appointmentsByStatus = allAppointments.stream()
                                .filter(a -> a.getStatus() != null)
                                .collect(Collectors.groupingBy(a -> a.getStatus().toString(), Collectors.counting()));
                analytics.put("appointmentsByStatus", appointmentsByStatus);

                // Revenue by month (last 6 months)
                LocalDateTime sixMonthsAgo = LocalDateTime.now().minusMonths(6);
                List<Map<String, Object>> monthlyRevenue = new ArrayList<>();

                for (int i = 5; i >= 0; i--) {
                        LocalDateTime monthStart = LocalDateTime.now().minusMonths(i).withDayOfMonth(1).withHour(0)
                                        .withMinute(0);
                        LocalDateTime monthEnd = monthStart.plusMonths(1);

                        BigDecimal monthRevenue = allBills.stream()
                                        .filter(b -> b.getStatus() == Bill.BillStatus.PAID)
                                        .filter(b -> b.getPaymentDate() != null)
                                        .filter(b -> b.getPaymentDate().isAfter(monthStart)
                                                        && b.getPaymentDate().isBefore(monthEnd))
                                        .map(Bill::getAmount)
                                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                        monthlyRevenue.add(Map.of(
                                        "month", monthStart.getMonth().toString().substring(0, 3),
                                        "revenue", monthRevenue));
                }
                analytics.put("monthlyRevenue", monthlyRevenue);

                // Appointments by day of week
                Map<String, Long> appointmentsByDayOfWeek = allAppointments.stream()
                                .filter(a -> a.getAppointmentDate() != null)
                                .collect(Collectors.groupingBy(
                                                a -> a.getAppointmentDate().getDayOfWeek().toString(),
                                                Collectors.counting()));
                analytics.put("appointmentsByDayOfWeek", appointmentsByDayOfWeek);

                // Top doctors by appointments
                Map<String, Long> appointmentsByDoctor = allAppointments.stream()
                                .filter(a -> a.getDoctor() != null)
                                .collect(Collectors.groupingBy(
                                                a -> a.getDoctor().getName(),
                                                Collectors.counting()));
                analytics.put("appointmentsByDoctor", appointmentsByDoctor);

                return analytics;
        }
}
