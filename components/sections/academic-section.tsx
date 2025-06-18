"use client"

import type { UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"

interface AcademicSectionProps {
  form: UseFormReturn<any>
}

export function AcademicSection({ form }: AcademicSectionProps) {
  const qualifications = form.watch("academic_qualifications") || []

  const addQualification = () => {
    const currentQualifications = form.getValues("academic_qualifications") || []
    form.setValue("academic_qualifications", [
      ...currentQualifications,
      { degree: "", university: "", passing_year: "", percentage: "" },
    ])
  }

  const removeQualification = (index: number) => {
    const currentQualifications = form.getValues("academic_qualifications") || []
    form.setValue(
      "academic_qualifications",
      currentQualifications.filter((_, i) => i !== index),
    )
  }

  const updateQualification = (index: number, field: string, value: string) => {
    const currentQualifications = form.getValues("academic_qualifications") || []
    const updatedQualifications = [...currentQualifications]
    updatedQualifications[index] = { ...updatedQualifications[index], [field]: value }
    form.setValue("academic_qualifications", updatedQualifications)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Academic Qualifications</h3>
        <Button
          type="button"
          onClick={addQualification}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Qualification
        </Button>
      </div>

      {qualifications.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No qualifications added yet. Click "Add Qualification" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {qualifications.map((qualification: any, index: number) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <FloatingInput
                  label="Degree"
                  value={qualification.degree}
                  onChange={(e) => updateQualification(index, "degree", e.target.value)}
                />
                <FloatingInput
                  label="University"
                  value={qualification.university}
                  onChange={(e) => updateQualification(index, "university", e.target.value)}
                />
                <FloatingInput
                  label="Passing Year"
                  value={qualification.passing_year}
                  onChange={(e) => updateQualification(index, "passing_year", e.target.value)}
                />
                <FloatingInput
                  label="% Marks"
                  value={qualification.percentage}
                  onChange={(e) => updateQualification(index, "percentage", e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={() => removeQualification(index)}
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-600 dark:text-red-400 dark:hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
