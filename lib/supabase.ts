import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Add a function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

export type InternshipFormData = {
  // Personal Information
  photo_url?: string
  first_name: string
  middle_name?: string
  last_name: string
  employee_code?: string
  father_husband_name?: string
  department?: string
  company_name: string
  date_of_joining?: string
  place_location?: string
  date_of_birth?: string
  present_address?: string
  permanent_address?: string
  phone_residence?: string
  phone_mobile: string
  marital_status?: string
  nationality?: string
  blood_group?: string
  personal_email: string
  uan?: string
  last_pf_no?: string

  // Emergency Contact
  emergency_contact_name?: string
  emergency_contact_address?: string
  emergency_contact_relationship?: string
  emergency_contact_phone?: string

  // Nominee Details
  nominee_name?: string
  nominee_dob?: string
  nominee_mobile?: string
  nominee_relationship?: string

  // Complex fields
  languages_known: Array<{
    language: string
    read: boolean
    write: boolean
    speak: boolean
  }>
  family_dependants: Array<{
    name: string
    relationship: string
    mobile: string
    occupation: string
  }>
  academic_qualifications: Array<{
    degree: string
    university: string
    passing_year: string
    percentage: string
  }>
  professional_qualifications: Array<{
    certification: string
    institute: string
    year: string
    percentage: string
  }>
  is_fresher: boolean
  work_experience: Array<{
    organization: string
    type: string
    duration: string
    designation: string
    job_profile: string
  }>

  // References (2 required)
  references: Array<{
    name: string
    designation: string
    company: string
    address: string
    contact_no: string
    email: string
  }>

  // Agreement
  agreement_accepted: boolean

  // Status tracking
  sections_completed: string[]
}
