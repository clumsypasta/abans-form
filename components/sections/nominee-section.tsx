"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"]

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput 
          label="Nominee Name *" 
          placeholder="Enter nominee name" 
          {...form.register("nominee_name", { required: "Nominee name is required" })} 
        />
        <FloatingInput 
          label="Date of Birth *" 
          type="date" 
          {...form.register("nominee_dob", { required: "Date of birth is required" })} 
        />
        <FloatingInput 
          label="Mobile Number *" 
          placeholder="Enter mobile number" 
          {...form.register("nominee_mobile", { required: "Mobile number is required" })} 
        />
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Relationship *
          </Label>
          <Select 
            value={form.watch("nominee_relationship")} 
            onValueChange={(value) => form.setValue("nominee_relationship", value)}
          >
            <SelectTrigger className="h-12 w-full rounded-xl">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              {relationshipOptions.map((rel) => (
                <SelectItem key={rel} value={rel}>
                  {rel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.nominee_relationship && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {form.formState.errors.nominee_relationship.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}