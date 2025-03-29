import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Upload, X, Sparkles, Pencil, ArrowLeft } from "lucide-react"
import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { AIGenerationInline } from "@/app/home/PageContents/AIGenerationInline"

export function InfoContent({ product, productImage, setProductImage, handleImageUpload }) {
  const fileInputRef = useRef(null)
  const [showAIDialog, setShowAIDialog] = useState(false)
  const [aiPrompt, setAIPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAIGenerator, setShowAIGenerator] = useState(false)

  const handleGenerateImage = () => {
    setIsGenerating(true)
    // Simulate AI generation delay
    setTimeout(() => {
      setIsGenerating(false)
      setShowAIDialog(false)
      // This would be where the actual AI image generation would happen
      // For now, we're just showing a message
    }, 2000)
  }

  const handleImageFromAI = (aiImageUrl: string) => {
    setProductImage(aiImageUrl);
    setShowAIGenerator(false);
  }

  if (showAIGenerator) {
    return (
      <div className="space-y-4">
        <AIGenerationInline onSelectImage={handleImageFromAI} />
        <div className="mt-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 rounded-2xl" 
            onClick={() => setShowAIGenerator(false)}
          >
            <ArrowLeft className="w-4 h-4" />
             Form
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
      <div className="space-y-4">
        <div>
          <Input 
            id="item" 
            defaultValue={product.name} 
            placeholder="Product name" 
            className="max-w-[400px] rounded-[12px]"
          />
        </div>

        <div>
          <Textarea 
            id="description" 
            defaultValue={product.description} 
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
            defaultValue={product.category} 
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
            defaultValue={product.weight} 
            placeholder="Product weight (e.g., 32g)" 
            className="max-w-[400px] rounded-[12px]"
          />
        </div>

        <div>
          <Input 
            id="gtin" 
            defaultValue={product.gtin} 
            placeholder="Enter GTIN number"
            maxLength={14}
            className="max-w-[400px] rounded-[12px]"
          />
        </div>
      </div>

      <div className="space-y-4 mt-8 md:mt-6">
        <div className="border-2 border-dashed border-gray-300 rounded-[20px] p-4 hover:border-emerald-500 hover:bg-emerald-50/50 transition-all">
          {!productImage ? (
            <div className="flex flex-col items-center justify-center h-[280px] sm:h-[320px] relative">
              <Button
                type="button"
                className="absolute top-1 left-1 rounded-full bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white border-none"
                onClick={() => setShowAIGenerator(true)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Use AI
              </Button>
              <div className="flex flex-col items-center justify-center">
                <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
                <p className="mt-2 text-sm text-gray-500 text-center">
                  PNG, JPG up to 10MB
                </p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-[280px] md:h-[320px]">
              <div className="absolute top-1 left-1 z-10">
                <Button
                  type="button"
                  className="rounded-full bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white border-none"
                  onClick={() => setShowAIGenerator(true)}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Use AI
                </Button>
              </div>
              <div className="absolute top-2 right-2 flex space-x-2 z-10">
              
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-black/40 hover:bg-black/60 z-10"
                  onClick={() => setProductImage(null)}
                >
                  <X className="h-4 w-4 text-white" />
                </Button>
              </div>
              <Image
                src={productImage}
                alt="Product Preview"
                fill
                style={{ objectFit: 'contain' }}
                className="rounded-lg"
              />
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