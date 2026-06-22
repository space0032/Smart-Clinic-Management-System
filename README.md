# 🏥 Smart Clinic Management System

> **Comprehensive healthcare management platform for clinics and small hospitals**
>
> A full-featured web application for managing clinic operations including patient records, appointments, prescriptions, billing, and reporting with real-time dashboards and analytics.

[![React](https://img.shields.io/badge/React-18+-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Java](https://img.shields.io/badge/Java-17+-orange?style=flat-square&logo=java)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2-6DB33F?style=flat-square&logo=springboot)](https://spring.io/projects/spring-boot)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Features in Detail](#features-in-detail)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Contributing](#contributing)

---

## 🎯 Overview

**Smart Clinic Management System** is a modern, all-in-one healthcare management solution designed for small clinics, nursing homes, and private hospitals. It streamlines patient management, appointment scheduling, medical records, prescriptions, and billing into a single integrated platform.

**Key Benefits:**
- 📊 Real-time clinic dashboard with statistics
- 👨‍⚕️ Easy patient & doctor management
- 📅 Automated appointment scheduling
- 📝 Digital medical records
- 💊 Digital prescriptions with print functionality
- 💳 Integrated billing system
- 📈 Analytics and revenue reports
- 🌙 Dark mode support

**Target Users:** Clinic managers, doctors, receptionist staff, and clinic owners

---

## ✨ Key Features

### 📊 Dashboard & Analytics

| Component | Details |
|-----------|---------|
| **Real-Time Stats** | Total patients, today's appointments, revenue |
| **Revenue Trends** | Visual charts for monthly/yearly analysis |
| **Appointment Overview** | Scheduled, completed, cancelled counts |
| **Doctor Performance** | Consultation stats by doctor |
| **Patient Metrics** | New patients, returning patients, demographics |

### 👥 Patient Management

- **Digital Profiles**: Complete patient information with medical history
- **Contact Management**: Phone, email, address tracking
- **Medical History**: Previous diagnoses, treatments, allergies
- **Search & Filter**: Quick patient lookup by name, ID, contact
- **Profile Photos**: Visual patient identification
- **Emergency Contacts**: Next-of-kin information

### 📅 Appointment System

| Feature | Description |
|---------|-------------|
| **Scheduling** | Book, reschedule, cancel appointments |
| **Status Tracking** | Scheduled, In-Progress, Completed, Cancelled |
| **Doctor Assignment** | Assign patients to specific doctors |
| **Time Slots** | Manage doctor availability |
| **Reminders** | Automated notifications to patients |
| **Calendar View** | Visual appointment calendar |

### 👨‍⚕️ Doctor Management

- **Profile Management**: Specialization, qualifications, contact
- **Availability Tracking**: Doctor schedules and time slots
- **Workload Overview**: Appointments per doctor
- **Performance Stats**: Consultation counts and ratings

### 📋 Medical Records

- **Visit History**: Complete record of each patient visit
- **Diagnoses**: Structured diagnosis recording
- **Treatment Notes**: Doctor's clinical observations
- **Vital Signs**: Blood pressure, temperature, weight, etc.
- **Lab Results**: Integration with lab test results
- **Attachments**: Photos, X-rays, scans (HIPAA compliant)

### 💊 Prescription Management

**Digital Prescription Features:**
- ✅ Structured medication data (Name, Dosage, Frequency, Duration)
- ✅ Multiple medications per prescription
- ✅ Print-ready professional layout
- ✅ PDF export capability
- ✅ Prescription history tracking
- ✅ Drug interaction warnings
- ✅ Refill management

**Print Functionality:**
```
┌─────────────────────────────┐
│    CLINIC NAME              │
│    Date: [Date]             │
│    Patient: [Name]          │
├─────────────────────────────┤
│ Medication │ Dosage │ Days  │
│─────────────────────────────│
│ Medicine 1 │ 500mg  │ 10    │
│ Medicine 2 │ 250mg  │ 14    │
│ Medicine 3 │ 1000mg │ 7     │
├─────────────────────────────┤
│ Doctor: [Name]              │
│ Signature: ___________      │
│ Date: [Date]                │
└─────────────────────────────┘
```

### 💳 Billing & Invoicing

- **Invoice Generation**: Automatic billing from appointments
- **Payment Tracking**: Paid, Pending, Overdue statuses
- **Payment Methods**: Cash, Credit Card, UPI, Cheque
- **Tax Calculation**: Automatic GST/tax computation
- **Discounts**: Apply discounts on treatments
- **Receipt Printing**: Professional receipt generation
- **Payment History**: Complete transaction log

### 📈 Reports & Analytics

| Report Type | Metrics |
|-------------|---------|
| **Revenue Report** | Total income, payment methods, period comparison |
| **Patient Report** | New patients, returning, demographics, location |
| **Doctor Report** | Consultations, revenue generated, ratings |
| **Appointment Report** | Completed, cancelled, no-shows, avg duration |
| **Billing Report** | Outstanding payments, collections, aging |

### 🎨 UI/UX Features

- **Dark Mode**: Full dark theme support for eye comfort
- **Responsive Design**: Works on desktop, tablet, mobile
- **Accessibility**: WCAG compliant navigation
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages and validation

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library and component framework |
| **TypeScript** | Type-safe JavaScript development |
| **Tailwind CSS** | Utility-first CSS styling |
| **Lucide React** | Beautiful SVG icons |
| **Axios** | HTTP client for API requests |
| **React Router** | Client-side routing |
| **Date-fns** | Date manipulation utilities |

### Backend
| Technology | Purpose |
|-----------|---------|
| **Spring Boot 3.2** | REST API framework |
| **Java 17+** | Backend language |
| **Spring Web** | Web application support |
| **Spring Data JPA** | Database ORM |
| **Spring Security** | Authentication & authorization |
| **Lombok** | Reduce boilerplate code |
| **Maven** | Build and dependency management |

### Database
| Technology | Purpose |
|-----------|---------|
| **PostgreSQL** | Primary relational database |
| **Supabase** | Cloud-hosted PostgreSQL option |
| **JPA/Hibernate** | Object-relational mapping |

### Infrastructure
- **Docker**: Containerization
- **GitHub Actions**: CI/CD pipelines
- **Cloud Deployment**: AWS, Google Cloud, Azure ready

---

## 🚀 Quick Start

### Prerequisites

```
✓ Node.js 16+ (frontend)
✓ Java 17+ (backend)
✓ Maven 3.6+
✓ PostgreSQL 12+
✓ Docker & Docker Compose (optional)
```

### Option 1: Docker Compose

```bash
# Clone repository
git clone https://github.com/space0032/Smart-Clinic-Management-System.git
cd Smart-Clinic-Management-System

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Start services
docker compose up -d

# Access applications:
# - Web UI: http://localhost:3000
# - API: http://localhost:8080
# - Database: localhost:5432
```

### Option 2: Local Development

**Backend Setup**

```bash
cd backend

# Configure database in application.properties
# Edit: src/main/resources/application.properties
# spring.datasource.url=jdbc:postgresql://localhost:5432/clinic_db
# spring.datasource.username=postgres
# spring.datasource.password=your_password

# Build
mvn clean install

# Run
mvn spring-boot:run

# API runs on http://localhost:8080
```

**Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Application runs on http://localhost:5173
```

---

## 📊 Features in Detail

### Patient Dashboard

```
┌─────────────────────────────────────────┐
│     Smart Clinic Management             │
├─────────────────────────────────────────┤
│                                         │
│  Stats Card     │  Appointments Today   │
│  ┌───────────┐  │  ┌─────────────────┐ │
│  │ 245       │  │  │ 8 Scheduled    │ │
│  │ Patients  │  │  │ 3 Completed    │ │
│  │ (This Mo.)│  │  │ 1 Cancelled    │ │
│  └───────────┘  │  └─────────────────┘ │
│                                         │
│  Revenue Graph  │  Doctor List          │
│  [Chart...]     │  - Dr. Smith (8)      │
│                 │  - Dr. Johnson (6)    │
│                 │  - Dr. Williams (5)   │
│                                         │
└─────────────────────────────────────────┘
```

### Appointment Booking

1. **Select Patient** → Find/Create patient
2. **Choose Doctor** → Pick available doctor
3. **Select Date & Time** → Pick from available slots
4. **Confirm Booking** → System confirms appointment
5. **Send Reminder** → Auto SMS/email to patient

### Prescription Workflow

```
Doctor creates prescription
        ↓
Adds medications (name, dosage, frequency, duration)
        ↓
Patient views/receives prescription
        ↓
Patient can print or download PDF
        ↓
Pharmacist can scan/view prescription
```

### Billing Process

```
Appointment completed
        ↓
Doctor generates charges
        ↓
System creates invoice
        ↓
Patient reviews and pays
        ↓
Receipt generated
        ↓
Report updated
```

---

## 📁 Project Structure

```
Smart-Clinic-Management-System/
├── backend/                          # Spring Boot Application
│   ├── src/main/java/com/clinic/
│   │   ├── controller/               # REST API Controllers
│   │   │   ├── PatientController.java
│   │   │   ├── DoctorController.java
│   │   │   ├── AppointmentController.java
│   │   │   ├── PrescriptionController.java
│   │   │   ├── BillingController.java
│   │   │   └── ReportController.java
│   │   ├── service/                  # Business Logic
│   │   │   ├── PatientService.java
│   │   │   ├── AppointmentService.java
│   │   │   ├── PrescriptionService.java
│   │   │   └── BillingService.java
│   │   ├── model/                    # JPA Entities
│   │   │   ├── Patient.java
│   │   │   ├── Doctor.java
│   │   │   ├── Appointment.java
│   │   │   ├── Prescription.java
│   │   │   ├── MedicationItem.java
│   │   │   ├── Bill.java
│   │   │   └── MedicalRecord.java
│   │   ├── repository/               # Data Access
│   │   ├── config/                   # Configuration
│   │   └── dto/                      # Data Transfer Objects
│   ├── src/main/resources/
│   │   ├── application.properties    # Configuration
│   │   └── schema.sql                # Database schema
│   ├── pom.xml                       # Maven dependencies
│   └── Dockerfile
│
├── frontend/                         # React Application
│   ├── src/
│   │   ├── components/               # React Components
│   │   │   ├── Navbar.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── PatientForm.tsx
│   │   │   ├── AppointmentBooking.tsx
│   │   │   ├── PrescriptionForm.tsx
│   │   │   ├── BillingInvoice.tsx
│   │   │   └── ReportCharts.tsx
│   │   ├── pages/                    # Page Components
│   │   │   ├── PatientManagement.tsx
│   │   │   ├── DoctorManagement.tsx
│   │   │   ├── Appointments.tsx
│   │   │   ├── Billing.tsx
│   │   │   └── Reports.tsx
│   │   ├── services/
│   │   │   └── apiClient.ts          # API client
│   │   ├── hooks/                    # Custom hooks
│   │   ├── types/                    # TypeScript types
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── public/                       # Static assets
│   ├── package.json
│   └── Dockerfile
│
├── docs/                             # Documentation
│   ├── API_REFERENCE.md              # API endpoints
│   ├── SETUP.md                      # Setup guide
│   ├── DATABASE_SCHEMA.md            # DB design
│   └── USER_GUIDE.md                 # End-user guide
│
└── docker-compose.yml
```

---

## 🔌 API Reference

### Patient Management

```http
# Get all patients
GET /api/patients
Authorization: Bearer {token}

# Get patient by ID
GET /api/patients/{id}

# Create new patient
POST /api/patients
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+91-9876543210",
  "address": "123 Main St",
  "dob": "1990-05-15",
  "bloodGroup": "O+"
}

# Update patient
PUT /api/patients/{id}

# Delete patient
DELETE /api/patients/{id}
```

### Appointment Management

```http
# Create appointment
POST /api/appointments
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 5,
  "appointmentDate": "2026-06-25",
  "appointmentTime": "10:30",
  "reason": "General checkup"
}

