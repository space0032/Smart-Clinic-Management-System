package com.clinic.model;

import jakarta.persistence.*;
import java.util.UUID;
import java.util.Objects;

@Entity
@Table(name = "doctors", indexes = {
        @Index(name = "idx_doctor_email", columnList = "email"),
        @Index(name = "idx_doctor_specialization", columnList = "specialization")
})
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false)
    @jakarta.validation.constraints.NotBlank(message = "Name is required")
    @jakarta.validation.constraints.Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;

    @Column
    @jakarta.validation.constraints.NotBlank(message = "Specialization is required")
    private String specialization;

    @Column(unique = true)
    @jakarta.validation.constraints.NotBlank(message = "Email is required")
    @jakarta.validation.constraints.Email(message = "Invalid email format")
    private String email;

    @Column
    @jakarta.validation.constraints.Pattern(regexp = "^\\+?[0-9. ()-]{7,25}$", message = "Invalid phone number")
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String qualifications;

    @Column
    private Integer experience; // years

    @Column
    private String availability;

    public Doctor() {
    }

    public Doctor(UUID id, String name, String specialization, String email, String phone,
            String qualifications, Integer experience, String availability) {
        this.id = id;
        this.name = name;
        this.specialization = specialization;
        this.email = email;
        this.phone = phone;
        this.qualifications = qualifications;
        this.experience = experience;
        this.availability = availability;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getQualifications() {
        return qualifications;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }

    public Integer getExperience() {
        return experience;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        Doctor doctor = (Doctor) o;
        return Objects.equals(id, doctor.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
