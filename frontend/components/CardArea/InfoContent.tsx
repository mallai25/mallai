import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Upload, X } from "lucide-react"
import { useRef, useState } from "react"

export function InfoContent({ product, productImage, setProductImage, handleImageUpload }) {
  const fileInputRef = useRef(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      <div className="space-y-4">
        <div>
          <label htmlFor="item" className="block text-sm mb-2 font-medium text-gray-700">
            Name
          </label>
          <Input id="item" defaultValue={product.name} placeholder="Product name" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm mb-2 font-medium text-gray-700">
            Description
          </label>
          <Textarea 
            id="description" 
            defaultValue={product.description} 
            placeholder="Product description" 
            className="h-32" 
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm mb-2 font-medium text-gray-700">
            Category
          </label>
          <Input id="category" defaultValue={product.category} placeholder="Product category" />
        </div>

        <div>
          <label htmlFor="weight" className="block text-sm mb-2 font-medium text-gray-700">
            Weight
          </label>
          <Input id="weight" defaultValue={product.weight} placeholder="Product weight (e.g., 32g)" />
        </div>

        <div>
          <label htmlFor="gtin" className="block text-sm mb-2 font-medium text-gray-700">
            GS1 GTIN
          </label>
          <Input 
            id="gtin" 
            defaultValue={product.gtin} 
            placeholder="Enter GTIN number"
            maxLength={14}
          />
        </div>
      </div>

      <div className="space-y-4 mt-4 md:mt-0">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
          {!productImage ? (
            <div className="flex flex-col items-center justify-center h-[240px] md:h-[320px]">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Product Image
              </Button>
              <p className="mt-2 text-sm text-gray-500 text-center">
                Drag and drop or click to upload product images
              </p>
            </div>
          ) : (
            <div className="relative w-full h-[240px] md:h-[320px]">
              <Image
                src={productImage}
                alt="Product Preview"
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
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
