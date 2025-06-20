
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
    
    // Create an image element to get natural dimensions
    const img = new Image()
    img.onload = () => {
      const aspectRatio = img.naturalWidth / img.naturalHeight
      const logoWidth = 35
      const logoHeight = logoWidth / aspectRatio
      
      // Add logo with proper aspect ratio
      doc.addImage(base64, 'PNG', x, y, logoWidth, logoHeight)
    }
    img.src = base64
    
    // Fallback dimensions if image doesn't load properly
    doc.addImage(base64, 'PNG', x, y, 35, 15)
  } catch (error) {
    console.error('Error loading logo:', error)
  }
}

const addText = (doc: jsPDF, text: string, x: number, y: number, maxWidth?: number): number => {
  if (!text || text.trim() === '') return y + 7
  
  if (maxWidth) {
    const lines = doc.splitTextToSize(text, maxWidth)
    doc.text(lines, x, y)
    return y + (lines.length * 7) + 2 // Better line spacing
  } else {
    doc.text(text, x, y)
    return y + 7
  }
}

const addSection = (doc: jsPDF, title: string, x: number, y: number): number => {
  // Add some padding before section
  y += 5
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 188, 212) // #00BCD4
  doc.text(title, x, y)
  
  // Add decorative line under section title
  doc.setDrawColor(0, 188, 212)
  doc.setLineWidth(0.8)
  doc.line(x, y + 2, x + 60, y + 2)
  
  // Add subtle background for section
  doc.setFillColor(248, 249, 250)
  doc.rect(x - 5, y - 8, 190, 12, 'F')
  
  // Rewrite the title over the background
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 188, 212)
  doc.text(title, x, y)
  
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(11)
  doc.setLineWidth(0.2)
  
  return y + 12
}

const addKeyValue = (doc: jsPDF, key: string, value: string, x: number, y: number, maxWidth: number = 85): number => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text(`${key}:`, x, y)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(40, 40, 40)
  
  const displayValue = value && value.trim() !== '' ? value : 'Not specified'
  return addText(doc, displayValue, x + 40, y, maxWidth)
}

const addKeyValueInline = (doc: jsPDF, key: string, value: string, x: number, y: number): number => {
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(60, 60, 60)
  doc.text(`${key}:`, x, y)
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(40, 40, 40)
  
  const displayValue = value && value.trim() !== '' ? value : 'Not specified'
  doc.text(displayValue, x + doc.getTextWidth(`${key}: `), y)
  
  return y + 8
}

const checkPageBreak = (doc: jsPDF, currentY: number, neededSpace: number = 25): number => {
  if (currentY + neededSpace > 270) { // Leave more margin at bottom
    doc.addPage()
    return 25 // Start with more top margin
  }
  return currentY
}

const addArraySection = (doc: jsPDF, title: string, items: any[], x: number, y: number, renderItem: (item: any, itemY: number) => number): number => {
  y = checkPageBreak(doc, y, 30)
  y = addSection(doc, title, x, y)
  
  if (!items || items.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    y = addText(doc, 'No information provided', x + 5, y)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    return y + 8
  }
  
  items.forEach((item, index) => {
    y = checkPageBreak(doc, y, 25)
    
    // Add item number for multiple items
    if (items.length > 1) {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.setTextColor(0, 188, 212)
      doc.text(`${index + 1}.`, x + 5, y)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      y += 5
    }
    
    y = renderItem(item, y + 5)
    y += 8 // Space between items
  })
  
  return y + 5
}

