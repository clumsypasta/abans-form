"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight, ChevronLeft, Check, Save, Moon, Sun, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { supabase, type InternshipFormData, isSupabaseConfigured } from "@/lib/supabase"
import { generateFormPDF, uploadPDFToSupabase } from "@/lib/pdf-generator"
import { useTheme } from "@/hooks/use-theme"
import { PersonalInfoSection } from "./sections/personal-info-section"
import { NomineeSection } from "./sections/nominee-section"
import { LanguagesSection } from "./sections/languages-section"
import { FamilySection } from "./sections/family-section"
import { AcademicSection } from "./sections/academic-section"
import { ProfessionalSection } from "./sections/professional-section"
import { WorkExperienceSection } from "./sections/work-experience-section"
import { DocumentsSection, type DocumentFiles } from "./sections/documents-section"
import { ReferenceSection } from "./sections/reference-section"
import { SuccessScreen } from "./success-screen"

const formSchema = z.object({
  // Personal Information
  first_name: z.string().optional(),
  middle_name: z.string().optional(),
  last_name: z.string().optional(),
  father_husband_name: z.string().optional(),
  department: z.string().optional(),
  date_of_joining: z.string().optional(),
  place_location: z.string().optional(),
  date_of_birth: z.string().optional(),
  present_address: z.string().optional(),
  permanent_address: z.string().optional(),
  phone_residence: z.string().optional(),
  phone_mobile: z.string().optional(),
  marital_status: z.string().optional(),
  nationality: z.string().optional(),
  blood_group: z.string().optional(),
  personal_email: z.string().optional(),
  uan: z.string().optional(),
  last_pf_no: z.string().optional(),

  // Emergency Contact
  emergency_contact_name: z.string().optional(),
  emergency_contact_address: z.string().optional(),
  emergency_contact_relationship: z.string().optional(),
  emergency_contact_phone: z.string().optional(),

  // Nominee
  nominee_name: z.string().optional(),
  nominee_dob: z.string().optional(),
  nominee_mobile: z.string().optional(),
  nominee_relationship: z.string().optional(),

  // Complex fields
  languages_known: z
    .array(
      z.object({
        language: z.string().optional(),
        read: z.boolean(),
        write: z.boolean(),
        speak: z.boolean(),
      }),
    )
    .optional(),
  family_dependants: z
    .array(
      z.object({
        name: z.string().optional(),
        relationship: z.string().optional(),
        mobile: z.string().optional(),
        occupation: z.string().optional(),
      }),
    )
    .optional(),
  academic_qualifications: z
    .array(
      z.object({
        degree: z.string().optional(),
        university: z.string().optional(),
        passing_year: z.string().optional(),
        percentage: z.string().optional(),
      }),
    )
    .optional(),
  professional_qualifications: z
    .array(
      z.object({
        certification: z.string().optional(),
        institute: z.string().optional(),
        year: z.string().optional(),
        percentage: z.string().optional(),
      }),
    )
    .optional(),
  is_fresher: z.boolean().default(false),
  work_experience: z
    .array(
      z.object({
        organization: z.string().optional(),
        type: z.string().optional(),
        duration: z.string().optional(),
        designation: z.string().optional(),
        job_profile: z.string().optional(),
      }),
    )
    .optional(),

  // References
  references: z
    .array(
      z.object({
        name: z.string().optional(),
        designation: z.string().optional(),
        company: z.string().optional(),
        address: z.string().optional(),
        contact_no: z.string().optional(),
        email: z.string().optional(),
      }),
    )
    .optional(),

  // Agreement
  agreement_accepted: z.boolean().default(false),
})

type FormData = z.infer<typeof formSchema>

const sections = [
  { id: "personal", title: "Personal Details", description: "Basic personal details" },
  { id: "languages", title: "Languages Known", description: "Language proficiency" },
  { id: "family", title: "Family Details", description: "Family members and dependants" },
  { id: "academic", title: "Academic Qualifications", description: "Educational background" },
  { id: "professional", title: "Professional Qualifications", description: "Certifications and training" },
  { id: "work", title: "Work Experience", description: "Employment history and nominee details" },
  { id: "documents", title: "Document Upload", description: "Upload required documents (KYC, Education, Employment)" },
  { id: "reference", title: "References", description: "Professional references (2 required)" },
]

