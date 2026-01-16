# User Stories - Smart Clinic Management System

## Doctor User Stories

### US-D01: Doctor Login
**As a** Doctor  
**I want to** log in to my portal  
**So that** I can access my appointments and patient records

**Acceptance Criteria:**
- Doctor can enter email and password
- System validates credentials
- Doctor is redirected to dashboard upon successful login

### US-D02: View My Appointments
**As a** Doctor  
**I want to** view all my scheduled appointments  
**So that** I can prepare for patient consultations

**Acceptance Criteria:**
- Doctor sees a list of all appointments
- Appointments show patient name, date, time, and status
- Appointments can be filtered by date

### US-D03: View Patient Medical Records
**As a** Doctor  
**I want to** view a patient's medical history  
**So that** I can provide informed treatment

**Acceptance Criteria:**
- Doctor can access patient records from appointment
- Medical history shows previous diagnoses and prescriptions
- Records are read-only for past entries

### US-D04: Create Prescription
**As a** Doctor  
**I want to** write prescriptions for patients  
**So that** patients can get their medications

**Acceptance Criteria:**
- Doctor can select medications and dosage
- Prescription includes instructions
- Prescription is saved to patient record

### US-D05: Update Appointment Status
**As a** Doctor  
**I want to** mark appointments as completed  
**So that** the system reflects accurate scheduling

---

## Patient User Stories

### US-P01: Patient Registration
**As a** Patient  
**I want to** register for an account  
**So that** I can book appointments

**Acceptance Criteria:**
- Patient provides name, email, phone, date of birth
- System creates patient profile
- Patient receives confirmation

### US-P02: Search Doctors
**As a** Patient  
**I want to** search for doctors by name or specialty  
**So that** I can find the right doctor for my needs

**Acceptance Criteria:**
- Patient can search by doctor name
- Patient can filter by specialty
- Results show doctor availability

### US-P03: Book Appointment
**As a** Patient  
**I want to** book an appointment with a doctor  
**So that** I can receive medical care

**Acceptance Criteria:**
- Patient selects doctor, date, and time slot
- System checks availability
- Appointment is confirmed and saved

### US-P04: View My Appointments
**As a** Patient  
**I want to** see my upcoming and past appointments  
**So that** I can manage my healthcare schedule

**Acceptance Criteria:**
- Patient sees list of all appointments
- Shows appointment status (Scheduled, Completed, Cancelled)
- Patient can cancel upcoming appointments

### US-P05: View Prescriptions
**As a** Patient  
**I want to** view my prescriptions  
**So that** I can follow my treatment plan

---

## Admin User Stories

### US-A01: Admin Login
**As an** Admin  
**I want to** log in to the admin portal  
**So that** I can manage the clinic system

**Acceptance Criteria:**
- Admin enters email and password
- System validates admin credentials
- Admin is redirected to admin dashboard

### US-A02: Manage Doctors
**As an** Admin  
**I want to** add, edit, and remove doctors  
**So that** the clinic has updated doctor information

**Acceptance Criteria:**
- Admin can add new doctor with all details
- Admin can edit existing doctor information
- Admin can deactivate doctors

### US-A03: Manage Patients
**As an** Admin  
**I want to** view and manage patient accounts  
**So that** patient records are accurate

**Acceptance Criteria:**
- Admin can view all patients
- Admin can edit patient information
- Admin can deactivate patient accounts

### US-A04: View Reports
**As an** Admin  
**I want to** view clinic analytics and reports  
**So that** I can make informed business decisions

**Acceptance Criteria:**
- Reports show total patients, appointments, revenue
- Charts display monthly trends
- Data can be filtered by date range

### US-A05: Manage Billing
**As an** Admin  
**I want to** generate and manage invoices  
**So that** the clinic receives payments

**Acceptance Criteria:**
- Admin can create bills for appointments
- Admin can mark bills as paid
- System calculates revenue totals
