package com.clinic.service;

import com.clinic.model.Appointment;
import com.clinic.model.Bill;
import com.clinic.repository.AppointmentRepository;
import com.clinic.repository.BillRepository;
import com.clinic.repository.DoctorRepository;
import com.clinic.repository.PatientRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Stream;

@Service
public class PdfReportService {

    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final BillRepository billRepository;

    public PdfReportService(PatientRepository patientRepository,
            DoctorRepository doctorRepository,
            AppointmentRepository appointmentRepository,
            BillRepository billRepository) {
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.appointmentRepository = appointmentRepository;
        this.billRepository = billRepository;
    }

    public ByteArrayInputStream generateReport() {
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            // Fonts
            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20, Color.DARK_GRAY);
            Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.WHITE);
            Font dataFont = FontFactory.getFont(FontFactory.HELVETICA, 10, Color.BLACK);

            // Title
            Paragraph title = new Paragraph("Clinic Management System - Executive Report", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);
            document.add(new Paragraph("\n"));
            document.add(new Paragraph(
                    "Generated on: " + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))));
            document.add(new Paragraph("\n"));

            // Summary Stats Table
            addSummaryTable(document, headerFont, dataFont);

            document.add(new Paragraph("\n"));

            // Recent Appointments
            Paragraph subTitle = new Paragraph("Recent Appointments",
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 14, Color.GRAY));
            document.add(subTitle);
            document.add(new Paragraph("\n"));

            addAppointmentsTable(document, headerFont, dataFont);

            document.close();
        } catch (DocumentException e) {
            throw new RuntimeException("Error generating PDF report", e);
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    private void addSummaryTable(Document document, Font headerFont, Font dataFont) throws DocumentException {
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);

        // Headers
        Stream.of("Total Patients", "Total Doctors", "Total Appointments", "Total Revenue")
                .forEach(headerTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(Color.GRAY);
                    header.setPadding(5);
                    header.setPhrase(new Phrase(headerTitle, headerFont));
                    table.addCell(header);
                });

        // Data
        table.addCell(new Phrase(String.valueOf(patientRepository.count()), dataFont));
        table.addCell(new Phrase(String.valueOf(doctorRepository.count()), dataFont));
        table.addCell(new Phrase(String.valueOf(appointmentRepository.count()), dataFont));

        BigDecimal totalRevenue = billRepository.findAll().stream()
                .filter(b -> b.getStatus() == Bill.BillStatus.PAID)
                .map(Bill::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        table.addCell(new Phrase("$" + totalRevenue.toString(), dataFont));

        document.add(table);
    }

    private void addAppointmentsTable(Document document, Font headerFont, Font dataFont) throws DocumentException {
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[] { 3, 3, 3, 2, 4 });

        Stream.of("Date", "Patient", "Doctor", "Status", "Reason")
                .forEach(headerTitle -> {
                    PdfPCell header = new PdfPCell();
                    header.setBackgroundColor(new Color(0, 121, 107)); // Teal
                    header.setPadding(5);
                    header.setPhrase(new Phrase(headerTitle, headerFont));
                    table.addCell(header);
                });

        List<Appointment> appointments = appointmentRepository.findAll();
        // Limit to last 20 for brief report
        // Limit to last 20 from those with valid dates
        appointments.stream()
                .filter(a -> a.getAppointmentDate() != null)
                .sorted((a1, a2) -> a2.getAppointmentDate().compareTo(a1.getAppointmentDate()))
                .limit(20)
                .forEach(app -> {
                    String dateStr = app.getAppointmentDate().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));
                    String patientName = app.getPatient() != null ? app.getPatient().getName() : "Unknown";
                    String doctorName = app.getDoctor() != null ? app.getDoctor().getName() : "Unknown";
                    String status = app.getStatus() != null ? app.getStatus() : "N/A";
                    String reason = app.getReason() != null ? app.getReason() : "N/A";

                    table.addCell(new Phrase(dateStr, dataFont));
                    table.addCell(new Phrase(patientName, dataFont));
                    table.addCell(new Phrase(doctorName, dataFont));
                    table.addCell(new Phrase(status, dataFont));
                    table.addCell(new Phrase(reason, dataFont));
                });

        document.add(table);
    }
}
