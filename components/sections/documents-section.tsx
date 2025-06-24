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
    relieving_letter: File | null
  }
}

export function DocumentsSection({ form, documents, setDocuments }: DocumentsSectionProps) {
  const [uploadErrors, setUploadErrors] = useState<Record<string, string>>({})

  // File size limit: 2MB per file
  const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB in bytes
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg']

  const validateFile = (file: File): string | null => {
    return null
  }

  const handleFileUpload = (
    file: File,
    category: 'kyc' | 'education' | 'salary',
    field: string
  ) => {
    setDocuments(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: file
      }
    }))
  }

  const handleSalarySlipsUpload = (files: FileList) => {
    const validFiles: File[] = Array.from(files)

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
    accept = "image/jpeg",
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
    <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
      <div className="space-y-3">
        <div className="flex items-center justify-center">
          <FileText className="w-10 h-10 text-blue-500 dark:text-blue-400" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
          {title}
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
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </label>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-4 rounded-xl border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-green-700 dark:text-green-300 font-medium truncate">
                {file.name}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full"
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
          <div className="flex items-center justify-center gap-1 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
            <AlertCircle className="w-3 h-3" />
            {uploadErrors[errorKey]}
          </div>
        )}
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">
        Max 2MB • JPEG only
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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-2xl border border-blue-200 dark:border-blue-800">
        <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          KYC Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadCard
            title="Aadhar Card"
            file={documents.kyc.aadhar}
            onUpload={(file) => handleFileUpload(file, 'kyc', 'aadhar')}
            onRemove={() => removeFile('kyc', 'aadhar')}
            errorKey="kyc.aadhar"
          />
          <FileUploadCard
            title="PAN Card"
            file={documents.kyc.pan}
            onUpload={(file) => handleFileUpload(file, 'kyc', 'pan')}
            onRemove={() => removeFile('kyc', 'pan')}
            errorKey="kyc.pan"
          />
        </div>
      </div>

      {/* Education Documents */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 p-6 rounded-2xl border border-emerald-200 dark:border-emerald-800">
        <h3 className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Education Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FileUploadCard
            title="SSC Marksheet"
            file={documents.education.ssc_marksheet}
            onUpload={(file) => handleFileUpload(file, 'education', 'ssc_marksheet')}
            onRemove={() => removeFile('education', 'ssc_marksheet')}
            errorKey="education.ssc_marksheet"
          />
          <FileUploadCard
            title="SSC Passing Certificate"
            file={documents.education.ssc_passing}
            onUpload={(file) => handleFileUpload(file, 'education', 'ssc_passing')}
            onRemove={() => removeFile('education', 'ssc_passing')}
            errorKey="education.ssc_passing"
          />
          <FileUploadCard
            title="HSC Marksheet"
            file={documents.education.hsc_marksheet}
            onUpload={(file) => handleFileUpload(file, 'education', 'hsc_marksheet')}
            onRemove={() => removeFile('education', 'hsc_marksheet')}
            errorKey="education.hsc_marksheet"
          />
          <FileUploadCard
            title="HSC Passing Certificate"
            file={documents.education.hsc_passing}
            onUpload={(file) => handleFileUpload(file, 'education', 'hsc_passing')}
            onRemove={() => removeFile('education', 'hsc_passing')}
            errorKey="education.hsc_passing"
          />
          <FileUploadCard
            title="Graduation Marksheet"
            file={documents.education.graduation_marksheet}
            onUpload={(file) => handleFileUpload(file, 'education', 'graduation_marksheet')}
            onRemove={() => removeFile('education', 'graduation_marksheet')}
            errorKey="education.graduation_marksheet"
          />
          <FileUploadCard
            title="Graduation Passing Certificate"
            file={documents.education.graduation_passing}
            onUpload={(file) => handleFileUpload(file, 'education', 'graduation_passing')}
            onRemove={() => removeFile('education', 'graduation_passing')}
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
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 p-6 rounded-2xl border border-purple-200 dark:border-purple-800">
        <h3 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-6 flex items-center">
          <FileText className="w-6 h-6 mr-2" />
          Employment Documents
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Salary Slips - Multiple Files */}
          <div className="border-2 border-dashed border-blue-200 dark:border-blue-800 rounded-xl p-6 text-center hover:border-blue-300 dark:hover:border-blue-700 transition-colors bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20">
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                <FileText className="w-10 h-10 text-blue-500 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                Salary Slips (Last 3 months)
              </h4>

              {documents.salary.salary_slips.length === 0 ? (
                <div>
                  <input
                    type="file"
                    accept="image/jpeg"
                    multiple
                    onChange={(e) => {
                      if (e.target.files) handleSalarySlipsUpload(e.target.files)
                    }}
                    className="hidden"
                    id="upload-salary-slips"
                  />
                  <label
                    htmlFor="upload-salary-slips"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg font-medium text-sm"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Files
                  </label>
                </div>
              ) : (
                <div className="space-y-2">
                  {documents.salary.salary_slips.map((file, index) => (
                    <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 p-3 rounded-xl border border-green-200 dark:border-green-700">
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
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFile('salary', 'salary_slips')}
                    className="w-full mt-2 rounded-full"
                  >
                    Remove All
                  </Button>
                </div>
              )}

              {uploadErrors['salary.salary_slips'] && (
                <div className="flex items-center justify-center gap-1 text-red-500 text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded-lg">
                  <AlertCircle className="w-3 h-3" />
                  {uploadErrors['salary.salary_slips']}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 font-medium">
              Max 3 files • 2MB each • JPEG only
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
          <FileUploadCard
            title="Relieving Letter"
            file={documents.salary.relieving_letter}
            onUpload={(file) => handleFileUpload(file, 'salary', 'relieving_letter')}
            onRemove={() => removeFile('salary', 'relieving_letter')}
            errorKey="salary.relieving_letter"
          />
        </div>
      </div>
    </div>
  )
}