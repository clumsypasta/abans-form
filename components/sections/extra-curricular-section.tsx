"use client"

import type { UseFormReturn } from "react-hook-form"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ExtraCurricularSectionProps {
  form: UseFormReturn<any>
}

export function ExtraCurricularSection({ form }: ExtraCurricularSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="extra_curricular" className="text-[#D3D3D3]">
          Extra Curricular Activities
        </Label>
        <Textarea
          id="extra_curricular"
          {...form.register("extra_curricular")}
          placeholder="Describe your extra curricular activities, hobbies, interests, achievements..."
          className="bg-[#0A2A33] border-[#2a4a54] text-[#D3D3D3] placeholder:text-[#8a9ba8] focus:border-[#00BCD4]"
          rows={6}
        />
      </div>
    </div>
  )
}
