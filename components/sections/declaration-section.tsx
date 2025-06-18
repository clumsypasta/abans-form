"use client"

import { useRef } from "react"
import type { UseFormReturn } from "react-hook-form"
import SignatureCanvas from "react-signature-canvas"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DeclarationSectionProps {
  form: UseFormReturn<any>
  signatureDataUrl: string
  setSignatureDataUrl: (dataUrl: string) => void
}

export function DeclarationSection({ form, signatureDataUrl, setSignatureDataUrl }: DeclarationSectionProps) {
  const sigCanvas = useRef<SignatureCanvas>(null)

  const clearSignature = () => {
    sigCanvas.current?.clear()
    setSignatureDataUrl("")
  }

  const saveSignature = () => {
    if (sigCanvas.current) {
      const dataUrl = sigCanvas.current.toDataURL()
      setSignatureDataUrl(dataUrl)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-[#0A2A33] p-6 rounded-lg border border-[#2a4a54]">
        <h3 className="text-lg font-semibold text-[#D3D3D3] mb-4">Declaration</h3>
        <div className="text-[#C0C0C0] mb-6 leading-relaxed">
          <p className="mb-4">
            I hereby declare that the information furnished above is true to the best of my knowledge and belief. I
            understand that any false information may lead to the rejection of my application or cancellation of
            admission if detected at a later stage.
          </p>
          <p className="mb-4">
            I also undertake to abide by the rules and regulations of ABANS Group and will maintain the confidentiality
            of all company information during and after my internship period.
          </p>
          <p>I authorize ABANS Group to verify the information provided and contact the references mentioned above.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label className="text-[#D3D3D3] mb-3 block">Digital Signature *</Label>
            <div className="border-2 border-dashed border-[#2a4a54] rounded-lg p-4 bg-white">
              <SignatureCanvas
                ref={sigCanvas}
                canvasProps={{
                  width: 300,
                  height: 150,
                  className: "signature-canvas w-full",
                }}
                onEnd={saveSignature}
              />
            </div>
            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                onClick={clearSignature}
                variant="outline"
                size="sm"
                className="bg-transparent border-[#2a4a54] text-[#C0C0C0] hover:bg-[#1a3a44]"
              >
                Clear
              </Button>
              {signatureDataUrl && (
                <span className="text-sm text-[#00BCD4] flex items-center">✓ Signature captured</span>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="declaration_date" className="text-[#D3D3D3]">
              Date
            </Label>
            <Input
              id="declaration_date"
              type="date"
              {...form.register("declaration_date")}
              className="bg-[#0A2A33] border-[#2a4a54] text-[#D3D3D3] placeholder:text-[#8a9ba8] focus:border-[#00BCD4]"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