# Get appointments for date
GET /api/appointments?date=2026-06-25

# Update appointment status
PUT /api/appointments/{id}
{
  "status": "COMPLETED"
}
```

### Prescription Management

```http
# Create prescription
POST /api/prescriptions
Content-Type: application/json

{
  "patientId": 1,
  "doctorId": 5,
  "medications": [
    {
      "name": "Aspirin",
      "dosage": "500mg",
      "frequency": "Twice daily",
      "duration": "10 days"
    },
    {
      "name": "Vitamin C",
      "dosage": "1000mg",
      "frequency": "Once daily",
      "duration": "30 days"
    }
  ],
  "notes": "Take with food"
}

# Get prescription by ID
GET /api/prescriptions/{id}

# Export prescription as PDF
GET /api/prescriptions/{id}/pdf
```

### Billing

```http
# Create bill
POST /api/bills
Content-Type: application/json

{
  "patientId": 1,
  "items": [
    {
      "description": "Consultation",
      "amount": 500
    },
    {
      "description": "Medicines",
      "amount": 1200
    }
  ],
  "discount": 0,
  "paymentMethod": "CASH"
}

# Get patient outstanding bills
GET /api/bills?patientId=1&status=PENDING
```

### Reports

```http
# Revenue report
GET /api/reports/revenue?month=6&year=2026

