# Database Schema Design - Smart Clinic Management System

## Overview
This document describes the database schema for the Smart Clinic Management System using PostgreSQL (Supabase).

## Entity Relationship Diagram

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────┐
│   USERS     │       │   APPOINTMENTS  │       │  DOCTORS    │
├─────────────┤       ├─────────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)         │       │ id (PK)     │
│ email       │       │ patient_id (FK) │───────│ name        │
│ password    │       │ doctor_id (FK)  │       │ email       │
│ name        │       │ appointment_date│       │ phone       │
│ role        │       │ status          │       │ specialty   │
└─────────────┘       │ notes           │       │ available   │
                      └─────────────────┘       └─────────────┘
                              │                        │
                              │                        │
┌─────────────┐       ┌───────┴───────┐       ┌───────┴───────┐
│  PATIENTS   │       │     BILLS     │       │ PRESCRIPTIONS │
├─────────────┤       ├───────────────┤       ├───────────────┤
│ id (PK)     │───────│ id (PK)       │       │ id (PK)       │
│ name        │       │ patient_id(FK)│       │ patient_id(FK)│
│ email       │       │ appt_id (FK)  │       │ doctor_id(FK) │
│ phone       │       │ amount        │       │ diagnosis     │
│ dob         │       │ status        │       │ medications   │
│ address     │       │ payment_date  │       │ instructions  │
│ gender      │       └───────────────┘       │ valid_until   │
└─────────────┘                               └───────────────┘
```

## Tables

### 1. users
Stores user accounts for authentication.

| Column   | Type         | Constraints          | Description            |
|----------|--------------|----------------------|------------------------|
| id       | UUID         | PRIMARY KEY          | Unique identifier      |
| email    | VARCHAR(255) | UNIQUE, NOT NULL     | User email address     |
| password | VARCHAR(255) | NOT NULL             | Hashed password        |
| name     | VARCHAR(255) | NOT NULL             | Full name              |
| role     | VARCHAR(50)  | NOT NULL             | ADMIN, DOCTOR, RECEPTIONIST |

### 2. patients
Stores patient information.

| Column     | Type         | Constraints      | Description              |
|------------|--------------|------------------|--------------------------|
| id         | UUID         | PRIMARY KEY      | Unique identifier        |
| name       | VARCHAR(255) | NOT NULL         | Patient full name        |
| email      | VARCHAR(255) |                  | Email address            |
| phone      | VARCHAR(20)  |                  | Phone number             |
| dob        | DATE         |                  | Date of birth            |
| address    | TEXT         |                  | Home address             |
| gender     | VARCHAR(20)  |                  | Gender                   |
| created_at | TIMESTAMP    | DEFAULT NOW()    | Record creation date     |

### 3. doctors
Stores doctor profiles.

| Column      | Type         | Constraints      | Description              |
|-------------|--------------|------------------|--------------------------|
| id          | UUID         | PRIMARY KEY      | Unique identifier        |
| name        | VARCHAR(255) | NOT NULL         | Doctor full name         |
| email       | VARCHAR(255) |                  | Email address            |
| phone       | VARCHAR(20)  |                  | Phone number             |
| specialty   | VARCHAR(100) |                  | Medical specialty        |
| available   | BOOLEAN      | DEFAULT TRUE     | Availability status      |

### 4. appointments
Stores appointment bookings.

| Column           | Type         | Constraints          | Description              |
|------------------|--------------|----------------------|--------------------------|
| id               | UUID         | PRIMARY KEY          | Unique identifier        |
| patient_id       | UUID         | FOREIGN KEY          | Reference to patients    |
| doctor_id        | UUID         | FOREIGN KEY          | Reference to doctors     |
| appointment_date | TIMESTAMP    | NOT NULL             | Date and time            |
| status           | VARCHAR(50)  | NOT NULL             | SCHEDULED, CONFIRMED, COMPLETED, CANCELLED |
| notes            | TEXT         |                      | Additional notes         |

### 5. bills
Stores billing and invoice information.

| Column       | Type           | Constraints      | Description              |
|--------------|----------------|------------------|--------------------------|
| id           | UUID           | PRIMARY KEY      | Unique identifier        |
| patient_id   | UUID           | FOREIGN KEY      | Reference to patients    |
| appointment_id| UUID          | FOREIGN KEY      | Reference to appointments|
| amount       | DECIMAL(10,2)  | NOT NULL         | Bill amount              |
| status       | VARCHAR(50)    | NOT NULL         | PENDING, PAID, CANCELLED |
| payment_date | TIMESTAMP      |                  | Date of payment          |

### 6. prescriptions
Stores medical prescriptions.

| Column         | Type         | Constraints      | Description              |
|----------------|--------------|------------------|--------------------------|
| id             | UUID         | PRIMARY KEY      | Unique identifier        |
| patient_id     | UUID         | FOREIGN KEY      | Reference to patients    |
| doctor_id      | UUID         | FOREIGN KEY      | Reference to doctors     |
| diagnosis      | TEXT         |                  | Medical diagnosis        |
| medications    | TEXT         | NOT NULL         | Prescribed medications   |
| instructions   | TEXT         |                  | Usage instructions       |
| prescribed_date| TIMESTAMP    | DEFAULT NOW()    | Date prescribed          |
| valid_until    | TIMESTAMP    |                  | Prescription validity    |
| status         | VARCHAR(50)  |                  | ACTIVE, EXPIRED, COMPLETED|

### 7. medical_records
Stores patient medical history.

| Column       | Type         | Constraints      | Description              |
|--------------|--------------|------------------|--------------------------|
| id           | UUID         | PRIMARY KEY      | Unique identifier        |
| patient_id   | UUID         | FOREIGN KEY      | Reference to patients    |
| doctor_id    | UUID         | FOREIGN KEY      | Reference to doctors     |
| diagnosis    | TEXT         |                  | Diagnosis details        |
| treatment    | TEXT         |                  | Treatment provided       |
| notes        | TEXT         |                  | Additional notes         |
| record_date  | TIMESTAMP    | DEFAULT NOW()    | Date of record           |

## Indexes

```sql
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_bills_patient ON bills(patient_id);
CREATE INDEX idx_prescriptions_patient ON prescriptions(patient_id);
```

## Foreign Key Relationships

- `appointments.patient_id` → `patients.id`
- `appointments.doctor_id` → `doctors.id`
- `bills.patient_id` → `patients.id`
- `bills.appointment_id` → `appointments.id`
- `prescriptions.patient_id` → `patients.id`
- `prescriptions.doctor_id` → `doctors.id`
- `medical_records.patient_id` → `patients.id`
- `medical_records.doctor_id` → `doctors.id`