export default function InternshipForm() {
  const [currentSection, setCurrentSection] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedFormData, setSubmittedFormData] = useState<FormData | null>(null)
  const [submittedFormId, setSubmittedFormId] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [documents, setDocuments] = useState<DocumentFiles>({
    kyc: { aadhar: null, pan: null },
    education: {
      ssc_marksheet: null,
      ssc_passing: null,
      hsc_marksheet: null,
      hsc_passing: null,
      graduation_marksheet: null,
      graduation_passing: null,
      postgrad_marksheet: null,
      postgrad_passing: null,
    },
    salary: {
      salary_slips: [],
      increment_letter: null,
      offer_letter: null,
      relieving_letter: null
    }
  })
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set())
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")
  const { theme, toggleTheme } = useTheme()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
    defaultValues: {
      languages_known: [{ language: "", read: false, write: false, speak: false }],
      family_dependants: [{ name: "", relationship: "", mobile: "", occupation: "" }],
      academic_qualifications: [{ degree: "", university: "", passing_year: "", percentage: "" }],
      professional_qualifications: [{ certification: "", institute: "", year: "", percentage: "" }],
      work_experience: [],
      references: [
        { name: "", designation: "", company: "", address: "", contact_no: "", email: "" },
        { name: "", designation: "", company: "", address: "", contact_no: "", email: "" },
      ],
      is_fresher: false,
      agreement_accepted: false,
    },
  })

  // Auto-save functionality
  useEffect(() => {
    const subscription = form.watch(() => {
      const timeoutId = setTimeout(() => {
        saveDraft()
      }, 2000)
      return () => clearTimeout(timeoutId)
    })
    return () => subscription.unsubscribe()
  }, [form])

  const saveDraft = async () => {
    if (!isSupabaseConfigured()) return

    try {
      const formData = form.getValues()
      localStorage.setItem("internship-form-draft", JSON.stringify(formData))
    } catch (error) {
      console.error("Error saving draft:", error)
    }
  }

  const saveAndProceed = async () => {
    setIsSaving(true)
    try {
      setCompletedSections((prev) => new Set([...prev, currentSection]))
      setSaveMessage("Section saved successfully!")
      setTimeout(() => setSaveMessage(""), 3000)

      if (currentSection < sections.length - 1) {
        setCurrentSection(currentSection + 1)
      }
    } catch (error) {
      setSaveMessage("Error saving section")
      setTimeout(() => setSaveMessage(""), 3000)
    } finally {
      setIsSaving(false)
    }
  }

  const uploadFile = async (file: File, path: string) => {
    const { data, error } = await supabase.storage.from("form-uploads").upload(path, file, { upsert: true })
    if (error) throw error
    const {
      data: { publicUrl },
    } = supabase.storage.from("form-uploads").getPublicUrl(path)
    return publicUrl
  }

  const onSubmit = async (data: FormData) => {

    setIsSubmitting(true)
    try {
      if (!isSupabaseConfigured()) {
        setSaveMessage("Form submission is not available - Supabase not configured")
        setTimeout(() => setSaveMessage(""), 3000)
        setIsSubmitting(false)
        return
      }

      let photoUrl = ""
      const documentUrls: Record<string, string> = {}

      if (photoFile) {
        try {
          const photoPath = `photos/${Date.now()}-${photoFile.name}`
          photoUrl = await uploadFile(photoFile, photoPath)
        } catch (uploadError) {
          console.error("Error uploading photo:", uploadError)
          setSaveMessage("Error uploading photo. Submitting without photo.")
          setTimeout(() => setSaveMessage(""), 3000)
        }
      }

      // Upload documents
      try {
        const timestamp = Date.now()

        // Upload KYC documents
        if (documents.kyc.aadhar) {
          const path = `documents/kyc/${timestamp}-aadhar-${documents.kyc.aadhar.name}`
          documentUrls.aadhar_url = await uploadFile(documents.kyc.aadhar, path)
        }
        if (documents.kyc.pan) {
          const path = `documents/kyc/${timestamp}-pan-${documents.kyc.pan.name}`
          documentUrls.pan_url = await uploadFile(documents.kyc.pan, path)
        }

        // Upload education documents
        const eduDocs = documents.education
        const eduFields = Object.keys(eduDocs) as Array<keyof typeof eduDocs>
        for (const field of eduFields) {
          const file = eduDocs[field]
          if (file) {
            const path = `documents/education/${timestamp}-${field}-${file.name}`
            documentUrls[`${field}_url`] = await uploadFile(file, path)
          }
        }

        // Upload salary documents
        if (documents.salary.increment_letter) {
          const path = `documents/salary/${timestamp}-increment-${documents.salary.increment_letter.name}`
          documentUrls.increment_letter_url = await uploadFile(documents.salary.increment_letter, path)
        }
        if (documents.salary.offer_letter) {
          const path = `documents/salary/${timestamp}-offer-${documents.salary.offer_letter.name}`
          documentUrls.offer_letter_url = await uploadFile(documents.salary.offer_letter, path)
        }
        if (documents.salary.relieving_letter) {
          const path = `documents/salary/${timestamp}-relieving-${documents.salary.relieving_letter.name}`
          documentUrls.relieving_letter_url = await uploadFile(documents.salary.relieving_letter, path)
        }

        // Upload salary slips
        const salarySlipUrls: string[] = []
        for (let i = 0; i < documents.salary.salary_slips.length; i++) {
          const file = documents.salary.salary_slips[i]
          const path = `documents/salary/${timestamp}-salary-slip-${i + 1}-${file.name}`
          const url = await uploadFile(file, path)
          salarySlipUrls.push(url)
        }
        if (salarySlipUrls.length > 0) {
          documentUrls.salary_slips_urls = JSON.stringify(salarySlipUrls)
        }
      } catch (uploadError) {
        console.error("Error uploading documents:", uploadError)
        setSaveMessage("Error uploading documents. Please try again.")
        setTimeout(() => setSaveMessage(""), 3000)
        return
      }

      // Convert empty date strings to null for proper database handling
      const processedData = { ...data }

      // Handle date fields - convert empty strings to null
      if (!processedData.date_of_joining || processedData.date_of_joining === '') {
        processedData.date_of_joining = undefined
      }
      if (!processedData.date_of_birth || processedData.date_of_birth === '') {
        processedData.date_of_birth = undefined
      }
      if (!processedData.nominee_dob || processedData.nominee_dob === '') {
        processedData.nominee_dob = undefined
      }

      const formData: Partial<InternshipFormData> = {
        ...processedData,
        photo_url: photoUrl,
        ...documentUrls,
        sections_completed: Array.from(completedSections).map((i) => sections[i].id),
      }

      const { data: insertedData, error } = await supabase.from("internship_forms").insert([formData]).select()

      if (error) {
        console.error("Supabase error:", error)
        setSaveMessage(`Database error: ${error.message}`)
        setTimeout(() => setSaveMessage(""), 5000)
        return
      }

      // Store form data and ID for PDF generation
      setSubmittedFormData(processedData)
      let recordId = null
      if (insertedData && insertedData[0]) {
        recordId = insertedData[0].id
        setSubmittedFormId(recordId?.toString())
      }

      // Generate PDF and store in database (background process)
      if (recordId) {
        try {
          // Small delay to ensure DOM is ready
          setTimeout(async () => {
            try {
              const { blob, filename } = await generateFormPDF(processedData, recordId.toString())
              const pdfUrl = await uploadPDFToSupabase(blob, filename)

              if (pdfUrl) {
                // Update the database record with PDF URL
                await supabase
                  .from("internship_forms")
                  .update({ pdf_url: pdfUrl })
                  .eq('id', recordId)
                console.log('PDF generated and stored in database')
              }
            } catch (pdfError) {
              console.error('Error generating PDF for database:', pdfError)
            }
          }, 1000)
        } catch (error) {
          console.error('Error in PDF generation process:', error)
        }
      }

      localStorage.removeItem("internship-form-draft")
      setIsSubmitted(true)
    } catch (error: any) {
      console.error("Error submitting form:", error)
      setSaveMessage(`Error submitting form: ${error.message || 'Unknown error'}`)
      setTimeout(() => setSaveMessage(""), 5000)
    } finally {
      setIsSubmitting(false)
    }
  }

  const goToSection = (index: number) => {
    setCurrentSection(index)
  }

  if (isSubmitted) {
    return <SuccessScreen formData={submittedFormData || undefined} formId={submittedFormId || undefined} />
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">E-Joining Formalities</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">ABANS Group</p>
            </div>
            <div className="flex items-center gap-4">
              <img 
                src={theme === "light" ? "/images/abansup-removebg-preview.png" : "/images/abans-logo.png"} 
                alt="ABANS Group" 
                className="h-8 w-auto" 
              />
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="sticky top-[73px] z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => goToSection(index)}
                  className={`flex items-center justify-center px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 whitespace-nowrap ${
                    completedSections.has(index)
                      ? "bg-green-500 text-white shadow-lg"
                      : index === currentSection
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {completedSections.has(index) ? <Check className="w-4 h-4" /> : `${index + 1} ${section.title}`}
                </button>
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentSection + 1} of {sections.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentSection + 1) / sections.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Save Message */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-32 right-6 z-50"
          >
            <div
              className={`px-4 py-2 rounded-lg shadow-lg ${
                saveMessage.includes("Error") || saveMessage.includes("required")
                  ? "bg-red-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              <div className="flex items-center gap-2">
                {saveMessage.includes("Error") || saveMessage.includes("required") ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                {saveMessage}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl border-0 overflow-hidden">
            <div className="p-8">
              {/* Section Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {sections[currentSection].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">{sections[currentSection].description}</p>
              </div>

              {/* Section Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="min-h-[400px]"
                >
                  {currentSection === 0 && (
                    <PersonalInfoSection form={form} photoFile={photoFile} setPhotoFile={setPhotoFile} />
                  )}
                  {currentSection === 1 && <LanguagesSection form={form} />}
                  {currentSection === 2 && <FamilySection form={form} />}
                  {currentSection === 3 && <AcademicSection form={form} />}
                  {currentSection === 4 && <ProfessionalSection form={form} />}
                  {currentSection === 5 && <WorkExperienceSection form={form} />}
                  {currentSection === 6 && <DocumentsSection form={form} documents={documents} setDocuments={setDocuments} />}
                  {currentSection === 7 && <ReferenceSection form={form} />}
                </motion.div>
              </AnimatePresence>

              {/* Agreement Checkbox (only on last section) */}
              {currentSection === sections.length - 1 && (
                <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="agreement"
                      checked={form.watch("agreement_accepted")}
                      onCheckedChange={(checked) => form.setValue("agreement_accepted", checked as boolean)}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <label
                        htmlFor="agreement"
                        className="text-sm font-medium text-gray-900 dark:text-white cursor-pointer"
                      >
                        I agree to the terms and conditions
                      </label>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        I hereby declare that the information furnished above is true to the best of my knowledge and
                        belief. I understand that any false information may lead to the termination of the employment.
                      </p>
                    </div>
                  </div>
                  {form.formState.errors.agreement_accepted && (
                    <p className="text-red-600 dark:text-red-400 text-sm mt-2">
                      {form.formState.errors.agreement_accepted.message}
                    </p>
                  )}
                </div>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                <Button
                  type="button"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                  variant="outline"
                  className="rounded-full px-6 py-3"
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>

                <div className="flex items-center gap-4">
                  {currentSection < sections.length - 1 ? (
                    <>
                      <Button
                        type="button"
                        onClick={saveAndProceed}
                        disabled={isSaving}
                        className="rounded-full px-6 py-3 bg-blue-500 hover:bg-blue-600"
                      >
                        {isSaving ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Save & Proceed
                          </>
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-full px-8 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          Submit Application
                          <ChevronRight className="w-4 h-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </form>
      </main>
    </div>
  )
}