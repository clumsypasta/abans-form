
import jsPDF from 'jspdf'
import { supabase } from './supabase'

export interface FormDataForPDF {
  // Personal Information
  photo_url?: string
  first_name?: string
  middle_name?: string
  last_name?: string
  employee_code?: string
  father_husband_name?: string
  department?: string
  company_name?: string
  date_of_joining?: string
  place_location?: string
  date_of_birth?: string
  present_address?: string
  permanent_address?: string
  phone_residence?: string
  phone_mobile?: string
  marital_status?: string
  nationality?: string
  blood_group?: string
  personal_email?: string
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
  languages_known?: Array<{
    language?: string
    read?: boolean
    write?: boolean
    speak?: boolean
  }>
  family_dependants?: Array<{
    name?: string
    relationship?: string
    mobile?: string
    occupation?: string
  }>
  academic_qualifications?: Array<{
    degree?: string
    university?: string
    passing_year?: string
    percentage?: string
  }>
  professional_qualifications?: Array<{
    certification?: string
    institute?: string
    year?: string
    percentage?: string
  }>
  work_experience?: Array<{
    organization?: string
    type?: string
    duration?: string
    designation?: string
    job_profile?: string
  }>
  references?: Array<{
    name?: string
    designation?: string
    company?: string
    address?: string
    contact_no?: string
    email?: string
  }>

  // Status
  is_fresher?: boolean
  agreement_accepted?: boolean
}

const addLogoToPDF = async (doc: jsPDF, x: number, y: number): Promise<void> => {
  try {
    const response = await fetch('/images/abans-logo.png')
    if (!response.ok) throw new Error('Failed to fetch logo')
    
    const blob = await response.blob()
    const base64 = await new Promise<string>((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
    
    // Add logo to PDF (adjusted size)
    doc.addImage(base64, 'PNG', x, y, 40, 20)
  } catch (error) {
    console.error('Error loading logo:', error)
  }
}

const addText = (doc: jsPDF, text: string, x: number, y: number, maxWidth?: number): number => {
  if (maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * 6) // 6mm line height
  } else {
    doc.text(text, x, y)
    return y + 6
  }
}

const addSection = (doc: jsPDF, title: string, x: number, y: number): number => {
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 188, 212) // #00BCD4
  const newY = addText(doc, title, x, y)
  doc.setDrawColor(0, 188, 212)
  doc.line(x, newY, 200, newY)
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  return newY + 8
}

const addKeyValue = (doc: jsPDF, key: string, value: string, x: number, y: number, maxWidth: number = 80): number => {
  doc.setFont('helvetica', 'bold')
  doc.text(`${key}:`, x, y)
  doc.setFont('helvetica', 'normal')
  return addText(doc, value || 'N/A', x + 35, y, maxWidth)
}

const checkPageBreak = (doc: jsPDF, currentY: number, neededSpace: number = 20): number => {
  if (currentY + neededSpace > 280) { // 280mm is near bottom of A4
    doc.addPage()
    return 20 // Reset to top margin
  }
  return currentY
}

