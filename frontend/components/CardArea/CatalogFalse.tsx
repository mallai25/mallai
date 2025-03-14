'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Plus, X } from "lucide-react"
import { useState } from "react"
import axios from 'axios'

interface CatalogItem {
  id: number;
  name: string;
  description: string;
  gtin: string;
  imageSrc?: string;
}

export default function CatalogFalse({ onUpdate, initialItems }) {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(initialItems);
  const [isUploading, setIsUploading] = useState<{ [key: number]: boolean }>({});

  const addCatalogItem = () => {
    setCatalogItems([...catalogItems, { 
      id: Date.now(), 
      name: '', 
      description: '',
      gtin: '',
    }])
  }

  const removeCatalogItem = (id: number) => {
    setCatalogItems(catalogItems.filter(item => item.id !== id))
  }

  const handleImageUpload = async (id: number, file: File) => {
    try {
      setIsUploading({ ...isUploading, [id]: true });

      // Create FormData for upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to Cloudinary through your backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`,
        formData
      );

      if (response.data.success) {
        const newItems = catalogItems.map(item =>
          item.id === id
            ? { ...item, imageSrc: response.data.data.secure_url }
            : item
        );
        setCatalogItems(newItems);
        onUpdate(newItems);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading({ ...isUploading, [id]: false });
    }
  };

  const updateItemField = (id: number, field: 'name' | 'description' | 'gtin', value: string) => {
    const newItems = catalogItems.map(item =>
      item.id === id
        ? { ...item, [field]: value }
        : item
    );
    setCatalogItems(newItems);
    onUpdate(newItems);
  }

  return (
    <div className="w-full p-2">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Add Similar Products</h3>
        <p className="text-sm text-gray-500 mt-1">Create additional items in your product line</p>
      </div>

      <div className="space-y-4">
        {catalogItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start relative">
                {/* Remove button */}
                {catalogItems.length > 1 && (
                  <div
                  onClick={() => removeCatalogItem(item.id)}
                  className="absolute right-0 top-0 p-1.5 bg-red-50 hover:bg-red-100 rounded-full text-red-500 transition-colors cursor-pointer"
                  >
                  <X className="h-4 w-4" />
                  </div>
                )}

                {/* Image upload area */}
                <div
                  onClick={() => document.getElementById(`image-${item.id}`)?.click()}
                  className="relative h-44 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group"
                >
                  <input
                    type="file"
                    id={`image-${item.id}`}
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(item.id, file)
                    }}
                  />
                  {item.imageSrc ? (
                    <div className="relative w-full h-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.imageSrc}
                        alt="Product"
                        className="w-full h-full object-contain p-2"
                      />
                        <div
                        onClick={(e) => {
                          e.stopPropagation()
                          const newItems = catalogItems.map(i =>
                            i.id === item.id
                              ? { ...i, imageSrc: undefined }
                              : i
                          );
                          setCatalogItems(newItems);
                          onUpdate(newItems);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                        >
                        <X className="h-3 w-3" />
                        </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      {isUploading[item.id] ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-gray-600" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-400 mt-2">Upload Image</span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Form fields */}
                <div className="md:col-span-2 space-y-3">
                  <Input
                  placeholder="Product Name"
                  value={item.name}
                  onChange={(e) => updateItemField(item.id, 'name', e.target.value)}
                  className="max-w-[400px] rounded-[12px] focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Input
                  placeholder="GTIN Number"
                  value={item.gtin}
                  onChange={(e) => updateItemField(item.id, 'gtin', e.target.value)}
                  className="max-w-[400px] rounded-[12px] focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Textarea
                  placeholder="Product Description"
                  value={item.description}
                  onChange={(e) => updateItemField(item.id, 'description', e.target.value)}
                  className="h-20 max-w-[400px] rounded-[12px] focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

        <div className="flex justify-center mt-6">
        <div
          onClick={addCatalogItem}
          className="inline-flex items-center px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-full transition-colors duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Another Product
        </div>
        </div>
    </div>
  )
}
