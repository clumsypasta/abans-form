"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        <FloatingInput
          label="Relationship"
          placeholder="Enter relationship"
          {...form.register("nominee_relationship")}
        />
      </div>
    </div>
  )
}
