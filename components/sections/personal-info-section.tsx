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
          label="First Name *"
          placeholder="Enter your first name"
          {...form.register("first_name")}
          error={form.formState.errors.first_name?.message}
        />
        <FloatingInput 
          label="Middle Name" 
          placeholder="Enter your middle name" 
          {...form.register("middle_name")}
          error={form.formState.errors.middle_name?.message}
        />
        <FloatingInput
          label="Last Name *"
          placeholder="Enter your last name"
          {...form.register("last_name")}
          error={form.formState.errors.last_name?.message}
        />
      </div>

      {/* Employee Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Father/Husband's Name *"
          placeholder="Enter father/husband's name"
          {...form.register("father_husband_name")}
          error={form.formState.errors.father_husband_name?.message}
        />
        <FloatingInput 
          label="Place/Location *" 
          placeholder="Enter location" 
          {...form.register("place_location")}
          error={form.formState.errors.place_location?.message}
        />
      </div>

      {/* Date of Birth */}
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <FloatingInput 
          label="Date of Birth *" 
          type="date" 
          {...form.register("date_of_birth")}
          error={form.formState.errors.date_of_birth?.message}
        />
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingTextarea
          label="Present Address *"
          placeholder="Enter your current address"
          {...form.register("present_address")}
          error={form.formState.errors.present_address?.message}
          rows={3}
        />
        <FloatingTextarea
          label="Permanent Address *"
          placeholder="Enter your permanent address"
          {...form.register("permanent_address")}
          error={form.formState.errors.permanent_address?.message}
          rows={3}
        />
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput
          label="Phone (Residence) *"
          placeholder="Enter residence phone number"
          {...form.register("phone_residence")}
          error={form.formState.errors.phone_residence?.message}
        />
        <FloatingInput
          label="Mobile Number *"
          placeholder="Enter 10-digit mobile number"
          {...form.register("phone_mobile", {
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Mobile number must be exactly 10 digits"
            },
            onChange: (e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 10)
              e.target.value = value
              form.setValue("phone_mobile", value)
              if (value.length === 10) {
                form.clearErrors("phone_mobile")
              }
            }
          })}
          error={form.formState.errors.phone_mobile?.message}
        />
      </div>

      {/* Personal Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Marital Status *</Label>
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
          label="Nationality *" 
          placeholder="Enter nationality" 
          {...form.register("nationality")}
          error={form.formState.errors.nationality?.message}
        />
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Blood Group *</Label>
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
          {form.formState.errors.blood_group && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {form.formState.errors.blood_group.message}
            </p>
          )}
        </div>
      </div>

      {/* Email and PF Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FloatingInput
          label="Personal Email *"
          type="email"
          placeholder="Enter complete email address"
          {...form.register("personal_email", {
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Please enter a valid email address"
            },
            onChange: (e) => {
              const value = e.target.value
              if (value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                form.clearErrors("personal_email")
              }
            }
          })}
          error={form.formState.errors.personal_email?.message}
        />
        <FloatingInput 
          label="UAN" 
          placeholder="Enter UAN number" 
          {...form.register("uan")}
          error={form.formState.errors.uan?.message}
        />
        <FloatingInput 
          label="Last PF No." 
          placeholder="Enter last PF number" 
          {...form.register("last_pf_no")}
          error={form.formState.errors.last_pf_no?.message}
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
              label="Name *"
              placeholder="Enter emergency contact name"
              {...form.register("emergency_contact_1_name")}
              error={form.formState.errors.emergency_contact_1_name?.message}
            />
            <FloatingInput 
              label="Phone *" 
              placeholder="Enter 10-digit phone number" 
              {...form.register("emergency_contact_1_phone", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be exactly 10 digits"
                },
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                  e.target.value = value
                  form.setValue("emergency_contact_1_phone", value)
                  if (value.length === 10) {
                    form.clearErrors("emergency_contact_1_phone")
                  }
                }
              })}
              error={form.formState.errors.emergency_contact_1_phone?.message}
            />
            <FloatingInput
              label="Relationship *"
              placeholder="Enter relationship"
              {...form.register("emergency_contact_1_relationship")}
              error={form.formState.errors.emergency_contact_1_relationship?.message}
            />
            <FloatingTextarea
              label="Address *"
              placeholder="Enter emergency contact address"
              {...form.register("emergency_contact_1_address")}
              error={form.formState.errors.emergency_contact_1_address?.message}
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
              placeholder="Enter emergency contact name"
              {...form.register("emergency_contact_2_name")}
              error={form.formState.errors.emergency_contact_2_name?.message}
            />
            <FloatingInput 
              label="Phone" 
              placeholder="Enter 10-digit phone number" 
              {...form.register("emergency_contact_2_phone", {
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Phone number must be exactly 10 digits"
                },
                onChange: (e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 10)
                  e.target.value = value
                  form.setValue("emergency_contact_2_phone", value)
                  if (value.length === 10) {
                    form.clearErrors("emergency_contact_2_phone")
                  }
                }
              })}
              error={form.formState.errors.emergency_contact_2_phone?.message}
            />
            <FloatingInput
              label="Relationship"
              placeholder="Enter relationship"
              {...form.register("emergency_contact_2_relationship")}
              error={form.formState.errors.emergency_contact_2_relationship?.message}
            />
            <FloatingTextarea
              label="Address"
              placeholder="Enter emergency contact address"
              {...form.register("emergency_contact_2_address")}
              error={form.formState.errors.emergency_contact_2_address?.message}
              rows={2}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
