-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- USERS are managed by Supabase Auth (auth.users), but we'll define our domain tables.

-- PATIENTS Table
create table public.patients (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Link to Supabase Auth User (optional if managed by admin)
  name text not null,
  email text,
  contact_no text,
  date_of_birth date,
  gender text,
  address text,
  medical_history text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- DOCTORS Table
create table public.doctors (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id), -- Doctors must have a login
  name text not null,
  email text not null,
  specialization text not null,
  experience_years int,
  contact_no text,
  availability_schedule jsonb, -- structured data for available slots
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- APPOINTMENTS Table
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) not null,
  doctor_id uuid references public.doctors(id) not null,
  appointment_date timestamp with time zone not null,
  status text check (status in ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')) default 'SCHEDULED',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MEDICAL RECORDS Table
create table public.medical_records (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) not null,
  doctor_id uuid references public.doctors(id) not null,
  appointment_id uuid references public.appointments(id),
  diagnosis text,
  prescription text,
  lab_results_url text, -- Link to Supabase Storage
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BILLS Table
create table public.bills (
  id uuid default uuid_generate_v4() primary key,
  appointment_id uuid references public.appointments(id) not null,
  patient_id uuid references public.patients(id) not null,
  amount decimal(10, 2) not null,
  status text check (status in ('PENDING', 'PAID', 'OVERDUE')) default 'PENDING',
  payment_date timestamp with time zone,
  payment_method text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
