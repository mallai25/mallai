"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Plus, Upload } from "lucide-react"
import { ListingSocial } from "./ListingSocial"
import axios from 'axios';

interface SimpleListingProps {
  onListingCreated?: (listing: any) => void;
}

export function SimpleListing({ onListingCreated }: SimpleListingProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [socialAccounts, setSocialAccounts] = useState<any[]>([])
  const [imageUrl, setImageUrl] = useState<string>("")
  const [gtin, setGtin] = useState(""); // Add this state

  const [loading, setLoading] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImageUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !description) {
      return
    }

    setLoading(true)
    try {
      // Upload image to Cloudinary if there's an image
      let uploadedImageUrl = '';
      if (imageUrl) {
        // Convert base64 to blob
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'image.jpg', { type: 'image/jpeg' });
        
        const formData = new FormData();
        formData.append('image', file);
        
        const uploadResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData);
        if (uploadResponse.data.success) {
          uploadedImageUrl = uploadResponse.data.data.secure_url;
        }
      }

      const newListing = {
        id: Date.now(),
        name: title,
        category: "",
        description,
        imageUrl: uploadedImageUrl, // Use the cloudinary URL
        brand: "Custom Product", 
        weight: "N/A",
        gtin: gtin,
        socialAccounts: socialAccounts,
      }
      
      onListingCreated?.(newListing)

      // Reset form
      setTitle("")
      setDescription("")
      setSocialAccounts([])
      setImageUrl("")
      setGtin("")
      
      setOpen(false)
    } catch (error) {
      console.error("Error creating listing:", error)
      alert("Failed to create listing. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-cyan-500 hover:bg-cyan-600 text-white flex rounded-full items-center gap-2">
          <div className="bg-cyan-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
            <Plus className="w-2 h-2" />
          </div>
          Simple
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[725px] w-[98%] h-[80vh] sm:h-[80vh] rounded-xl 
       overflow-y-auto pr-5 -mr-6 space-y-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
<DialogHeader>
          <DialogTitle className="text-center text-lg sm:text-xl"> Simple listing </DialogTitle>
          <DialogDescription className="text-center text-sm">
            Add a product listing with basic information
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1 space-y-4 sm:space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter product title"
                  className="text-sm sm:text-base rounded-[12px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter product description"
                  className="min-h-[100px] sm:min-h-[100px] rounded-[12px] text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Input
                  id="gtin"
                  value={gtin}
                  onChange={(e) => setGtin(e.target.value)}
                  placeholder="Enter GTIN number"
                  className="text-sm sm:text-base rounded-[12px]"
                />
              </div>
            </div>
            
            <div className="w-full sm:w-[250px] space-y-4">
              <div 
                className="border-2 border-dashed mt-6 sm:mt-10 rounded-3xl p-2 flex flex-col items-center justify-center min-h-[180px] sm:min-h-[250px] max-h-[180px] sm:max-h-[250px] cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all"
                onClick={() => document.getElementById('image')?.click()}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="w-full sm:max-h-52 rounded-3xl" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 10MB</p>
                  </div>
                )}
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
          </div>
{/* 
          <div className="space-y-2">
            <Label> Media Accounts</Label>
            <div className="bg-gray-50/50 rounded-lg">
              <ListingSocial onChange={setSocialAccounts} />
            </div>
          </div> */}

          <div className="w-full flex justify-center">
            <Button 
            type="submit" 
            className="w-2/4 mx-auto mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 rounded-3xl transition-colors"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </Button>
          </div>

          
        </form>
        
      </DialogContent>
    </Dialog>
  )
}
