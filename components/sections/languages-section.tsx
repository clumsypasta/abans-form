"use client"
import type { UseFormReturn } from "react-hook-form"
import { Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FloatingInput } from "@/components/ui/floating-input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface LanguagesSectionProps {
  form: UseFormReturn<any>
}

export function LanguagesSection({ form }: LanguagesSectionProps) {
  const languages = form.watch("languages_known") || []

  const addLanguage = () => {
    const currentLanguages = form.getValues("languages_known") || []
    form.setValue("languages_known", [...currentLanguages, { language: "", read: false, write: false, speak: false }])
  }

  const removeLanguage = (index: number) => {
    const currentLanguages = form.getValues("languages_known") || []
    form.setValue(
      "languages_known",
      currentLanguages.filter((_, i) => i !== index),
    )
  }

  const updateLanguage = (index: number, field: string, value: any) => {
    const currentLanguages = form.getValues("languages_known") || []
    const updatedLanguages = [...currentLanguages]
    updatedLanguages[index] = { ...updatedLanguages[index], [field]: value }
    form.setValue("languages_known", updatedLanguages)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Languages Known</h3>
        <Button type="button" onClick={addLanguage} className="bg-blue-500 hover:bg-blue-600 text-white rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {languages.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No languages added yet. Click "Add Language" to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {languages.map((language: any, index: number) => (
            <div
              key={index}
              className="bg-gray-50 dark:bg-gray-700 p-6 rounded-xl border border-gray-200 dark:border-gray-600"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                <div className="md:col-span-2">
                  <FloatingInput
                    label="Language"
                    placeholder="Enter language name"
                    value={language.language}
                    onChange={(e) => updateLanguage(index, "language", e.target.value)}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`read-${index}`}
                    checked={language.read}
                    onCheckedChange={(checked) => updateLanguage(index, "read", checked)}
                  />
                  <Label htmlFor={`read-${index}`} className="text-gray-700 dark:text-gray-300">
                    Read
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`write-${index}`}
                    checked={language.write}
                    onCheckedChange={(checked) => updateLanguage(index, "write", checked)}
                  />
                  <Label htmlFor={`write-${index}`} className="text-gray-700 dark:text-gray-300">
                    Write
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`speak-${index}`}
                    checked={language.speak}
                    onCheckedChange={(checked) => updateLanguage(index, "speak", checked)}
                  />
                  <Label htmlFor={`speak-${index}`} className="text-gray-700 dark:text-gray-300">
                    Speak
                  </Label>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={() => removeLanguage(index)}
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
