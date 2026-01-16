# Deployment Guide: Netlify + Supabase

## Prerequisites
1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Git Repository**: Your code should be in a GitHub/GitLab/Bitbucket repo

## Step 1: Set up Supabase

### 1.1 Create a New Project
- Go to your Supabase dashboard
- Click "New Project"
- Choose your organization and fill in project details
- Wait for the database to be provisioned

### 1.2 Run the SQL Schema
- Navigate to the SQL Editor in your Supabase project
- Copy the entire contents of `supabase_schema.sql`
- Paste and run the query
- Verify that all tables were created (check the Table Editor)

### 1.3 Get Your API Credentials
- Go to Project Settings → API
- Copy your:
  - **Project URL** (looks like `https://xxxxx.supabase.co`)
  - **Anon/Public Key** (starts with `eyJ...`)

## Step 2: Deploy to Netlify

### 2.1 Connect Your Repository
- Log in to Netlify
- Click "Add new site" → "Import an existing project"
- Connect your Git provider and select your repository
- Set the **Base directory** to `frontend`
- Set the **Build command** to `npm run build`
- Set the **Publish directory** to `frontend/dist`

### 2.2 Configure Environment Variables
Before deploying, add these environment variables in Netlify:
- Go to Site settings → Environment variables
- Add:
  - `VITE_SUPABASE_URL` = Your Supabase Project URL
  - `VITE_SUPABASE_ANON_KEY` = Your Supabase Anon Key

### 2.3 Deploy
- Click "Deploy site"
- Wait for the build to complete
- Your site will be live at a Netlify URL (e.g., `https://your-site-name.netlify.app`)

## Step 3: Test Your Deployment

1. **Register a User**:
   - Go to your deployed site
   - Click "Register"
   - Create an account with a role (e.g., ADMIN, DOCTOR)
   
2. **Verify Auth**:
   - Check if you can log in
   - Verify that you're redirected based on your role

3. **Test Features**:
   - Try creating a patient
   - Schedule an appointment
   - Create a lab order

## Troubleshooting

### "Missing Supabase credentials" 
- Ensure environment variables are set in Netlify
- Redeploy the site after adding variables

### Tables not found
- Re-run the `supabase_schema.sql` in your Supabase SQL Editor
- Check that all tables exist in the Table Editor

### Authentication errors
- Verify your Supabase URL and Anon Key are correct
- Check that RLS policies are enabled (they allow all authenticated users in our schema)

### CORS errors
- Supabase should automatically allow requests from your Netlify domain
- If issues persist, check your Supabase project settings

## Optional: Custom Domain
- In Netlify: Site settings → Domain management
- Add your custom domain and follow DNS configuration instructions

## Note on User Creation (Staff Management)
The current implementation adds users to the `public.users` table but doesn't create actual Auth users. For production use, you'd need to use Supabase's Admin API or invite links. For now, users should register themselves via the registration page.
