"use client"

import type React from "react"

import { useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { FloatingTextarea } from "@/components/ui/floating-textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface PersonalInfoSectionProps {
  form: UseFormReturn<any>
  photoFile: File | null
  setPhotoFile: (file: File | null) => void
}

export function PersonalInfoSection({ form, photoFile, setPhotoFile }: PersonalInfoSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
    }
  }

  const removePhoto = () => {
    setPhotoFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-8">
      {/* Photo Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {photoFile ? (
            <div className="relative">
              <img
                src={URL.createObjectURL(photoFile) || "/placeholder.svg"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
              <Upload className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>
        <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline" className="rounded-full">
          Upload Photo
        </Button>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FloatingInput
          label="First Name"
          {...form.register("first_name")}
        />
        <FloatingInput 
          label="Middle Name" 
          {...form.register("middle_name")}
        />
        <FloatingInput
          label="Last Name"
          {...form.register("last_name")}
        />
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Father/Husband's Name"
          {...form.register("father_husband_name")}
        />
        <FloatingInput 
          label="Place/Location" 
          {...form.register("place_location")}
        />
      </div>

      {/* Date of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <FloatingInput 
          label="Date of Birth" 
          type="date" 
          {...form.register("date_of_birth")}
        />
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingTextarea
          label="Present Address"
          {...form.register("present_address")}
          rows={3}
        />
        <FloatingTextarea
          label="Permanent Address"
          {...form.register("permanent_address")}
          rows={3}
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Phone (Residence)"
          {...form.register("phone_residence")}
        />
        <FloatingInput
          label="Mobile Number"
          {...form.register("phone_mobile")}
        />
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marital Status</Label>
          <RadioGroup
            value={form.watch("marital_status")}
            onValueChange={(value) => form.setValue("marital_status", value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="single" id="single" />
              <Label htmlFor="single">Single</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="married" id="married" />
              <Label htmlFor="married">Married</Label>
            </div>
          </RadioGroup>
        </div>
        <FloatingInput 
          label="Nationality" 
          {...form.register("nationality")}
        />
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group</Label>
          <Select value={form.watch("blood_group")} onValueChange={(value) => form.setValue("blood_group", value)}>
            <SelectTrigger className="h-12 rounded-xl">
              <SelectValue placeholder="Select blood group" />
            </SelectTrigger>
            <SelectContent>
              {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Email and PF Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FloatingInput
          label="Personal Email"
          type="email"
          {...form.register("personal_email")}
        />
        <FloatingInput 
          label="UAN" 
          {...form.register("uan")}
        />
        <FloatingInput 
          label="Last PF No." 
          {...form.register("last_pf_no")}
        />
      </div>

      {/* Emergency Contacts */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Emergency Contacts</h3>

        {/* Emergency Contact 1 (Required) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl mb-6">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Emergency Contact 1 (Required)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label="Name"
              {...form.register("emergency_contact_1_name")}
            />
            <FloatingInput 
              label="Phone" 
              {...form.register("emergency_contact_1_phone")}
            />
            <FloatingInput
              label="Relationship"
              {...form.register("emergency_contact_1_relationship")}
            />
            <FloatingTextarea
              label="Address"
              {...form.register("emergency_contact_1_address")}
              rows={2}
            />
          </div>
        </div>

        {/* Emergency Contact 2 (Optional) */}
        <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl">
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Emergency Contact 2 (Optional)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingInput
              label="Name"
              {...form.register("emergency_contact_2_name")}
            />
            <FloatingInput 
              label="Phone" 
              {...form.register("emergency_contact_2_phone")}
            />
            <FloatingInput
              label="Relationship"
              {...form.register("emergency_contact_2_relationship")}
            />
            <FloatingTextarea
              label="Address"
              {...form.register("emergency_contact_2_address")}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}