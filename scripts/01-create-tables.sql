-- Create the internship_forms table
CREATE TABLE IF NOT EXISTS internship_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Personal Information
  photo_url TEXT,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100),
  last_name VARCHAR(100) NOT NULL,
  employee_code VARCHAR(50),
  father_husband_name VARCHAR(200),
  department VARCHAR(100),
  company_name VARCHAR(100) DEFAULT 'ABANS Group',
  date_of_joining DATE,
  place_location VARCHAR(100),
  date_of_birth DATE,
  present_address TEXT,
  permanent_address TEXT,
  phone_residence VARCHAR(20),
  phone_mobile VARCHAR(20) NOT NULL,
  marital_status VARCHAR(20),
  nationality VARCHAR(50),
  blood_group VARCHAR(10),
  personal_email VARCHAR(100) NOT NULL,
  uan VARCHAR(50),
  last_pf_no VARCHAR(50),
  
  -- Emergency Contact
  emergency_contact_name VARCHAR(200),
  emergency_contact_address TEXT,
  emergency_contact_relationship VARCHAR(50),
  emergency_contact_phone VARCHAR(20),
  
  -- Nominee Details
  nominee_name VARCHAR(200),
  nominee_dob DATE,
  nominee_mobile VARCHAR(20),
  nominee_relationship VARCHAR(50),
  
  -- Languages Known (JSON array)
  languages_known JSONB DEFAULT '[]',
  
  -- Family Background (JSON array)
  family_dependants JSONB DEFAULT '[]',
  
  -- Academic Qualifications (JSON array)
  academic_qualifications JSONB DEFAULT '[]',
  
  -- Professional Qualifications (JSON array)
  professional_qualifications JSONB DEFAULT '[]',
  
  -- Extra Curricular Activities
  extra_curricular TEXT,
  
  -- Reading Habits
  reading_habits TEXT,
  
  -- Work Experience
  is_fresher BOOLEAN DEFAULT false,
  work_experience JSONB DEFAULT '[]',
  
  -- Reference from Last Job
  hr_rep_name VARCHAR(200),
  hr_rep_designation VARCHAR(100),
  hr_company_address TEXT,
  hr_contact_no VARCHAR(20),
  hr_office_email VARCHAR(100),
  
  -- Declaration
  signature_url TEXT,
  declaration_date DATE DEFAULT CURRENT_DATE,
  
  -- Status
  status VARCHAR(20) DEFAULT 'submitted'
);

-- Create storage bucket for form uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('form-uploads', 'form-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for authenticated uploads
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'form-uploads');

CREATE POLICY "Allow public access" ON storage.objects
FOR SELECT USING (bucket_id = 'form-uploads');
