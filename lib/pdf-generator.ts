
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
    
    // Add logo with proper aspect ratio - maintaining 2.5:1 ratio like in form
    const logoWidth = 35
    const logoHeight = 14
    doc.addImage(base64, 'PNG', x, y, logoWidth, logoHeight, undefined, 'FAST')
  } catch (error) {
    console.error('Error loading logo:', error)
  }
}

const checkPageBreak = (doc: jsPDF, currentY: number, neededSpace: number = 30): number => {
  if (currentY + neededSpace > 270) {
    doc.addPage()
    return 25
  }
  return currentY
}

const addSectionHeader = (doc: jsPDF, title: string, x: number, y: number): number => {
  y += 8
  
  // Section background - using form's dark theme accent color
  doc.setFillColor(0, 123, 138) // Slightly darker cyan for better contrast
  doc.rect(x, y - 6, 170, 12, 'F')
  
  // Section title
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(255, 255, 255)
  doc.text(title, x + 5, y + 2)
  
  // Reset colors
  doc.setTextColor(0, 0, 0)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  
  return y + 18
}

const addTable = (doc: jsPDF, data: Array<{label: string, value: string}>, x: number, y: number, colWidth1: number = 70, colWidth2: number = 100): number => {
  const rowHeight = 8
  const tableWidth = colWidth1 + colWidth2
  
  // Table border
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  
  data.forEach((row, index) => {
    const currentY = y + (index * rowHeight)
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250)
      doc.rect(x, currentY - 2, tableWidth, rowHeight, 'F')
    }
    
    // Cell borders
    doc.rect(x, currentY - 2, colWidth1, rowHeight)
    doc.rect(x + colWidth1, currentY - 2, colWidth2, rowHeight)
    
    // Label (left column)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(60, 60, 60)
    doc.text(row.label, x + 3, currentY + 3)
    
    // Value (right column)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(40, 40, 40)
    
    const displayValue = row.value && row.value.trim() !== '' ? row.value : 'Not specified'
    const textLines = doc.splitTextToSize(displayValue, colWidth2 - 6)
    
    if (textLines.length > 1) {
      // Multi-line text
      textLines.forEach((line: string, lineIndex: number) => {
        doc.text(line, x + colWidth1 + 3, currentY + 3 + (lineIndex * 4))
      })
    } else {
      doc.text(displayValue, x + colWidth1 + 3, currentY + 3)
    }
  })
  
  return y + (data.length * rowHeight) + 5
}

const addArrayTable = (doc: jsPDF, title: string, items: any[], x: number, y: number, columns: Array<{key: string, label: string, width: number}>): number => {
  y = checkPageBreak(doc, y, 40)
  y = addSectionHeader(doc, title, x, y)
  
  if (!items || items.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(120, 120, 120)
    doc.text('No information provided', x + 5, y)
    return y + 15
  }
  
  const rowHeight = 8
  const headerHeight = 10
  
  // Calculate total table width
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0)
  
  // Table header - matching section header color
  doc.setFillColor(0, 123, 138)
  doc.rect(x, y - 2, totalWidth, headerHeight, 'F')
  
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.setTextColor(255, 255, 255)
  
  let currentX = x
  columns.forEach(col => {
    doc.text(col.label, currentX + 2, y + 5)
    currentX += col.width
  })
  
  y += headerHeight
  
  // Table rows
  doc.setTextColor(40, 40, 40)
  doc.setFont('helvetica', 'normal')
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.5)
  
  items.forEach((item, index) => {
    // Check for page break
    if (y + rowHeight > 270) {
      doc.addPage()
      y = 25
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(248, 249, 250)
      doc.rect(x, y - 2, totalWidth, rowHeight, 'F')
    }
    
    // Cell borders and content
    currentX = x
    columns.forEach(col => {
      doc.rect(currentX, y - 2, col.width, rowHeight)
      
      const value = item[col.key] || ''
      let displayValue = ''
      
      if (col.key === 'skills' && Array.isArray(value)) {
        displayValue = value.join(', ')
      } else if (typeof value === 'boolean') {
        displayValue = value ? 'Yes' : 'No'
      } else {
        displayValue = String(value)
      }
      
      if (displayValue.trim() === '') displayValue = '-'
      
      const textLines = doc.splitTextToSize(displayValue, col.width - 4)
      if (textLines.length > 1) {
        doc.text(textLines[0] + '...', currentX + 2, y + 4)
      } else {
        doc.text(displayValue, currentX + 2, y + 4)
      }
      
      currentX += col.width
    })
    
    y += rowHeight
  })
  
  return y + 10
}

