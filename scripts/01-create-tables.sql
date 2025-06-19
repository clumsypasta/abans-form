-- Create the internship_forms table
CREATE TABLE IF NOT EXISTS internship_forms (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Personal Information
  photo_url TEXT,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  employee_code TEXT,
  father_husband_name TEXT,
  department TEXT,
  company_name TEXT DEFAULT 'ABANS Group',
  date_of_joining DATE,
  place_location TEXT,
  date_of_birth DATE,
  present_address TEXT,
  permanent_address TEXT,
  phone_residence TEXT,
  phone_mobile TEXT,
  marital_status TEXT,
  nationality TEXT,
  blood_group TEXT,
  personal_email TEXT,
  uan TEXT,
  last_pf_no TEXT,

  -- Emergency Contact
  emergency_contact_name TEXT,
  emergency_contact_address TEXT,
  emergency_contact_relationship TEXT,
  emergency_contact_phone TEXT,

  -- Nominee Details
  nominee_name TEXT,
  nominee_dob DATE,
  nominee_mobile TEXT,
  nominee_relationship TEXT,

  -- Complex fields stored as JSONB
  languages_known JSONB DEFAULT '[]'::jsonb,
  family_dependants JSONB DEFAULT '[]'::jsonb,
  academic_qualifications JSONB DEFAULT '[]'::jsonb,
  professional_qualifications JSONB DEFAULT '[]'::jsonb,
  work_experience JSONB DEFAULT '[]'::jsonb,
  references JSONB DEFAULT '[]'::jsonb,

  -- Status fields
  is_fresher BOOLEAN DEFAULT false,
  agreement_accepted BOOLEAN DEFAULT false,
  sections_completed JSONB DEFAULT '[]'::jsonb
);

-- Create storage bucket for file uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('form-uploads', 'form-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Set up Row Level Security (RLS)
ALTER TABLE internship_forms ENABLE ROW LEVEL SECURITY;

-- Allow inserts for authenticated users
CREATE POLICY "Allow insert for authenticated users" ON internship_forms
FOR INSERT WITH CHECK (true);

-- Allow select for authenticated users
CREATE POLICY "Allow select for authenticated users" ON internship_forms
FOR SELECT USING (true);

-- Set up storage policies
CREATE POLICY "Allow upload for authenticated users" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'form-uploads');

CREATE POLICY "Allow public access to uploads" ON storage.objects
FOR SELECT USING (bucket_id = 'form-uploads');