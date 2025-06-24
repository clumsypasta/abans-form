"use client"

import type { UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"

interface FamilySectionProps {
  form: UseFormReturn<any>
}

export function FamilySection({ form }: FamilySectionProps) {
  const dependants = form.watch("family_dependants") || []

  const addDependant = () => {
    const currentDependants = form.getValues("family_dependants") || []
    form.setValue("family_dependants", [
      ...currentDependants,
      { name: "", relationship: "", date_of_birth: "", mobile: "", occupation: "" },
    ])
  }

  const removeDependant = (index: number) => {
    const currentDependants = form.getValues("family_dependants") || []
    form.setValue(
      "family_dependants",
      currentDependants.filter((_, i) => i !== index),
    )
  }

  const updateDependant = (index: number, field: string, value: string) => {
    const currentDependants = form.getValues("family_dependants") || []
    const updatedDependants = [...currentDependants]
    updatedDependants[index] = { ...updatedDependants[index], [field]: value }
    form.setValue("family_dependants", updatedDependants)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Family Background / Dependants</h3>
        <Button type="button" onClick={addDependant} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Dependant
        </Button>
      </div>

      {dependants.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No dependants added yet. Click "Add Dependant" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {dependants.map((dependant: any, index: number) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <FloatingInput
                  label="Name"
                  value={dependant.name}
				  className="h-12"
                  onChange={(e) => updateDependant(index, "name", e.target.value)}
                />
                <FloatingInput
                  label="Relationship"
                  value={dependant.relationship}
				  className="h-12"
                  onChange={(e) => updateDependant(index, "relationship", e.target.value)}
                />
                <FloatingInput
                  label="Date of Birth"
                  type="date"
                  value={dependant.date_of_birth}
				  className="h-12"
                  onChange={(e) => updateDependant(index, "date_of_birth", e.target.value)}
                />
                <FloatingInput
                  label="Mobile"
                  value={dependant.mobile}
				  className="h-12"
                  onChange={(e) => updateDependant(index, "mobile", e.target.value)}
                />
                <FloatingInput
                  label="Occupation"
                  value={dependant.occupation}
				  className="h-12"
                  onChange={(e) => updateDependant(index, "occupation", e.target.value)}
                />
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={() => removeDependant(index)}
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