export const generateFormPDF = async (formData: FormDataForPDF, formId?: string): Promise<{ blob: Blob; filename: string }> => {
  const doc = new jsPDF('p', 'mm', 'a4')
  let currentY = 20

  // Header with logo - using dark theme colors
  doc.setFillColor(34, 40, 49) // Dark bluish background like form header
  doc.rect(0, 0, 210, 40, 'F')
  
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 188, 212) // Cyan color for main title
  doc.text('ABANS GROUP', 20, 20)
  
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(255, 255, 255) // White for subtitle
  doc.text('Joining Formality Form', 20, 30)
  
  // Add logo with proper scaling
  await addLogoToPDF(doc, 155, 10)
  
  currentY = 50
  
  // Form metadata
  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.setFont('helvetica', 'normal')
  
  if (formId) {
    doc.text(`Form ID: JFF-${formId}`, 20, currentY)
    currentY += 6
  }
  
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString('en-GB')}`, 20, currentY)
  currentY += 15

  // Personal Information Section
  currentY = checkPageBreak(doc, currentY, 100)
  currentY = addSectionHeader(doc, 'Personal Information', 20, currentY)
  
  const personalData = [
    { label: 'First Name', value: formData.first_name || '' },
    { label: 'Middle Name', value: formData.middle_name || '' },
    { label: 'Last Name', value: formData.last_name || '' },
    { label: 'Employee Code', value: formData.employee_code || '' },
    { label: 'Father/Husband Name', value: formData.father_husband_name || '' },
    { label: 'Department', value: formData.department || '' },
    { label: 'Date of Joining', value: formData.date_of_joining || '' },
    { label: 'Place/Location', value: formData.place_location || '' },
    { label: 'Date of Birth', value: formData.date_of_birth || '' },
    { label: 'Blood Group', value: formData.blood_group || '' },
    { label: 'Marital Status', value: formData.marital_status || '' },
    { label: 'Nationality', value: formData.nationality || '' },
    { label: 'Phone (Residence)', value: formData.phone_residence || '' },
    { label: 'Phone (Mobile)', value: formData.phone_mobile || '' },
    { label: 'Personal Email', value: formData.personal_email || '' },
    { label: 'UAN', value: formData.uan || '' },
    { label: 'Last PF No', value: formData.last_pf_no || '' },
    { label: 'Present Address', value: formData.present_address || '' },
    { label: 'Permanent Address', value: formData.permanent_address || '' }
  ]
  
  currentY = addTable(doc, personalData, 20, currentY)

  // Emergency Contact Section
  currentY = checkPageBreak(doc, currentY, 50)
  currentY = addSectionHeader(doc, 'Emergency Contact', 20, currentY)
  
  const emergencyData = [
    { label: 'Name', value: formData.emergency_contact_name || '' },
    { label: 'Phone', value: formData.emergency_contact_phone || '' },
    { label: 'Relationship', value: formData.emergency_contact_relationship || '' },
    { label: 'Address', value: formData.emergency_contact_address || '' }
  ]
  
  currentY = addTable(doc, emergencyData, 20, currentY)

  // Nominee Details Section
  currentY = checkPageBreak(doc, currentY, 50)
  currentY = addSectionHeader(doc, 'Nominee Details', 20, currentY)
  
  const nomineeData = [
    { label: 'Name', value: formData.nominee_name || '' },
    { label: 'Date of Birth', value: formData.nominee_dob || '' },
    { label: 'Mobile', value: formData.nominee_mobile || '' },
    { label: 'Relationship', value: formData.nominee_relationship || '' }
  ]
  
  currentY = addTable(doc, nomineeData, 20, currentY)

  // Languages Known Section
  const languagesWithSkills = (formData.languages_known || []).map(lang => ({
    language: lang.language || '',
    skills: [
      lang.read ? 'Read' : '',
      lang.write ? 'Write' : '',
      lang.speak ? 'Speak' : ''
    ].filter(Boolean)
  }))
  
  currentY = addArrayTable(doc, 'Languages Known', languagesWithSkills, 20, currentY, [
    { key: 'language', label: 'Language', width: 60 },
    { key: 'skills', label: 'Skills', width: 110 }
  ])

  // Family Dependants Section
  currentY = addArrayTable(doc, 'Family Dependants', formData.family_dependants || [], 20, currentY, [
    { key: 'name', label: 'Name', width: 50 },
    { key: 'relationship', label: 'Relationship', width: 40 },
    { key: 'mobile', label: 'Mobile', width: 40 },
    { key: 'occupation', label: 'Occupation', width: 40 }
  ])

  // Academic Qualifications Section
  currentY = addArrayTable(doc, 'Academic Qualifications', formData.academic_qualifications || [], 20, currentY, [
    { key: 'degree', label: 'Degree', width: 60 },
    { key: 'university', label: 'University', width: 60 },
    { key: 'passing_year', label: 'Year', width: 25 },
    { key: 'percentage', label: '%', width: 25 }
  ])

  // Professional Qualifications Section
  currentY = addArrayTable(doc, 'Professional Qualifications', formData.professional_qualifications || [], 20, currentY, [
    { key: 'certification', label: 'Certification', width: 60 },
    { key: 'institute', label: 'Institute', width: 60 },
    { key: 'year', label: 'Year', width: 25 },
    { key: 'percentage', label: '%', width: 25 }
  ])

  // Work Experience Section
  currentY = checkPageBreak(doc, currentY, 40)
  currentY = addSectionHeader(doc, 'Work Experience', 20, currentY)
  
  const workStatusData = [
    { label: 'Is Fresher', value: formData.is_fresher ? 'Yes' : 'No' }
  ]
  currentY = addTable(doc, workStatusData, 20, currentY)
  
  if (formData.work_experience && formData.work_experience.length > 0) {
    currentY += 5
    currentY = addArrayTable(doc, 'Work History', formData.work_experience, 20, currentY, [
      { key: 'organization', label: 'Organization', width: 50 },
      { key: 'designation', label: 'Designation', width: 40 },
      { key: 'type', label: 'Type', width: 30 },
      { key: 'duration', label: 'Duration', width: 50 }
    ])
  }

  // References Section
  currentY = addArrayTable(doc, 'References', formData.references || [], 20, currentY, [
    { key: 'name', label: 'Name', width: 45 },
    { key: 'designation', label: 'Designation', width: 40 },
    { key: 'company', label: 'Company', width: 45 },
    { key: 'contact_no', label: 'Contact', width: 40 }
  ])

  // Declaration Section
  currentY = checkPageBreak(doc, currentY, 50)
  currentY = addSectionHeader(doc, 'Declaration & Agreement', 20, currentY)
  
  const declarationData = [
    { label: 'Terms Accepted', value: formData.agreement_accepted ? 'Yes' : 'No' }
  ]
  currentY = addTable(doc, declarationData, 20, currentY)
  
  currentY += 10
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.setTextColor(80, 80, 80)
  const declarationText = 'I hereby declare that the information furnished above is true to the best of my knowledge and belief. I understand that any false information may lead to the termination of employment.'
  const declarationLines = doc.splitTextToSize(declarationText, 170)
  declarationLines.forEach((line: string, index: number) => {
    doc.text(line, 20, currentY + (index * 5))
  })
  currentY += declarationLines.length * 5 + 20

  // Candidate Signature Area
  currentY = checkPageBreak(doc, currentY, 40)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(40, 40, 40)
  doc.text('Candidate Signature:', 20, currentY)
  
  // Blank space for signature
  currentY += 25
  
  // Date line
  doc.text('Date: _______________', 20, currentY)
  
  currentY += 20

  // FOR HR USE ONLY Section
  currentY = checkPageBreak(doc, currentY, 80)
  currentY = addSectionHeader(doc, 'FOR HR USE ONLY', 20, currentY)
  
  const hrData = [
    { label: 'Employee Name', value: `${formData.first_name || ''} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim() },
    { label: 'Date of Joining', value: '_________________________' },
    { label: 'Employee Code', value: '_________________________' },
    { label: 'Company Name', value: '_________________________' }
  ]
  
  currentY = addTable(doc, hrData, 20, currentY)
  currentY += 15

  // HR Signatures - swapped positions
  currentY = checkPageBreak(doc, currentY, 40)
  
  // Left side - HR Head Signature
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(40, 40, 40)
  doc.text('HR Head Signature:', 20, currentY)
  currentY += 25
  doc.text('Date: ___________', 20, currentY)
  
  // Right side - Candidate Signature  
  doc.text('Candidate Signature:', 110, currentY - 25)
  doc.text('Date: ___________', 110, currentY)
  
  currentY += 20

  // Footer
  currentY = checkPageBreak(doc, currentY, 25)
  doc.setDrawColor(0, 123, 138)
  doc.setLineWidth(0.5)
  doc.line(20, currentY, 190, currentY)
  currentY += 8
  
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(120, 120, 120)
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
