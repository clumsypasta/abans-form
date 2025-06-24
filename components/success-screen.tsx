"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CheckCircle, Download, Home, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { generateFormPDF, uploadPDFToSupabase, type FormDataForPDF } from "@/lib/pdf-generator"

interface SuccessScreenProps {
  formData?: FormDataForPDF
  formId?: string
}

export function SuccessScreen({ formData, formId }: SuccessScreenProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [pdfGenerated, setPdfGenerated] = useState(false)

  const handleDownloadPDF = async () => {
    if (!formData) {
      alert('Form data not available for PDF generation')
      return
    }

    setIsGeneratingPDF(true)
    try {
      const { blob, filename } = await generateFormPDF(formData, formId)
      
      // Download the PDF
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Upload to Supabase (optional - for backup)
      const pdfUrl = await uploadPDFToSupabase(blob, filename)
      if (pdfUrl) {
        console.log('PDF uploaded to Supabase:', pdfUrl)
      }

      setPdfGenerated(true)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Error generating PDF. Please try again.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }
  return (
    <div className="min-h-screen bg-[#0A2A33] flex items-center justify-center py-8 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="bg-[#132E36] border-[#2a4a54] shadow-2xl">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mb-6"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <img src="/images/abans-logo.png" alt="ABANS Group Logo" className="h-10 w-auto" />
              </div>
              <CheckCircle className="w-24 h-24 text-[#00BCD4] mx-auto" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 className="text-3xl font-bold text-white mb-4">Joining Formality Form Submitted Successfully!</h1>
              <p className="text-[#C0C0C0] text-lg mb-6">
                Welcome to ABANS Group! Your joining formality form has been successfully submitted and is now being processed by our HR team.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#0A2A33] p-6 rounded-lg border border-[#2a4a54] mb-8"
            >
              <h3 className="text-xl font-semibold text-[#D3D3D3] mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00BCD4] rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    1
                  </div>
                  <p className="text-[#C0C0C0]">Your information will be processed and added to our HR records within 2-3 business days</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00BCD4] rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    2
                  </div>
                  <p className="text-[#C0C0C0]">You will receive your employee ID card and access credentials via email</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#00BCD4] rounded-full flex items-center justify-center text-white text-sm font-bold mt-0.5">
                    3
                  </div>
                  <p className="text-[#C0C0C0]">Your manager will contact you with your first day schedule and orientation details</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="space-y-4"
            >
              <p className="text-[#8a9ba8] text-sm">
                Form ID: <span className="text-[#00BCD4] font-mono">JFF-{Date.now().toString().slice(-8)}</span>
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleDownloadPDF} 
                  disabled={isGeneratingPDF}
                  className="bg-[#00BCD4] hover:bg-[#00ACC1] text-white"
                >
                  {isGeneratingPDF ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Generating PDF...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 mr-2" />
                      Download Complete Form PDF
                    </>
                  )}
                </Button>
                <Button onClick={() => window.print()} className="bg-[#4CAF50] hover:bg-[#45a049] text-white">
                  <Download className="w-4 h-4 mr-2" />
                  Download Confirmation
                </Button>
                <Button
                  onClick={() => (window.location.href = "/")}
                  variant="outline"
                  className="bg-transparent border-[#2a4a54] text-[#C0C0C0] hover:bg-[#1a3a44] hover:text-white"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-8 pt-6 border-t border-[#2a4a54]"
            >
              <p className="text-[#8a9ba8] text-sm">
                For any queries, please contact us at{" "}
                <a href="mailto:hr@abans.lk" className="text-[#00BCD4] hover:underline">
                  hr@abans.lk
                </a>{" "}
                or call{" "}
                <a href="tel:+94112345678" className="text-[#00BCD4] hover:underline">
                  +94 11 234 5678
                </a>
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
