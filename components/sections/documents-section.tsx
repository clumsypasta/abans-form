
"use client"

import React, { useState } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Upload, X, FileText, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentsSectionProps {
  form: UseFormReturn<any>
  documents: DocumentFiles
  setDocuments: React.Dispatch<React.SetStateAction<DocumentFiles>>
}

export interface DocumentFiles {
  kyc: {
    aadhar: File | null
    pan: File | null
  }
  education: {
    ssc_marksheet: File | null
    ssc_passing: File | null
    hsc_marksheet: File | null
    hsc_passing: File | null
    graduation_marksheet: File | null
    graduation_passing: File | null
    postgrad_marksheet: File | null
    postgrad_passing: File | null
  }
  salary: {
    salary_slips: File[]
    increment_letter: File | null
    offer_letter: File | null
  }
}

export function DocumentsSection({ form, documents, setDocuments }: DocumentsSectionProps) {
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})
  
  // File size limit: 5MB per file
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB in bytes
  const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

  const validateFile = (file: File): string | null => {
    if (file.size > MAX_FILE_SIZE) {
      return "File size must be less than 5MB"
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only PDF, JPEG, PNG files are allowed"
    }
    return null
  }

  const handleFileUpload = (
    file: File,
    category: 'kyc' | 'education' | 'salary',
    field: string
  ) => {
    const error = validateFile(file)
    const errorKey = `${category}.${field}`
    
    if (error) {
      setUploadErrors(prev => ({ ...prev, [errorKey]: error }))
      return
    }

    // Clear any previous error
    setUploadErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[errorKey]
      return newErrors
    })

    setDocuments(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: file
      }
    }))
  }

  const handleSalarySlipsUpload = (files: FileList) => {
    const validFiles: File[] = []
    const errors: string[] = []

    Array.from(files).forEach((file, index) => {
      const error = validateFile(file)
      if (error) {
        errors.push(`File ${index + 1}: ${error}`)
      } else {
        validFiles.push(file)
      }
    })

    if (errors.length > 0) {
      setUploadErrors(prev => ({ ...prev, 'salary.salary_slips': errors.join('; ') }))
      return
    }

    if (validFiles.length > 6) {
      setUploadErrors(prev => ({ ...prev, 'salary.salary_slips': 'Maximum 6 salary slips allowed' }))
      return
    }

    setUploadErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors['salary.salary_slips']
      return newErrors
    })

    setDocuments(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        salary_slips: validFiles
      }
    }))
  }

  const removeFile = (category: 'kyc' | 'education' | 'salary', field: string) => {
    setDocuments(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: field === 'salary_slips' ? [] : null
      }
    }))
    
    const errorKey = `${category}.${field}`
    setUploadErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[errorKey]
      return newErrors
    })
  }

  const FileUploadCard = ({ 
    title, 
    file, 
    onUpload, 
    onRemove, 
    required = false,
    accept = "image/*,.pdf",
    errorKey
  }: {
    title: string
    file: File | null
    onUpload: (file: File) => void
    onRemove: () => void
    required?: boolean
    accept?: string
    errorKey: string
  }) => (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
      <div className="space-y-2">
        <div className="flex items-center justify-center">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="font-medium text-gray-900 dark:text-white">
          {title} {required && <span className="text-red-500">*</span>}
        </h4>
        
        {!file ? (
          <div>
            <input
              type="file"
              accept={accept}
              onChange={(e) => {
                const selectedFile = e.target.files?.[0]
                if (selectedFile) onUpload(selectedFile)
              }}
              className="hidden"
              id={`upload-${errorKey}`}
            />
            <label
              htmlFor={`upload-${errorKey}`}
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
            >
              <Upload className="w-4 h-4 mr-2" />
              Upload File
            </label>
          </div>
        ) : (
          <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700 dark:text-green-300 font-medium truncate">
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        
        {uploadErrors[errorKey] && (
          <div className="flex items-center gap-1 text-red-500 text-xs">
            <AlertCircle className="w-3 h-3" />
            {uploadErrors[errorKey]}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
        Max 5MB • PDF, JPEG, PNG only
      </p>
    </div>
  )

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please upload the required documents. All files must be under 5MB and in PDF, JPEG, or PNG format.
        </p>
      </div>

      {/* KYC Documents */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          KYC Documents <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadCard
            title="Aadhar Card"
            file={documents.kyc.aadhar}
            onUpload={(file) => handleFileUpload(file, 'kyc', 'aadhar')}
            onRemove={() => removeFile('kyc', 'aadhar')}
            required
            errorKey="kyc.aadhar"
          />
          <FileUploadCard
            title="PAN Card"
            file={documents.kyc.pan}
            onUpload={(file) => handleFileUpload(file, 'kyc', 'pan')}
            onRemove={() => removeFile('kyc', 'pan')}
            required
            errorKey="kyc.pan"
          />
        </div>
      </div>

      {/* Education Documents */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Education Documents <span className="text-red-500">*</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadCard
            title="SSC Marksheet"
            file={documents.education.ssc_marksheet}
            onUpload={(file) => handleFileUpload(file, 'education', 'ssc_marksheet')}
            onRemove={() => removeFile('education', 'ssc_marksheet')}
            required
            errorKey="education.ssc_marksheet"
          />
          <FileUploadCard
            title="SSC Passing Certificate"
            file={documents.education.ssc_passing}
            onUpload={(file) => handleFileUpload(file, 'education', 'ssc_passing')}
            onRemove={() => removeFile('education', 'ssc_passing')}
            required
            errorKey="education.ssc_passing"
          />
          <FileUploadCard
            title="HSC Marksheet"
            file={documents.education.hsc_marksheet}
            onUpload={(file) => handleFileUpload(file, 'education', 'hsc_marksheet')}
            onRemove={() => removeFile('education', 'hsc_marksheet')}
            required
            errorKey="education.hsc_marksheet"
          />
          <FileUploadCard
            title="HSC Passing Certificate"
            file={documents.education.hsc_passing}
            onUpload={(file) => handleFileUpload(file, 'education', 'hsc_passing')}
            onRemove={() => removeFile('education', 'hsc_passing')}
            required
            errorKey="education.hsc_passing"
          />
          <FileUploadCard
            title="Graduation Marksheet"
            file={documents.education.graduation_marksheet}
            onUpload={(file) => handleFileUpload(file, 'education', 'graduation_marksheet')}
            onRemove={() => removeFile('education', 'graduation_marksheet')}
            required
            errorKey="education.graduation_marksheet"
          />
          <FileUploadCard
            title="Graduation Passing Certificate"
            file={documents.education.graduation_passing}
            onUpload={(file) => handleFileUpload(file, 'education', 'graduation_passing')}
            onRemove={() => removeFile('education', 'graduation_passing')}
            required
            errorKey="education.graduation_passing"
          />
          <FileUploadCard
            title="Post Graduation Marksheet"
            file={documents.education.postgrad_marksheet}
            onUpload={(file) => handleFileUpload(file, 'education', 'postgrad_marksheet')}
            onRemove={() => removeFile('education', 'postgrad_marksheet')}
            errorKey="education.postgrad_marksheet"
          />
          <FileUploadCard
            title="Post Graduation Passing Certificate"
            file={documents.education.postgrad_passing}
            onUpload={(file) => handleFileUpload(file, 'education', 'postgrad_passing')}
            onRemove={() => removeFile('education', 'postgrad_passing')}
            errorKey="education.postgrad_passing"
          />
        </div>
      </div>

      {/* Salary/Employment Documents */}
      <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Employment Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Slips - Multiple Files */}
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
            <div className="space-y-2">
              <div className="flex items-center justify-center">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="font-medium text-gray-900 dark:text-white">
                Salary Slips (Last 6 months)
              </h4>
              
              {documents.salary.salary_slips.length === 0 ? (
                <div>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) handleSalarySlipsUpload(e.target.files)
                    }}
                    className="hidden"
                    id="upload-salary-slips"
                  />
                  <label
                    htmlFor="upload-salary-slips"
                    className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.salary.salary_slips.map((file, index) => (
                    <div key={index} className="bg-green-50 dark:bg-green-900/20 p-2 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-700 dark:text-green-300 font-medium truncate">
                          {file.name}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setDocuments(prev => ({
                              ...prev,
                              salary: {
                                ...prev.salary,
                                salary_slips: prev.salary.salary_slips.filter((_, i) => i !== index)
                              }
                            }))
                          }}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile('salary', 'salary_slips')}
                    className="w-full"
                  >
                    Remove All
                  </Button>
                </div>
              )}
              
              {uploadErrors['salary.salary_slips'] && (
                <div className="flex items-center gap-1 text-red-500 text-xs">
                  <AlertCircle className="w-3 h-3" />
                  {uploadErrors['salary.salary_slips']}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Max 6 files • 5MB each • PDF, JPEG, PNG only
            </p>
          </div>

          <FileUploadCard
            title="Increment Letter"
            file={documents.salary.increment_letter}
            onUpload={(file) => handleFileUpload(file, 'salary', 'increment_letter')}
            onRemove={() => removeFile('salary', 'increment_letter')}
            errorKey="salary.increment_letter"
          />
          <FileUploadCard
            title="Offer Letter"
            file={documents.salary.offer_letter}
            onUpload={(file) => handleFileUpload(file, 'salary', 'offer_letter')}
            onRemove={() => removeFile('salary', 'offer_letter')}
            errorKey="salary.offer_letter"
          />
        </div>
      </div>
    </div>
  )
}
