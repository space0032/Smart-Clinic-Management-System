-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users & Roles (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users on delete cascade not null primary key,
  email text not null,
  name text,
  role text check (role in ('ADMIN', 'DOCTOR', 'RECEPTIONIST', 'NURSE')) default 'RECEPTIONIST',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Patients
create table public.patients (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  age integer,
  gender text,
  email text,
  phone text,
  address text,
  blood_group text,
  medical_history text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Doctors
create table public.doctors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  specialization text,
  email text,
  phone text,
  availability text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Appointments
create table public.appointments (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete set null,
  appointment_date timestamp with time zone not null,
  status text check (status in ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED')) default 'SCHEDULED',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Medical Records
create table public.medical_records (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete set null,
  diagnosis text not null,
  prescription text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Lab Tests (Catalog)
create table public.lab_tests (
  id uuid default uuid_generate_v4() primary key,
  code text not null unique,
  name text not null,
  description text,
  normal_range text,
  units text,
  price numeric(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Lab Orders
create table public.lab_orders (
  id uuid default uuid_generate_v4() primary key,
  patient_id uuid references public.patients(id) on delete cascade not null,
  doctor_id uuid references public.doctors(id) on delete set null,
  order_date timestamp with time zone default timezone('utc'::text, now()) not null,
  status text check (status in ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED')) default 'PENDING',
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Lab Results
create table public.lab_results (
  id uuid default uuid_generate_v4() primary key,
  lab_order_id uuid references public.lab_orders(id) on delete cascade not null,
  test_name text not null,
  result_value text not null,
  unit text,
  reference_range text,
  is_abnormal boolean default false,
  remarks text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security) - OPTIONAL for now but recommended
alter table public.users enable row level security;
alter table public.patients enable row level security;
alter table public.doctors enable row level security;
alter table public.appointments enable row level security;
alter table public.medical_records enable row level security;
alter table public.lab_tests enable row level security;
alter table public.lab_orders enable row level security;
alter table public.lab_results enable row level security;

-- Simple Policies (Allow everything for authenticated users for easier dev)
create policy "Allow all for authenticated" on public.users for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.patients for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.doctors for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.appointments for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.medical_records for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.lab_tests for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.lab_orders for all using (auth.role() = 'authenticated');
create policy "Allow all for authenticated" on public.lab_results for all using (auth.role() = 'authenticated');

-- Function to handle new user signup (Optional: Automatically create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'name', coalesce(new.raw_user_meta_data->>'role', 'RECEPTIONIST'));
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on auth.users insert
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
