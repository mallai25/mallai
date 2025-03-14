'use client'

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, Plus, X, PenIcon, Check } from "lucide-react"
import { useState, useEffect } from "react"
import Image from "next/image"
import axios from "axios"

interface CatalogItem {
  id: number;
  name: string;
  description: string;
  imageUrl?: string;
}

export default function CatalogTrue({ product, onUpdate }) {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>(product.similarProducts)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [tempValues, setTempValues] = useState<{[key: number]: {name: string, description: string}}>({})
  const [uploading, setUploading] = useState<{ [key: number]: boolean }>({})

  // Load existing catalog items from product
  useEffect(() => {
    if (product?.similarProducts) {
      const items = product.similarProducts.map((item, index) => ({
        id: index + 1,
        name: item.name,
        description: item.description,
        imageUrl: item.imageUrl
      }))
      setCatalogItems(items)
    }
  }, [product])

  const startEditing = (id: number) => {
    const item = catalogItems.find(i => i.id === id)
    if (item) {
      setTempValues({ 
        [id]: { 
          name: item.name, 
          description: item.description 
        } 
      })
      setEditingId(id)
    }
  }

  const saveEdit = (id: number) => {
    setCatalogItems(items =>
      items.map(item =>
        item.id === id
          ? { 
              ...item, 
              name: tempValues[id].name,
              description: tempValues[id].description
            }
          : item
      )
    )
    setEditingId(null)
    setTempValues({})
  }

  const cancelEdit = () => {
    setEditingId(null)
    setTempValues({})
  }

  const handleImageUpload = async (id: number, file: File) => {
    try {
      setUploading(prev => ({ ...prev, [id]: true }))

      // Create form data for Cloudinary upload
      const formData = new FormData()
      formData.append('image', file)

      // Upload to Cloudinary through backend
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data.success) {
        const imageUrl = response.data.data.secure_url
        setCatalogItems(items =>
          items.map(item =>
            item.id === id
              ? { ...item, imageUrl: imageUrl }
              : item
          )
        )
      }
    } catch (error) {
      console.error('Error uploading image:', error)
    } finally {
      setUploading(prev => ({ ...prev, [id]: false }))
    }
  }

  return (
    <div className="w-full p-2">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Edit Similar Products</h3>
      </div>

      <div className="space-y-4">
        {catalogItems.length > 0 ? (
          catalogItems.map((item) => (
            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-all duration-300">
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start relative">
                  {/* Image upload area */}
                  <div
                    onClick={() => document.getElementById(`image-${item.id}`)?.click()}
                    className="relative h-32 border-2 border-dashed rounded-xl flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors group"
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
                    {item.imageUrl ? (
                      <div className="relative w-full h-full">
                        <Image
                          src={item.imageUrl}
                          alt="Product"
                          fill
                          className="object-contain p-2"
                        />
                        <div
                          onClick={(e) => {
                          e.stopPropagation()
                          setCatalogItems(items =>
                            items.map(i =>
                            i.id === item.id
                              ? { ...i, imageUrl: undefined }
                              : i
                            )
                          )
                          }}
                          className="absolute top-1 right-1 p-1 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 cursor-pointer"
                        >
                          <X className="h-3 w-3" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <Upload className="h-6 w-6 text-gray-400" />
                        {uploading[item.id] && (
                          <p className="text-xs text-gray-500 mt-2">Uploading...</p>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2 space-y-4">
                    {editingId === item.id ? (
                      <>
                        <Input
                          value={tempValues[item.id].name}
                          onChange={(e) => setTempValues(prev => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], name: e.target.value }
                          }))}
                          className="focus:ring-emerald-500 focus:border-emerald-500 max-w-[400px] rounded-[12px]"
                          placeholder="Product Name"
                        />
                        <Textarea
                          value={tempValues[item.id].description}
                          onChange={(e) => setTempValues(prev => ({
                            ...prev,
                            [item.id]: { ...prev[item.id], description: e.target.value }
                          }))}
                          className="h-20 focus:ring-emerald-500 focus:border-emerald-500 max-w-[400px] rounded-[12px]"
                          placeholder="Product Description"
                        />
                        <div className="flex gap-2 justify-end">
                            <div
                            onClick={() => saveEdit(item.id)}
                            className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-full transition-colors cursor-pointer"
                            >
                            <Check className="h-4 w-4" />
                            </div>
                            <div
                            onClick={cancelEdit}
                            className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-50 rounded-full transition-colors cursor-pointer"
                            >
                            <X className="h-4 w-4" />
                            </div>

                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <Input
                            value={item.name}
                            readOnly
                            className="border-gray-200 bg-transparent max-w-[400px] rounded-[12px]"
                          />
                          <div className="flex gap-2">
                            <div
                              onClick={() => startEditing(item.id)}
                              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                            >
                              <PenIcon className="h-4 w-4" />
                            </div>
                            <div
                              onClick={() => setCatalogItems(items => items.filter(i => i.id !== item.id))}
                              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors cursor-pointer"
                            >
                              <X className="h-4 w-4" />
                            </div>

                          </div>
                        </div>
                        <Textarea
                          value={item.description}
                          readOnly
                          className="border-gray-200 bg-transparent h-20 max-w-[400px] rounded-[12px]"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed">
            <p className="text-gray-500">No similar products added yet</p>
          </div>
        )}
      </div>

        <div className="flex justify-center mt-6">
        <div
          onClick={() => {
          const newId = (catalogItems[catalogItems.length - 1]?.id ?? 0) + 1
          setCatalogItems([...catalogItems, {
            id: newId,
            name: '',
            description: ''
          }])
          startEditing(newId)
          }}
          className="inline-flex items-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full transition-colors duration-200 cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </div>
        </div>

    </div>
  )
}
