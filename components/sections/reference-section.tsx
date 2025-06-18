"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"

interface ReferenceSectionProps {
  form: UseFormReturn<any>
}

export function ReferenceSection({ form }: ReferenceSectionProps) {
  const references = form.watch("references") || []

  const updateReference = (index: number, field: string, value: string) => {
    const currentReferences = form.getValues("references") || []
    const updatedReferences = [...currentReferences]
    updatedReferences[index] = { ...updatedReferences[index], [field]: value }
    form.setValue("references", updatedReferences)
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Please provide details for at least 2 professional references
        </p>
      </div>

      {references.map((reference: any, index: number) => (
        <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Reference {index + 1} {index < 2 && <span className="text-red-500">*</span>}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label={`Name ${index < 2 ? "*" : ""}`}
              placeholder="Enter reference name"
              value={reference.name}
              onChange={(e) => updateReference(index, "name", e.target.value)}
              error={form.formState.errors.references?.[index]?.name?.message}
            />
            <FloatingInput
              label={`Designation ${index < 2 ? "*" : ""}`}
              placeholder="Enter designation"
              value={reference.designation}
              onChange={(e) => updateReference(index, "designation", e.target.value)}
              error={form.formState.errors.references?.[index]?.designation?.message}
            />
            <FloatingInput
              label={`Company ${index < 2 ? "*" : ""}`}
              placeholder="Enter company name"
              value={reference.company}
              onChange={(e) => updateReference(index, "company", e.target.value)}
              error={form.formState.errors.references?.[index]?.company?.message}
            />
            <FloatingInput
              label={`Contact Number ${index < 2 ? "*" : ""}`}
              placeholder="Enter contact number"
              value={reference.contact_no}
              onChange={(e) => updateReference(index, "contact_no", e.target.value)}
              error={form.formState.errors.references?.[index]?.contact_no?.message}
            />
            <FloatingInput
              label={`Email ${index < 2 ? "*" : ""}`}
              type="email"
              placeholder="Enter email address"
              value={reference.email}
              onChange={(e) => updateReference(index, "email", e.target.value)}
              error={form.formState.errors.references?.[index]?.email?.message}
            />
            <FloatingTextarea
              label={`Address ${index < 2 ? "*" : ""}`}
              placeholder="Enter company address"
              value={reference.address}
              onChange={(e) => updateReference(index, "address", e.target.value)}
              error={form.formState.errors.references?.[index]?.address?.message}
              rows={3}
            />
          </div>
        </div>
      ))}

      {form.formState.errors.references && (
        <p className="text-red-600 dark:text-red-400 text-sm text-center">{form.formState.errors.references.message}</p>
      )}
    </div>
  )
}
