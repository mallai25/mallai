'use client'

import { useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Upload } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Image from 'next/image'

interface NutritionData {
  servingsPerContainer: string;
  servingSize: string;
  calories: string;
  totalFat: string;
  sodium: string;
  totalCarbohydrate: string;
  dietaryFiber: string;
  totalSugars: string;
  addedSugars: string;
  sugarAlcohols: string;
  protein: string;
  iron: string;
}

export function NutritionFacts() {
  const [nutritionData, setNutritionData] = useState<NutritionData>({
    servingsPerContainer: 'About 3 servings per container',
    servingSize: 'Serving Size 4 Pieces (32g)',
    calories: '70',
    totalFat: '0g (0%)',
    sodium: '95mg (4%)',
    totalCarbohydrate: '24g (9%)',
    dietaryFiber: '8g (29%)',
    totalSugars: '4g',
    addedSugars: '4g (8%)',
    sugarAlcohols: '0g (0%)',
    protein: '1g',
    iron: '1mg (6%)'
  })
  const [isLoading, setIsLoading] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>('')

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsLoading(true)
    
    // Show image preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setUploadedImage(reader.result as string)
    }
    reader.readAsDataURL(file)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/extract-text', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Failed to process image')
      }

      const data = await response.json()
      
      // Update both the structured nutrition data and raw extracted text
      setNutritionData(prevData => ({
        ...prevData,
        ...data.nutritionData
      }))
      setExtractedText(data.rawText || '')
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left column - Existing nutrition facts display */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center gap-4">
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-4 border-2 border-dashed rounded-lg">
                      {isLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
                      ) : (
                        <Upload className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {isLoading ? 'Processing image...' : 'Upload nutrition label image'}
                    </span>
                  </div>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </CardContent>
          </Card>

          {/* Existing nutrition facts card */}
          <Card className="font-sans">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-sm">{nutritionData.servingsPerContainer}</p>
                <p className="text-sm">{nutritionData.servingSize}</p>
                
                <h3 className="font-bold pt-4">Amount Per Serving</h3>
                
                <div className="flex justify-between items-center border-b py-2">
                  <span className="font-bold text-xl">Calories</span>
                  <span className="font-bold text-xl">{nutritionData.calories}</span>
                </div>
                
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between">
                    <span>Total Fat</span>
                    <span>{nutritionData.totalFat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sodium</span>
                    <span>{nutritionData.sodium}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Carbohydrate</span>
                    <span>{nutritionData.totalCarbohydrate}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Dietary Fiber</span>
                    <span>{nutritionData.dietaryFiber}</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Total Sugars</span>
                    <span>{nutritionData.totalSugars}</span>
                  </div>
                  <div className="flex justify-between pl-8">
                    <span>Includes {nutritionData.addedSugars} Added Sugars</span>
                  </div>
                  <div className="flex justify-between pl-4">
                    <span>Sugar Alcohols</span>
                    <span>{nutritionData.sugarAlcohols}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Protein</span>
                    <span>{nutritionData.protein}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Iron</span>
                    <span>{nutritionData.iron}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column - Image preview and extracted text */}
        <div className="space-y-4">
          {uploadedImage && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Uploaded Image</h3>
                  <div className="relative aspect-square w-full">
                    <Image
                      src={uploadedImage}
                      alt="Uploaded nutrition label"
                      className="rounded-lg object-contain w-full h-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {extractedText && (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">Extracted Text</h3>
                  <div className="bg-muted p-4 rounded-lg">
                    <pre className="whitespace-pre-wrap text-sm">
                      {extractedText}
                    </pre>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}