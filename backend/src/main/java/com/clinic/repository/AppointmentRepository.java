package com.clinic.repository;

import com.clinic.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByPatientId(Long patientId);

    List<Appointment> findByDoctorId(Long doctorId);

    List<Appointment> findByStatus(Appointment.AppointmentStatus status);

    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);

    // Alias for backward compatibility
    default List<Appointment> findByAppointmentDateBetween(LocalDateTime start, LocalDateTime end) {
        return findByAppointmentTimeBetween(start, end);
    }
}
