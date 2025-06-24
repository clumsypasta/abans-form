"use client"

import type { UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { NomineeSection } from "./nominee-section"

interface WorkExperienceSectionProps {
  form: UseFormReturn<any>
}

export function WorkExperienceSection({ form }: WorkExperienceSectionProps) {
  const isFresher = form.watch("is_fresher")
  const workExperience = form.watch("work_experience") || []

  const addExperience = () => {
    const currentExperience = form.getValues("work_experience") || []
    form.setValue("work_experience", [
      ...currentExperience,
      { organization: "", type: "", start_date: "", end_date: "", duration: "", designation: "", job_profile: "" },
    ])
  }

  const removeExperience = (index: number) => {
    const currentExperience = form.getValues("work_experience") || []
    form.setValue(
      "work_experience",
      currentExperience.filter((_, i) => i !== index),
    )
  }

  const updateExperience = (index: number, field: string, value: string) => {
    const currentExperience = form.getValues("work_experience") || []
    const updatedExperience = [...currentExperience]
    updatedExperience[index] = { ...updatedExperience[index], [field]: value }
    form.setValue("work_experience", updatedExperience)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
        <Checkbox
          id="is_fresher"
          checked={isFresher}
          onCheckedChange={(checked) => {
            form.setValue("is_fresher", checked)
            if (checked) {
              form.setValue("work_experience", [])
            }
          }}
        />
        <Label htmlFor="is_fresher" className="text-gray-700 dark:text-gray-300 font-medium">
          I am a fresher (No work experience)
        </Label>
      </div>

      {!isFresher && (
        <>
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Work Experience</h3>
            <Button
              type="button"
              onClick={addExperience}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {workExperience.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No work experience added yet. Click "Add Experience" to get started.
            </div>
          ) : (
            <div className="space-y-4">
              {workExperience.map((experience: any, index: number) => (
                <div
                  key={index}
                  className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    <FloatingInput
                      label="Organization"
                      value={experience.organization}
                      onChange={(e) => updateExperience(index, "organization", e.target.value)}
                    />
                    <FloatingInput
                      label="Designation"
                      value={experience.designation}
                      onChange={(e) => updateExperience(index, "designation", e.target.value)}
                    />
                    <FloatingInput
                      label="Type"
                      value={experience.type}
                      onChange={(e) => updateExperience(index, "type", e.target.value)}
                    />
                    <FloatingInput
                      label="Start Date"
                      type="date"
                      value={experience.start_date}
                      onChange={(e) => updateExperience(index, "start_date", e.target.value)}
                    />
                    <FloatingInput
                      label="End Date"
                      type="date"
                      value={experience.end_date}
                      onChange={(e) => updateExperience(index, "end_date", e.target.value)}
                    />
                    <FloatingInput
                      label="Duration"
                      value={experience.duration}
                      onChange={(e) => updateExperience(index, "duration", e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <FloatingTextarea
                      label="Job Profile"
                      value={experience.job_profile}
                      onChange={(e) => updateExperience(index, "job_profile", e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => removeExperience(index)}
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
        </>
      )}

      {/* Nominee Details Section */}
      <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Nominee Details</h3>
        <NomineeSection form={form} />
      </div>
    </div>
  )
}