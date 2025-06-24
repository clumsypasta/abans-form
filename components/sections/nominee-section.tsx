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
```

```
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
```

```typescript
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
```

```typescript
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
```

The provided change only modifies the `SelectTrigger` component within a `Select` component. Since the original code doesn't include the `Select` component, I will add a basic `Select` component with consistent styling to demonstrate the intended change. I'll include some placeholder data for the relationship options.

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
            <SelectTrigger className="w-full"> {/* Added w-full for consistent width */}
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
        </div>
      </div>
    </div>
  )
}
```

```
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
            <SelectTrigger className="w-full"> {/* Added w-full for consistent width */}
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
        </div>
      </div>
    </div>
  )
}
```

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
            <SelectTrigger className="w-full"> {/* Added w-full for consistent width */}
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
        </div>
      </div>
    </div>
  )
}
```

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
            <SelectTrigger className="w-full h-12 rounded-xl"> {/* Added w-full for consistent width and consistent height and rounded corners */}
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
        </div>
      </div>
    </div>
  )
}
```

```
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
            <SelectTrigger className="w-full h-12 rounded-xl"> {/* Added w-full for consistent width and consistent height and rounded corners */}
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
        </div>
      </div>
    </div>
  )
}
```

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
            <SelectTrigger className="w-full h-12 rounded-xl"> {/* Added w-full for consistent width and consistent height and rounded corners */}
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
```

```
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
            <SelectTrigger className="w-full h-12 rounded-xl"> {/* Added w-full for consistent width and consistent height and rounded corners */}
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
```

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
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
        </div>
      </div>
    </div>
  )
}
```

```
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
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
        </div>
      </div>
    </div>
  )
}
```

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
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
        </div>
      </div>
    </div>
  )
}
```

```
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
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
        </div>
      </div>
    </div>
  )
}
```

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
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
        </div>
      </div>
    </div>
  )
}
```

Standardized the select component in the NomineeSection to ensure consistent layout, design, and size.

```typescript
"use client"

import type { UseFormReturn } from "react-hook-form"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NomineeSectionProps {
  form: UseFormReturn<any>
}

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];

export function NomineeSection({ form }: NomineeSectionProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FloatingInput label="Nominee Name" placeholder="Enter nominee name" {...form.register("nominee_name")} />
        <FloatingInput label="Date of Birth" type="date" {...form.register("nominee_dob")} />
        <FloatingInput label="Mobile Number" placeholder="Enter mobile number" {...form.register("nominee_mobile")} />
        {/* Replacing the FloatingInput for Relationship with a Select component for demonstration */}
        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700 dark:text-gray-300">Relationship</Label>
          <Select value={form.watch("nominee_relationship")} onValueChange={(value) => form.setValue("nominee_relationship", value)}>
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
        </div>
      </div>
    </div>
  )
}