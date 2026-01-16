package com.clinic.service;

import com.clinic.model.Appointment;
import com.clinic.model.Bill;
import com.clinic.model.Patient;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.BillRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class ExcelReportService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;

    public ExcelReportService(PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            BillRepository billRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.billRepository = billRepository;
    }

    public ByteArrayInputStream generateReport() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            // Create Sheets
            createSummarySheet(workbook);
            createPatientsSheet(workbook);
            createAppointmentsSheet(workbook);
            createFinancialsSheet(workbook);

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Error generating Excel report", e);
        }
    }

    private void createSummarySheet(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Summary");
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Metric");
        header.createCell(1).setCellValue("Value");

        int rowIdx = 1;
        sheet.createRow(rowIdx++).createCell(0).setCellValue("Total Patients");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(patientRepository.count());

        sheet.createRow(rowIdx++).createCell(0).setCellValue("Total Doctors");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(doctorRepository.count());

        sheet.createRow(rowIdx++).createCell(0).setCellValue("Total Appointments");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(appointmentRepository.count());

        BigDecimal totalRevenue = billRepository.findAll().stream()
                .filter(b -> b.getStatus() == Bill.BillStatus.PAID)
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        sheet.createRow(rowIdx++).createCell(0).setCellValue("Total Revenue");
        sheet.getRow(rowIdx - 1).createCell(1).setCellValue(totalRevenue.doubleValue());

        sheet.autoSizeColumn(0);
        sheet.autoSizeColumn(1);
    }

    private void createPatientsSheet(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Patients");
        Row header = sheet.createRow(0);
        String[] columns = { "ID", "Name", "Email", "Phone", "Age", "Gender" };

        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        List<Patient> patients = patientRepository.findAll();
        int rowIdx = 1;
        for (Patient patient : patients) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(patient.getId().toString());
            row.createCell(1).setCellValue(patient.getName());
            row.createCell(2).setCellValue(patient.getEmail());
            row.createCell(3).setCellValue(patient.getPhone());
            row.createCell(4).setCellValue(patient.getAge() != null ? patient.getAge() : 0);
            row.createCell(5).setCellValue(patient.getGender());
        }
    }

    private void createAppointmentsSheet(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Appointments");
        Row header = sheet.createRow(0);
        String[] columns = { "ID", "Date", "Patient", "Doctor", "Status", "Reason" };

        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        List<Appointment> appointments = appointmentRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
        int rowIdx = 1;
        for (Appointment app : appointments) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(app.getId().toString());

            String dateStr = app.getAppointmentDate() != null ? app.getAppointmentDate().format(formatter) : "N/A";
            row.createCell(1).setCellValue(dateStr);

            row.createCell(2).setCellValue(app.getPatient() != null ? app.getPatient().getName() : "Unknown");
            row.createCell(3).setCellValue(app.getDoctor() != null ? app.getDoctor().getName() : "Unknown");
            row.createCell(4).setCellValue(app.getStatus() != null ? app.getStatus() : "N/A");
            row.createCell(5).setCellValue(app.getReason() != null ? app.getReason() : "");
        }
    }

    private void createFinancialsSheet(Workbook workbook) {
        Sheet sheet = workbook.createSheet("Financials");
        Row header = sheet.createRow(0);
        String[] columns = { "ID", "Patient", "Amount", "Status", "Date" };

        for (int i = 0; i < columns.length; i++) {
            header.createCell(i).setCellValue(columns[i]);
        }

        List<Bill> bills = billRepository.findAll();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        int rowIdx = 1;
        for (Bill bill : bills) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(bill.getId().toString());
            row.createCell(1).setCellValue(bill.getPatient() != null ? bill.getPatient().getName() : "Unknown");

            double amount = bill.getAmount() != null ? bill.getAmount().doubleValue() : 0.0;
            row.createCell(2).setCellValue(amount);

            String status = bill.getStatus() != null ? bill.getStatus().toString() : "N/A";
            row.createCell(3).setCellValue(status);

            String dateStr = bill.getIssueDate() != null ? bill.getIssueDate().format(formatter) : "N/A";
            row.createCell(4).setCellValue(dateStr);
        }
    }
}
