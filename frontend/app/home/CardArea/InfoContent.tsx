import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { useRef, useState } from "react"

export function InfoContent({ formData, updateFormData, productImage, setProductImage, handleImageUpload }) {
  const fileInputRef = useRef(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      <div className="space-y-4">
        <div>
          <Input 
            id="name" 
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Product name" 
            className="max-w-[400px] rounded-[12px]"
          />
        </div>

        <div>
          <Textarea 
            id="description" 
            value={formData.description}
            onChange={(e) => updateFormData('description', e.target.value)}
            placeholder="Product description" 
            className="h-32 max-w-[400px] rounded-[12px]" 
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm mb-2 font-medium text-gray-700">
            Category
          </label>
          <Input 
            id="category" 
            value={formData.category}
            onChange={(e) => updateFormData('category', e.target.value)}
            placeholder="Product category" 
            className="max-w-[400px] rounded-[12px]"
          />
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm mb-2 font-medium text-gray-700">
            Weight
          </label>
          <Input 
            id="weight" 
            value={formData.weight}
            onChange={(e) => updateFormData('weight', e.target.value)}
            placeholder="Product weight (e.g., 32g)" 
            className="max-w-[400px] rounded-[12px]"
          />
        </div>

        <div>
          <Input 
            id="gtin" 
            value={formData.gtin}
            onChange={(e) => updateFormData('gtin', e.target.value)}
            placeholder="Enter GTIN number"
            maxLength={14}
            className="max-w-[400px] rounded-[12px]"
          />
        </div>
      </div>

      <div className="space-y-4 mt-8 md:mt-6">
        <div className="border-2 border-dashed border-gray-300 rounded-[20px] p-4">
          {!productImage ? (
            <div className="flex flex-col items-center justify-center h-[240px] md:h-[320px] mt-4">
              <Button
                type="button"
                variant="outline"
                className="rounded-full "
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Image
              </Button>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Drag and drop or click to upload
              </p>
            </div>
          ) : (
            <div className="relative w-full h-[240px] md:h-[320px]">
              <Image
                src={productImage}
                alt="Product Preview"
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg w-full h-full"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 z-10"
                onClick={() => setProductImage(null)}
              >
                <X className="h-4 w-4 text-white" />
              </Button>
            </div>
          )}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </div>
      </div>
    </div>
  )
}
