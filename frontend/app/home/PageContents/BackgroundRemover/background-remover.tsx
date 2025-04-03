"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, Image as LucideImage } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileUpload } from "./file-upload"
import axios from 'axios'
import Image from "next/image"

export function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileChange = (file: File | null) => {
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const removeBackground = async () => {
    if (!selectedFile) return

    setLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append('image_file', selectedFile)
    formData.append('size', 'auto')

    try {
      const response = await axios.post('https://api.remove.bg/v1.0/removebg', formData, {
        headers: {
          'X-Api-Key': 'EQAoTQVbrwdo5mcaRjfWKRab',
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob',
      })

      const blob = new Blob([response.data], { type: 'image/png' })
      const url = URL.createObjectURL(blob)
      
      // Automatically download the processed image
      const link = document.createElement('a')
      link.href = url
      link.download = 'no_background.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error removing background:', error)
      setError('Failed to remove background. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 justify-center">
      <Card className={`w-full ${!image ? 'md:col-span-2 max-w-md mx-auto' : ''}`}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LucideImage className="h-6 w-6" />
            Background Remover
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <FileUpload
              onFileChange={handleFileChange}
              label="Upload Image"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {image && (
            <Button onClick={removeBackground} disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Remove Background'
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Right Column - Preview */}
      {image && (
        <div className="flex flex-col space-y-4">
          <div className="w-full">
            <div className="flex justify-center relative h-[300px]">
              <Image
                src={image}
                alt="Preview of image for background removal"
                fill
                className="rounded-lg border object-contain"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

