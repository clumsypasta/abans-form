
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
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

const getLogoAsBase64 = async (): Promise<string> => {
  try {
    const response = await fetch('/images/abans-logo.png')
    if (!response.ok) throw new Error('Failed to fetch logo')
    
    const blob = await response.blob()
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch (error) {
    console.error('Error loading logo:', error)
    return ''
  }
}

export const generateFormPDF = async (formData: FormDataForPDF, formId?: string): Promise<{ blob: Blob; filename: string }> => {
  // Get logo as base64
  const logoBase64 = await getLogoAsBase64()
  
  // Create a hidden div with the form content
  const tempDiv = document.createElement('div')
  tempDiv.style.position = 'absolute'
  tempDiv.style.left = '-9999px'
  tempDiv.style.top = '0'
  tempDiv.style.width = '800px' // Fixed width for consistent rendering
  tempDiv.style.backgroundColor = 'white'
  tempDiv.style.padding = '40px'
  tempDiv.style.fontFamily = 'Arial, sans-serif'
  tempDiv.style.fontSize = '14px'
  tempDiv.style.lineHeight = '1.6'
  tempDiv.style.color = 'black'
  tempDiv.style.boxSizing = 'border-box'

  // Build the HTML content with page break handling
  const htmlContent = `
    <div style="max-width: 100%; margin: 0 auto; page-break-inside: avoid;">
      <!-- Header -->
      <div style="position: relative; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #00BCD4; padding-bottom: 20px; page-break-inside: avoid;">
        ${logoBase64 ? `<div style="position: absolute; top: 0; right: 0; z-index: 10;">
          <img src="${logoBase64}" alt="ABANS Group" style="height: 80px; width: auto; max-width: 200px; display: block;" />
        </div>` : ''}
        <div style="padding-right: 220px;">
          <h1 style="color: #00BCD4; margin: 0; font-size: 28px; font-weight: bold;">ABANS GROUP</h1>
          <h2 style="color: #333; margin: 15px 0 0 0; font-size: 20px;">Joining Formality Form</h2>
          ${formId ? `<p style="margin: 10px 0 0 0; color: #666; font-size: 12px;">Form ID: JFF-${formId}</p>` : ''}
          <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">Generated on: ${new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <!-- Personal Information -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Personal Information</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px; page-break-inside: avoid;">
          <div style="padding: 5px 0;"><strong>First Name:</strong> ${formData.first_name || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Middle Name:</strong> ${formData.middle_name || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Last Name:</strong> ${formData.last_name || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Employee Code:</strong> ${formData.employee_code || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Father/Husband Name:</strong> ${formData.father_husband_name || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Department:</strong> ${formData.department || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Company:</strong> ${formData.company_name || 'ABANS Group'}</div>
          <div style="padding: 5px 0;"><strong>Date of Joining:</strong> ${formData.date_of_joining || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Place/Location:</strong> ${formData.place_location || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Date of Birth:</strong> ${formData.date_of_birth || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Phone (Residence):</strong> ${formData.phone_residence || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Phone (Mobile):</strong> ${formData.phone_mobile || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Marital Status:</strong> ${formData.marital_status || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Nationality:</strong> ${formData.nationality || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Blood Group:</strong> ${formData.blood_group || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Personal Email:</strong> ${formData.personal_email || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>UAN:</strong> ${formData.uan || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Last PF No:</strong> ${formData.last_pf_no || 'N/A'}</div>
        </div>
        <div style="margin-bottom: 15px; page-break-inside: avoid;">
          <div style="margin-bottom: 8px; font-weight: bold;">Present Address:</div>
          <div style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; word-wrap: break-word;">${formData.present_address || 'N/A'}</div>
        </div>
        <div style="page-break-inside: avoid;">
          <div style="margin-bottom: 8px; font-weight: bold;">Permanent Address:</div>
          <div style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; word-wrap: break-word;">${formData.permanent_address || 'N/A'}</div>
        </div>
      </div>

      <!-- Emergency Contact -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Emergency Contact</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
          <div style="padding: 5px 0;"><strong>Name:</strong> ${formData.emergency_contact_name || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Phone:</strong> ${formData.emergency_contact_phone || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Relationship:</strong> ${formData.emergency_contact_relationship || 'N/A'}</div>
        </div>
        <div style="page-break-inside: avoid;">
          <div style="margin-bottom: 8px; font-weight: bold;">Address:</div>
          <div style="padding: 10px; border: 1px solid #ddd; background: #f9f9f9; word-wrap: break-word;">${formData.emergency_contact_address || 'N/A'}</div>
        </div>
      </div>

      <!-- Nominee Details -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Nominee Details</h3>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <div style="padding: 5px 0;"><strong>Name:</strong> ${formData.nominee_name || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Date of Birth:</strong> ${formData.nominee_dob || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Mobile:</strong> ${formData.nominee_mobile || 'N/A'}</div>
          <div style="padding: 5px 0;"><strong>Relationship:</strong> ${formData.nominee_relationship || 'N/A'}</div>
        </div>
      </div>

      <!-- Languages Known -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Languages Known</h3>
        ${formData.languages_known && formData.languages_known.length > 0 ? 
          formData.languages_known.map((lang, index) => `
            <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #ddd; background: #f9f9f9; page-break-inside: avoid;">
              <strong>${lang.language || 'N/A'}</strong> - 
              Read: ${lang.read ? 'Yes' : 'No'}, 
              Write: ${lang.write ? 'Yes' : 'No'}, 
              Speak: ${lang.speak ? 'Yes' : 'No'}
            </div>
          `).join('') 
          : '<div style="padding: 10px;">No languages specified</div>'
        }
      </div>

      <!-- Family Dependants -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Family Dependants</h3>
        ${formData.family_dependants && formData.family_dependants.length > 0 ? 
          formData.family_dependants.map((dep, index) => `
            <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #ddd; background: #f9f9f9; page-break-inside: avoid;">
              <strong>${dep.name || 'N/A'}</strong> - ${dep.relationship || 'N/A'}<br>
              Mobile: ${dep.mobile || 'N/A'}, Occupation: ${dep.occupation || 'N/A'}
            </div>
          `).join('') 
          : '<div style="padding: 10px;">No dependants specified</div>'
        }
      </div>

      <!-- Academic Qualifications -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Academic Qualifications</h3>
        ${formData.academic_qualifications && formData.academic_qualifications.length > 0 ? 
          formData.academic_qualifications.map((qual, index) => `
            <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #ddd; background: #f9f9f9; page-break-inside: avoid;">
              <strong>${qual.degree || 'N/A'}</strong> - ${qual.university || 'N/A'}<br>
              Year: ${qual.passing_year || 'N/A'}, Percentage: ${qual.percentage || 'N/A'}%
            </div>
          `).join('') 
          : '<div style="padding: 10px;">No academic qualifications specified</div>'
        }
      </div>

      <!-- Professional Qualifications -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Professional Qualifications</h3>
        ${formData.professional_qualifications && formData.professional_qualifications.length > 0 ? 
          formData.professional_qualifications.map((qual, index) => `
            <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #ddd; background: #f9f9f9; page-break-inside: avoid;">
              <strong>${qual.certification || 'N/A'}</strong> - ${qual.institute || 'N/A'}<br>
              Year: ${qual.year || 'N/A'}, Percentage: ${qual.percentage || 'N/A'}%
            </div>
          `).join('') 
          : '<div style="padding: 10px;">No professional qualifications specified</div>'
        }
      </div>

      <!-- Work Experience -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Work Experience</h3>
        <div style="margin-bottom: 15px; padding: 5px 0; font-weight: bold;">Is Fresher: ${formData.is_fresher ? 'Yes' : 'No'}</div>
        ${formData.work_experience && formData.work_experience.length > 0 ? 
          formData.work_experience.map((exp, index) => `
            <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #ddd; background: #f9f9f9; page-break-inside: avoid;">
              <strong>${exp.organization || 'N/A'}</strong> - ${exp.designation || 'N/A'}<br>
              Type: ${exp.type || 'N/A'}, Duration: ${exp.duration || 'N/A'}<br>
              Job Profile: ${exp.job_profile || 'N/A'}
            </div>
          `).join('') 
          : '<div style="padding: 10px;">No work experience specified</div>'
        }
      </div>

      <!-- References -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">References</h3>
        ${formData.references && formData.references.length > 0 ? 
          formData.references.map((ref, index) => `
            <div style="margin-bottom: 12px; padding: 12px; border: 1px solid #ddd; background: #f9f9f9; page-break-inside: avoid;">
              <strong>${ref.name || 'N/A'}</strong> - ${ref.designation || 'N/A'}<br>
              Company: ${ref.company || 'N/A'}<br>
              Contact: ${ref.contact_no || 'N/A'}, Email: ${ref.email || 'N/A'}<br>
              Address: ${ref.address || 'N/A'}
            </div>
          `).join('') 
          : '<div style="padding: 10px;">No references specified</div>'
        }
      </div>

      <!-- Agreement -->
      <div style="margin-bottom: 30px; page-break-inside: avoid;">
        <h3 style="color: #00BCD4; border-bottom: 1px solid #ddd; padding-bottom: 8px; margin-bottom: 20px; font-size: 18px; page-break-after: avoid;">Agreement</h3>
        <div style="margin-bottom: 15px; padding: 5px 0; font-weight: bold;">Terms and Conditions Accepted: ${formData.agreement_accepted ? 'Yes' : 'No'}</div>
        <div style="margin-top: 15px; padding: 15px; border: 1px solid #ddd; background: #f9f9f9; font-size: 12px; line-height: 1.6; page-break-inside: avoid;">
          I hereby declare that the information furnished above is true to the best of my knowledge and belief. 
          I understand that any false information may lead to the termination of the employment.
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; page-break-inside: avoid;">
        <p style="margin: 10px 0;">This document was generated automatically by ABANS Group E-Joining Formalities System</p>
        <p style="margin: 10px 0;">For any queries, contact: hr@abans.lk | +94 11 234 5678</p>
      </div>
    </div>
  `

  tempDiv.innerHTML = htmlContent
  document.body.appendChild(tempDiv)

  try {
    // Generate canvas from HTML
    const canvas = await html2canvas(tempDiv, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: '#ffffff',
      width: tempDiv.scrollWidth,
      height: tempDiv.scrollHeight,
      logging: false,
      foreignObjectRendering: true
    })

    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgData = canvas.toDataURL('image/png')
    
    const imgWidth = 210 // A4 width in mm
    const pageHeight = 295 // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight

    let position = 0

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    // Generate blob
    const blob = pdf.output('blob')
    const filename = `ABANS_Joining_Form_${formData.first_name || 'Unknown'}_${formData.last_name || 'User'}_${Date.now()}.pdf`

    return { blob, filename }
  } finally {
    // Clean up
    document.body.removeChild(tempDiv)
  }
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