export const generateFormPDF = async (formData: FormDataForPDF, formId?: string): Promise<{ blob: Blob; filename: string }> => {
  const doc = new jsPDF('p', 'mm', 'a4')
  let currentY = 25

  // Header with elegant design
  doc.setFillColor(0, 188, 212)
  doc.rect(0, 0, 210, 35, 'F')
  
  doc.setFontSize(24)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text('ABANS GROUP', 20, 20)
  
  doc.setFontSize(14)
  doc.setFont('helvetica', 'normal')
  doc.text('Joining Formality Form', 20, 28)
  
  // Add logo to the right with proper scaling
  await addLogoToPDF(doc, 155, 8)
  
  currentY = 45
  
  // Form ID and date
  if (formId) {
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.setFont('helvetica', 'bold')
    doc.text(`Form ID: JFF-${formId}`, 20, currentY)
    currentY += 6
  }
  
  doc.setFont('helvetica', 'normal')
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}`, 20, currentY)
  currentY += 15

  // Personal Information Section
  currentY = checkPageBreak(doc, currentY, 100)
  currentY = addSection(doc, 'Personal Information', 20, currentY)
  
  // Two-column layout for personal info
  const leftCol = 20
  const rightCol = 110
  let leftY = currentY
  let rightY = currentY
  
  leftY = addKeyValue(doc, 'First Name', formData.first_name || '', leftCol, leftY, 60)
  rightY = addKeyValue(doc, 'Middle Name', formData.middle_name || '', rightCol, rightY, 60)
  
  const maxY1 = Math.max(leftY, rightY)
  leftY = rightY = maxY1
  
  leftY = addKeyValue(doc, 'Last Name', formData.last_name || '', leftCol, leftY, 60)
  rightY = addKeyValue(doc, 'Employee Code', formData.employee_code || '', rightCol, rightY, 60)
  
  const maxY2 = Math.max(leftY, rightY)
  leftY = rightY = maxY2
  
  leftY = addKeyValue(doc, 'Father/Husband Name', formData.father_husband_name || '', leftCol, leftY, 60)
  rightY = addKeyValue(doc, 'Department', formData.department || '', rightCol, rightY, 60)
  
  const maxY3 = Math.max(leftY, rightY)
  leftY = rightY = maxY3
  
  leftY = addKeyValue(doc, 'Date of Joining', formData.date_of_joining || '', leftCol, leftY, 60)
  rightY = addKeyValue(doc, 'Place/Location', formData.place_location || '', rightCol, rightY, 60)
  
  const maxY4 = Math.max(leftY, rightY)
  leftY = rightY = maxY4
  
  leftY = addKeyValue(doc, 'Date of Birth', formData.date_of_birth || '', leftCol, leftY, 60)
  rightY = addKeyValue(doc, 'Blood Group', formData.blood_group || '', rightCol, rightY, 60)
  
  currentY = Math.max(leftY, rightY) + 5
  
  // Contact Information
  currentY = addKeyValue(doc, 'Phone (Residence)', formData.phone_residence || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Phone (Mobile)', formData.phone_mobile || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Personal Email', formData.personal_email || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Marital Status', formData.marital_status || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Nationality', formData.nationality || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'UAN', formData.uan || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Last PF No', formData.last_pf_no || '', 20, currentY, 160)
  
  currentY += 5
  currentY = addKeyValue(doc, 'Present Address', formData.present_address || '', 20, currentY, 160)
  currentY += 3
  currentY = addKeyValue(doc, 'Permanent Address', formData.permanent_address || '', 20, currentY, 160)
  currentY += 15

  // Emergency Contact Section
  currentY = checkPageBreak(doc, currentY, 50)
  currentY = addSection(doc, 'Emergency Contact', 20, currentY)
  currentY = addKeyValue(doc, 'Name', formData.emergency_contact_name || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Phone', formData.emergency_contact_phone || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Relationship', formData.emergency_contact_relationship || '', 20, currentY, 160)
  currentY += 3
  currentY = addKeyValue(doc, 'Address', formData.emergency_contact_address || '', 20, currentY, 160)
  currentY += 15

  // Nominee Details Section
  currentY = checkPageBreak(doc, currentY, 40)
  currentY = addSection(doc, 'Nominee Details', 20, currentY)
  currentY = addKeyValue(doc, 'Name', formData.nominee_name || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Date of Birth', formData.nominee_dob || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Mobile', formData.nominee_mobile || '', 20, currentY, 160)
  currentY = addKeyValue(doc, 'Relationship', formData.nominee_relationship || '', 20, currentY, 160)
  currentY += 15

  // Languages Known Section
  currentY = addArraySection(doc, 'Languages Known', formData.languages_known || [], 20, currentY, (lang, itemY) => {
    const skills = []
    if (lang.read) skills.push('Read')
    if (lang.write) skills.push('Write')
    if (lang.speak) skills.push('Speak')
    
    itemY = addKeyValueInline(doc, 'Language', lang.language || '', 25, itemY)
    return addKeyValueInline(doc, 'Skills', skills.length > 0 ? skills.join(', ') : 'None', 25, itemY)
  })

  // Family Dependants Section
  currentY = addArraySection(doc, 'Family Dependants', formData.family_dependants || [], 20, currentY, (dep, itemY) => {
    itemY = addKeyValueInline(doc, 'Name', dep.name || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Relationship', dep.relationship || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Mobile', dep.mobile || '', 25, itemY)
    return addKeyValueInline(doc, 'Occupation', dep.occupation || '', 25, itemY)
  })

  // Academic Qualifications Section
  currentY = addArraySection(doc, 'Academic Qualifications', formData.academic_qualifications || [], 20, currentY, (qual, itemY) => {
    itemY = addKeyValueInline(doc, 'Degree', qual.degree || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'University', qual.university || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Passing Year', qual.passing_year || '', 25, itemY)
    return addKeyValueInline(doc, 'Percentage', qual.percentage ? `${qual.percentage}%` : '', 25, itemY)
  })

  // Professional Qualifications Section
  currentY = addArraySection(doc, 'Professional Qualifications', formData.professional_qualifications || [], 20, currentY, (qual, itemY) => {
    itemY = addKeyValueInline(doc, 'Certification', qual.certification || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Institute', qual.institute || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Year', qual.year || '', 25, itemY)
    return addKeyValueInline(doc, 'Percentage', qual.percentage ? `${qual.percentage}%` : '', 25, itemY)
  })

  // Work Experience Section
  currentY = checkPageBreak(doc, currentY, 40)
  currentY = addSection(doc, 'Work Experience', 20, currentY)
  currentY = addKeyValueInline(doc, 'Is Fresher', formData.is_fresher ? 'Yes' : 'No', 20, currentY)
  currentY += 5
  
  if (formData.work_experience && formData.work_experience.length > 0) {
    currentY = addArraySection(doc, '', formData.work_experience, 20, currentY - 15, (exp, itemY) => {
      itemY = addKeyValueInline(doc, 'Organization', exp.organization || '', 25, itemY)
      itemY = addKeyValueInline(doc, 'Designation', exp.designation || '', 25, itemY)
      itemY = addKeyValueInline(doc, 'Type', exp.type || '', 25, itemY)
      itemY = addKeyValueInline(doc, 'Duration', exp.duration || '', 25, itemY)
      return addKeyValue(doc, 'Job Profile', exp.job_profile || '', 25, itemY, 140)
    })
  }
  currentY += 10

  // References Section
  currentY = addArraySection(doc, 'References', formData.references || [], 20, currentY, (ref, itemY) => {
    itemY = addKeyValueInline(doc, 'Name', ref.name || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Designation', ref.designation || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Company', ref.company || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Contact', ref.contact_no || '', 25, itemY)
    itemY = addKeyValueInline(doc, 'Email', ref.email || '', 25, itemY)
    return addKeyValue(doc, 'Address', ref.address || '', 25, itemY, 140)
  })

  // Declaration & Agreement Section
  currentY = checkPageBreak(doc, currentY, 50)
  currentY = addSection(doc, 'Declaration & Agreement', 20, currentY)
  currentY = addKeyValueInline(doc, 'Terms Accepted', formData.agreement_accepted ? 'Yes' : 'No', 20, currentY)
  currentY += 10
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(80, 80, 80)
  const declarationText = 'I hereby declare that the information furnished above is true to the best of my knowledge and belief. I understand that any false information may lead to the termination of employment.'
  currentY = addText(doc, declarationText, 20, currentY, 170)
  currentY += 20

  // Footer
  currentY = checkPageBreak(doc, currentY, 25)
  doc.setDrawColor(0, 188, 212)
  doc.setLineWidth(0.5)
  doc.line(20, currentY, 190, currentY)
  currentY += 8
  
  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
  doc.text('This document was generated automatically by ABANS Group E-Joining Formalities System', 20, currentY)
  currentY += 5
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