export const generateFormPDF = async (formData: FormDataForPDF, formId?: string): Promise<{ blob: Blob; filename: string }> => {
  const doc = new jsPDF('p', 'mm', 'a4')
  let currentY = 20

  // Header
  doc.setFontSize(20)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 188, 212)
  doc.text('ABANS GROUP', 20, currentY)
  
  // Add logo to the right
  await addLogoToPDF(doc, 160, 10)
  
  currentY += 8
  doc.setFontSize(16)
  doc.text('Joining Formality Form', 20, currentY)
  
  currentY += 6
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  if (formId) {
    doc.text(`Form ID: JFF-${formId}`, 20, currentY)
    currentY += 5
  }
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, currentY)
  currentY += 15

  // Personal Information
  currentY = checkPageBreak(doc, currentY, 80)
  currentY = addSection(doc, 'Personal Information', 20, currentY)
  
  currentY = addKeyValue(doc, 'First Name', formData.first_name || '', 20, currentY)
  currentY = addKeyValue(doc, 'Middle Name', formData.middle_name || '', 20, currentY)
  currentY = addKeyValue(doc, 'Last Name', formData.last_name || '', 20, currentY)
  currentY = addKeyValue(doc, 'Employee Code', formData.employee_code || '', 20, currentY)
  currentY = addKeyValue(doc, 'Father/Husband Name', formData.father_husband_name || '', 20, currentY)
  currentY = addKeyValue(doc, 'Department', formData.department || '', 20, currentY)
  currentY = addKeyValue(doc, 'Company', formData.company_name || 'ABANS Group', 20, currentY)
  currentY = addKeyValue(doc, 'Date of Joining', formData.date_of_joining || '', 20, currentY)
  currentY = addKeyValue(doc, 'Place/Location', formData.place_location || '', 20, currentY)
  currentY = addKeyValue(doc, 'Date of Birth', formData.date_of_birth || '', 20, currentY)
  currentY = addKeyValue(doc, 'Phone (Residence)', formData.phone_residence || '', 20, currentY)
  currentY = addKeyValue(doc, 'Phone (Mobile)', formData.phone_mobile || '', 20, currentY)
  currentY = addKeyValue(doc, 'Marital Status', formData.marital_status || '', 20, currentY)
  currentY = addKeyValue(doc, 'Nationality', formData.nationality || '', 20, currentY)
  currentY = addKeyValue(doc, 'Blood Group', formData.blood_group || '', 20, currentY)
  currentY = addKeyValue(doc, 'Personal Email', formData.personal_email || '', 20, currentY)
  currentY = addKeyValue(doc, 'UAN', formData.uan || '', 20, currentY)
  currentY = addKeyValue(doc, 'Last PF No', formData.last_pf_no || '', 20, currentY)
  
  currentY += 5
  currentY = addKeyValue(doc, 'Present Address', formData.present_address || '', 20, currentY, 150)
  currentY += 5
  currentY = addKeyValue(doc, 'Permanent Address', formData.permanent_address || '', 20, currentY, 150)
  currentY += 10

  // Emergency Contact
  currentY = checkPageBreak(doc, currentY, 40)
  currentY = addSection(doc, 'Emergency Contact', 20, currentY)
  currentY = addKeyValue(doc, 'Name', formData.emergency_contact_name || '', 20, currentY)
  currentY = addKeyValue(doc, 'Phone', formData.emergency_contact_phone || '', 20, currentY)
  currentY = addKeyValue(doc, 'Relationship', formData.emergency_contact_relationship || '', 20, currentY)
  currentY += 5
  currentY = addKeyValue(doc, 'Address', formData.emergency_contact_address || '', 20, currentY, 150)
  currentY += 10

  // Nominee Details
  currentY = checkPageBreak(doc, currentY, 30)
  currentY = addSection(doc, 'Nominee Details', 20, currentY)
  currentY = addKeyValue(doc, 'Name', formData.nominee_name || '', 20, currentY)
  currentY = addKeyValue(doc, 'Date of Birth', formData.nominee_dob || '', 20, currentY)
  currentY = addKeyValue(doc, 'Mobile', formData.nominee_mobile || '', 20, currentY)
  currentY = addKeyValue(doc, 'Relationship', formData.nominee_relationship || '', 20, currentY)
  currentY += 10

  // Languages Known
  currentY = checkPageBreak(doc, currentY, 30)
  currentY = addSection(doc, 'Languages Known', 20, currentY)
  if (formData.languages_known && formData.languages_known.length > 0) {
    formData.languages_known.forEach((lang) => {
      currentY = checkPageBreak(doc, currentY, 10)
      const langText = `${lang.language || 'N/A'} - Read: ${lang.read ? 'Yes' : 'No'}, Write: ${lang.write ? 'Yes' : 'No'}, Speak: ${lang.speak ? 'Yes' : 'No'}`
      currentY = addText(doc, langText, 20, currentY, 170)
      currentY += 2
    })
  } else {
    currentY = addText(doc, 'No languages specified', 20, currentY)
  }
  currentY += 10

  // Family Dependants
  currentY = checkPageBreak(doc, currentY, 30)
  currentY = addSection(doc, 'Family Dependants', 20, currentY)
  if (formData.family_dependants && formData.family_dependants.length > 0) {
    formData.family_dependants.forEach((dep) => {
      currentY = checkPageBreak(doc, currentY, 15)
      currentY = addKeyValue(doc, 'Name', dep.name || '', 20, currentY)
      currentY = addKeyValue(doc, 'Relationship', dep.relationship || '', 20, currentY)
      currentY = addKeyValue(doc, 'Mobile', dep.mobile || '', 20, currentY)
      currentY = addKeyValue(doc, 'Occupation', dep.occupation || '', 20, currentY)
      currentY += 5
    })
  } else {
    currentY = addText(doc, 'No dependants specified', 20, currentY)
  }
  currentY += 10

  // Academic Qualifications
  currentY = checkPageBreak(doc, currentY, 30)
  currentY = addSection(doc, 'Academic Qualifications', 20, currentY)
  if (formData.academic_qualifications && formData.academic_qualifications.length > 0) {
    formData.academic_qualifications.forEach((qual) => {
      currentY = checkPageBreak(doc, currentY, 20)
      currentY = addKeyValue(doc, 'Degree', qual.degree || '', 20, currentY)
      currentY = addKeyValue(doc, 'University', qual.university || '', 20, currentY)
      currentY = addKeyValue(doc, 'Passing Year', qual.passing_year || '', 20, currentY)
      currentY = addKeyValue(doc, 'Percentage', `${qual.percentage || ''}%`, 20, currentY)
      currentY += 5
    })
  } else {
    currentY = addText(doc, 'No academic qualifications specified', 20, currentY)
  }
  currentY += 10

  // Professional Qualifications
  currentY = checkPageBreak(doc, currentY, 30)
  currentY = addSection(doc, 'Professional Qualifications', 20, currentY)
  if (formData.professional_qualifications && formData.professional_qualifications.length > 0) {
    formData.professional_qualifications.forEach((qual) => {
      currentY = checkPageBreak(doc, currentY, 20)
      currentY = addKeyValue(doc, 'Certification', qual.certification || '', 20, currentY)
      currentY = addKeyValue(doc, 'Institute', qual.institute || '', 20, currentY)
      currentY = addKeyValue(doc, 'Year', qual.year || '', 20, currentY)
      currentY = addKeyValue(doc, 'Percentage', `${qual.percentage || ''}%`, 20, currentY)
      currentY += 5
    })
  } else {
    currentY = addText(doc, 'No professional qualifications specified', 20, currentY)
  }
  currentY += 10

  // Work Experience
  currentY = checkPageBreak(doc, currentY, 30)
  currentY = addSection(doc, 'Work Experience', 20, currentY)
  currentY = addKeyValue(doc, 'Is Fresher', formData.is_fresher ? 'Yes' : 'No', 20, currentY)
  currentY += 5
  
  if (formData.work_experience && formData.work_experience.length > 0) {
    formData.work_experience.forEach((exp) => {
      currentY = checkPageBreak(doc, currentY, 25)
      currentY = addKeyValue(doc, 'Organization', exp.organization || '', 20, currentY)
      currentY = addKeyValue(doc, 'Designation', exp.designation || '', 20, currentY)
      currentY = addKeyValue(doc, 'Type', exp.type || '', 20, currentY)
      currentY = addKeyValue(doc, 'Duration', exp.duration || '', 20, currentY)
      currentY = addKeyValue(doc, 'Job Profile', exp.job_profile || '', 20, currentY, 140)
      currentY += 5
    })
  } else {
    currentY = addText(doc, 'No work experience specified', 20, currentY)
  }
  currentY += 10

  // References
  currentY = checkPageBreak(doc, currentY, 30)
  currentY = addSection(doc, 'References', 20, currentY)
  if (formData.references && formData.references.length > 0) {
    formData.references.forEach((ref) => {
      currentY = checkPageBreak(doc, currentY, 30)
      currentY = addKeyValue(doc, 'Name', ref.name || '', 20, currentY)
      currentY = addKeyValue(doc, 'Designation', ref.designation || '', 20, currentY)
      currentY = addKeyValue(doc, 'Company', ref.company || '', 20, currentY)
      currentY = addKeyValue(doc, 'Contact', ref.contact_no || '', 20, currentY)
      currentY = addKeyValue(doc, 'Email', ref.email || '', 20, currentY)
      currentY = addKeyValue(doc, 'Address', ref.address || '', 20, currentY, 140)
      currentY += 5
    })
  } else {
    currentY = addText(doc, 'No references specified', 20, currentY)
  }
  currentY += 10

  // Agreement
  currentY = checkPageBreak(doc, currentY, 40)
  currentY = addSection(doc, 'Declaration & Agreement', 20, currentY)
  currentY = addKeyValue(doc, 'Terms Accepted', formData.agreement_accepted ? 'Yes' : 'No', 20, currentY)
  currentY += 10
  
  doc.setFontSize(9)
  const declarationText = 'I hereby declare that the information furnished above is true to the best of my knowledge and belief. I understand that any false information may lead to the termination of the employment.'
  currentY = addText(doc, declarationText, 20, currentY, 170)
  currentY += 15

  // Footer
  currentY = checkPageBreak(doc, currentY, 20)
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text('This document was generated automatically by ABANS Group E-Joining Formalities System', 20, currentY)
  currentY += 4
  doc.text('For any queries, contact: hr@abans.lk | +94 11 234 5678', 20, currentY)

  // Generate blob and filename
  const blob = doc.output('blob')
  const filename = `ABANS_Joining_Form_${formData.first_name || 'Unknown'}_${formData.last_name || 'User'}_${Date.now()}.pdf`

  return { blob, filename }
}

export const uploadPDFToSupabase = async (blob: Blob, filename: string): Promise<string | null> => {
  try {
    console.log('Attempting to upload PDF:', filename, 'Size:', blob.size)
    
    const { data, error } = await supabase.storage
      .from('form-uploads')
      .upload(`pdfs/${filename}`, blob, {
        contentType: 'application/pdf',
        upsert: true
      })

    if (error) {
      console.error('Error uploading PDF:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return null
    }

    console.log('PDF uploaded successfully:', data)

    const { data: urlData } = supabase.storage
      .from('form-uploads')
      .getPublicUrl(`pdfs/${filename}`)

    console.log('Public URL generated:', urlData.publicUrl)
    return urlData.publicUrl
  } catch (error) {
    console.error('Error uploading PDF to Supabase:', error)
    return null
  }
}
