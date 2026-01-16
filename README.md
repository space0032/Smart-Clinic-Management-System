# Smart Clinic Management System

A comprehensive web-based application for managing clinic operations, including patient records, appointments, prescriptions, billing, and reporting.

## 🚀 Features

### Core Functionality
-   **Dashboard**: Real-time overview of clinic stats, revenue, and daily appointments.
-   **Patient Management**: Complete digital profiles, medical history tracking, and search functionality.
-   **Appointments**: Scheduling system with status tracking (Scheduled, Completed, Cancelled).
-   **Medical Records**: Detailed record keeping of patient visits, diagnoses, and treatments.
-   **Doctors**: Manage doctor profiles, specializations, and availability.

### Advanced Features
-   **Prescriptions**: 
    -   Create digital prescriptions with structured medication data (Name, Dosage, Frequency, Duration).
    -   **Print-Ready View**: Professional print layout for physical copies or PDF export.
-   **Billing**: Integrated invoicing system to track payments and outstanding balances.
-   **Reports & Analytics**: Visual charts for revenue trends and operational insights.
-   **Dark Mode**: Fully supported dark theme for low-light environments.

## 🛠️ Tech Stack

### Frontend
-   **React**: UI Library
-   **Tailwind CSS**: Styling & Design System
-   **Lucide React**: Iconography
-   **Axios**: API Client

### Backend
-   **Java Spring Boot**: REST API & Business Logic
-   **Jakarta Persistence (JPA)**: Database ORM
-   **Lombok**: Boilerplate reduction

### Database
-   **Supabase / PostgreSQL**: Cloud database solution

## ⚙️ Setup & Installation

### Backend
1.  Navigate to `backend` directory.
2.  Configure `application.properties` with your database credentials.
3.  Run the application using Maven:
    ```bash
    ./mvnw spring-boot:run
    ```

### Frontend
1.  Navigate to `frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📄 License
This project is proprietary software. All rights reserved.