# Patient report
GET /api/reports/patients?period=monthly

# Doctor performance report
GET /api/reports/doctors?doctorId=5
```

---

## 🔐 Security

- ✅ JWT-based authentication
- ✅ Role-based access control (Doctor, Receptionist, Admin)
- ✅ HIPAA-compliant patient data handling
- ✅ Encrypted password storage
- ✅ API request validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ CORS security headers

---

## 🧪 Testing

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test

# Coverage reports
mvn jacoco:report        # Backend
npm run coverage         # Frontend
```

---

## 📱 Responsive Design

- ✅ Desktop (1920px+)
- ✅ Laptop (1366px - 1920px)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

---

## 🌐 Deployment

### Frontend
```bash
# Build for production
npm run build

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod
```

### Backend
```bash
# Build JAR
mvn clean package

# Deploy to AWS
aws elasticbeanstalk create-environment ...

# Deploy to Google Cloud
gcloud app deploy
```

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/NewFeature`
3. Commit changes: `git commit -m 'Add NewFeature'`
4. Push to branch: `git push origin feature/NewFeature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Healthcare professionals for requirements
- Open-source community
- Spring Boot and React teams
- Tailwind CSS for beautiful styling
- Lucide Icons for design assets

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/space0032/Smart-Clinic-Management-System/issues)
- **Documentation**: `/docs` folder
- **Email**: Reach out via GitHub profile

---

<div align="center">

**Made with ❤️ for healthcare providers**

⭐ Star if this helped manage your clinic better!

</div>
