"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { doc, setDoc } from "firebase/firestore"
import { FIREBASE_DB } from "../../FirebaseConfig"
import { toast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  CheckCircle,
  Package,
  Layers,
  Users,
  User,
  Tag,
  DollarSign,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  Plus,
  Trash2,
  X,
  Upload,
  Globe,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { InstagramIcon as TiktokIcon } from "lucide-react"
import axios from "axios"

interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: string
  priceUnit: string
  imageSrc: string
  description: string
  similarProducts: SimilarProduct[]
  weight: string
  gtin: string
  influencer?: Influencer
  uploaderId?: string
}

interface Influencer {
  id: string
  name: string
  image: string
  bio: string
  brand: string
  socialAccounts: SocialAccount[]
}

interface SocialAccount {
  id?: string
  name: string
  icon: string
  color: string
  url: string
  username: string
}

interface SimilarProduct {
  id: string
  name: string
  description: string
  imageUrl: string
  weight?: string
  gtin?: string
  brand?: string
  mainProductId?: string
}

interface EditProductDialogProps {
  product: Product
  open: boolean
  onOpenChange: (open: boolean) => void
  onProductUpdated: () => Promise<void>
}

export function EditProductDialog({ product, open, onOpenChange, onProductUpdated }: EditProductDialogProps) {
  // Initialize state with the product data
  const [editedProduct, setEditedProduct] = useState<Product>(product)

  // Initialize influencer state
  const [editedInfluencer, setEditedInfluencer] = useState<Influencer>(
    product.influencer
      ? {
          ...product.influencer,
          socialAccounts: Array.isArray(product.influencer.socialAccounts)
            ? [...product.influencer.socialAccounts]
            : [],
        }
      : {
          id: uuidv4(),
          name: "",
          image: "",
          bio: "",
          brand: "",
          socialAccounts: [],
        },
  )

  // State for new similar product
  const [newSimilarProduct, setNewSimilarProduct] = useState<SimilarProduct>({
    id: uuidv4(),
    name: "",
    description: "",
    imageUrl: "",
    weight: product.weight || "",
    gtin: "",
    brand: product.brand || "",
    mainProductId: product.id,
  })

  // State for new social account
  const [newSocialAccount, setNewSocialAccount] = useState<SocialAccount>({
    id: uuidv4(),
    name: "Instagram Profile",
    icon: "Instagram",
    color: "text-[#E4405F]",
    url: "https://instagram.com",
    username: "",
  })

  // Other state variables
  const [weightEditMode, setWeightEditMode] = useState(false)
  const [savingData, setSavingData] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Refs for file inputs
  const productImageInputRef = useRef<HTMLInputElement>(null)
  const similarProductImageInputRef = useRef<HTMLInputElement>(null)
  const influencerImageInputRef = useRef<HTMLInputElement>(null)

  // Update state when product prop changes
  useEffect(() => {
    if (product) {
      setEditedProduct({
        ...product,
        similarProducts: Array.isArray(product.similarProducts) ? [...product.similarProducts] : [],
      })

      setEditedInfluencer(
        product.influencer
          ? {
              ...product.influencer,
              socialAccounts: Array.isArray(product.influencer.socialAccounts)
                ? [...product.influencer.socialAccounts]
                : [],
            }
          : {
              id: uuidv4(),
              name: "",
              image: "",
              bio: "",
              brand: "",
              socialAccounts: [],
            },
      )

      setNewSimilarProduct({
        id: uuidv4(),
        name: "",
        description: "",
        imageUrl: "",
        weight: product.weight || "",
        gtin: "",
        brand: product.brand || "",
        mainProductId: product.id,
      })
    }
  }, [product])

  // Handle product image upload
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData)

      if (response.data.success) {
        const downloadUrl = response.data.data.secure_url

        setEditedProduct({
          ...editedProduct,
          imageSrc: downloadUrl,
        })

        toast({
          title: "Image uploaded successfully",
          description: "Your product image has been uploaded.",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error uploading image",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle similar product image upload
  const handleSimilarProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData)

      if (response.data.success) {
        const downloadUrl = response.data.data.secure_url

        setNewSimilarProduct({
          ...newSimilarProduct,
          imageUrl: downloadUrl,
        })

        toast({
          title: "Image uploaded successfully",
          description: "Your similar product image has been uploaded.",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error uploading image",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle influencer image upload
  const handleInfluencerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData)

      if (response.data.success) {
        const downloadUrl = response.data.data.secure_url

        setEditedInfluencer({
          ...editedInfluencer,
          image: downloadUrl,
        })

        toast({
          title: "Image uploaded successfully",
          description: "Your influencer image has been uploaded.",
        })
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error uploading image",
        description: "There was an error uploading your image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Add similar product
  const addSimilarProduct = () => {
    if (!newSimilarProduct.name || !newSimilarProduct.description || !newSimilarProduct.imageUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the similar product.",
        variant: "destructive",
      })
      return
    }

    setEditedProduct({
      ...editedProduct,
      similarProducts: [...editedProduct.similarProducts, { ...newSimilarProduct, mainProductId: editedProduct.id }],
    })

    // Reset the similar product form
    setNewSimilarProduct({
      id: uuidv4(),
      name: "",
      description: "",
      imageUrl: "",
      weight: editedProduct.weight || "",
      brand: editedProduct.brand || "",
      gtin: "",
      mainProductId: editedProduct.id,
    })

    // Reset weight edit mode
    setWeightEditMode(false)

    toast({
      title: "Similar product added",
      description: "The similar product has been added to your product.",
    })
  }

  // Remove similar product
  const removeSimilarProduct = (id: string) => {
    setEditedProduct({
      ...editedProduct,
      similarProducts: editedProduct.similarProducts.filter((product) => product.id !== id),
    })

    toast({
      title: "Similar product removed",
      description: "The similar product has been removed from your product.",
    })
  }

  // Handle social platform change
  const handleSocialPlatformChange = (platform: string) => {
    let color = "text-[#E4405F]"
    let url = "https://instagram.com"

    switch (platform) {
      case "Facebook":
        color = "text-[#1877F2]"
        url = "https://facebook.com"
        break
      case "Instagram":
        color = "text-[#E4405F]"
        url = "https://instagram.com"
        break
      case "Twitter":
        color = "text-[#1DA1F2]"
        url = "https://twitter.com"
        break
      case "Youtube":
        color = "text-[#FF0000]"
        url = "https://youtube.com"
        break
      case "TikTok":
        color = "text-[#000000]"
        url = "https://tiktok.com"
        break
      case "Website":
        color = "text-[#000000]"
        url = "https://example.com"
        break
    }

    setNewSocialAccount({
      ...newSocialAccount,
      name: `${platform} Profile`,
      icon: platform,
      color,
      url,
    })
  }

  // Add social account
  const addSocialAccount = () => {
    if (!newSocialAccount.username) {
      toast({
        title: "Missing information",
        description: "Please fill in the username for the social account.",
        variant: "destructive",
      })
      return
    }

    // Add @ symbol for YouTube and TikTok usernames if they don't already have one
    let username = newSocialAccount.username
    if ((newSocialAccount.icon === "Youtube" || newSocialAccount.icon === "TikTok") && !username.startsWith("@")) {
      username = `@${username}`
    }

    // Create a unique ID for this social account
    const socialAccountWithId = {
      ...newSocialAccount,
      id: uuidv4(),
      username: username,
    }

    setEditedInfluencer({
      ...editedInfluencer,
      socialAccounts: [...editedInfluencer.socialAccounts, socialAccountWithId],
    })

    // Reset the social account form
    setNewSocialAccount({
      id: uuidv4(),
      name: "Instagram Profile",
      icon: "Instagram",
      color: "text-[#E4405F]",
      url: "https://instagram.com",
      username: "",
    })

    toast({
      title: "Social account added",
      description: "The social account has been added to your influencer.",
    })
  }

  // Remove social account
  const removeSocialAccount = (id: string) => {
    const updatedAccounts = editedInfluencer.socialAccounts.filter((account) =>
      account.id ? account.id !== id : false,
    )

    setEditedInfluencer({
      ...editedInfluencer,
      socialAccounts: updatedAccounts,
    })

    toast({
      title: "Social account removed",
      description: "The social account has been removed from your influencer.",
    })
  }

  // Render social icon based on platform
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
      case "Facebook":
        return <Facebook className="h-4 w-4" />
      case "Instagram":
        return <Instagram className="h-4 w-4" />
      case "Twitter":
        return <Twitter className="h-4 w-4" />
      case "Youtube":
        return <Youtube className="h-4 w-4" />
      case "TikTok":
        return <TiktokIcon className="h-4 w-4" />
      case "Website":
        return <Globe className="h-4 w-4" />
      default:
        return <Instagram className="h-4 w-4" />
    }
  }

  // Save edited product
  const saveEditedProduct = async () => {
    if (
      !editedProduct.name ||
      !editedProduct.brand ||
      !editedProduct.category ||
      !editedProduct.price ||
      !editedProduct.imageSrc
    ) {
      toast({
        title: "Missing product information",
        description: "Please fill in all required fields for the product.",
        variant: "destructive",
      })
      return
    }

    setSavingData(true)
    try {
      // Prepare the product to save
      const productToSave = { ...editedProduct }

      // If influencer information is provided, add it to the product
      if (editedInfluencer.name && editedInfluencer.image && editedInfluencer.bio) {
        // Set the brand of the influencer to match the product brand if not specified
        if (!editedInfluencer.brand) {
          editedInfluencer.brand = editedProduct.brand
        }

        // Save the influencer to Firestore
        await setDoc(doc(FIREBASE_DB, "influencers", editedInfluencer.id), editedInfluencer)

        // Add the influencer to the product
        productToSave.influencer = editedInfluencer
      } else {
        // If influencer was removed, make sure it's not in the saved product
        if (productToSave.influencer) {
          delete productToSave.influencer
        }
      }

      // Save to Firestore in listingsMade collection
      await setDoc(doc(FIREBASE_DB, "listingsMade", productToSave.id), productToSave)

      // Refresh products list via the callback
      await onProductUpdated()

      // Close the dialog
      onOpenChange(false)

      toast({
        title: "Product updated successfully",
        description: "Your product has been updated in the database.",
      })
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: "Error updating product",
        description: "There was an error. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingData(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-xl">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl">Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of your product, similar products, and influencer information.
              </DialogDescription>
            </DialogHeader>

            <Accordion type="single" collapsible defaultValue="product-details">
              <AccordionItem value="product-details" className="border-none">
                <AccordionTrigger className="py-4 px-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                  <div className="flex items-center gap-3 w-full justify-between">
                    <div className="flex items-center gap-3">
                      <Package className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-blue-800">Product Details</span>
                    </div>
                    {editedProduct.imageSrc &&
                      editedProduct.name &&
                      editedProduct.brand &&
                      editedProduct.category &&
                      editedProduct.price && (
                        <div className="h-3 w-3 rounded-full bg-green-500 border border-white shadow-sm"></div>
                      )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 px-1">
                  <div className="space-y-6">
                    {/* Image Upload Area */}
                    <div className="flex justify-center">
                      <div className="border-2 border-dashed rounded-3xl p-6 w-full max-w-xs flex flex-col items-center justify-center relative">
                        <div className="h-48 w-full rounded-3xl flex items-center justify-center overflow-hidden bg-white mb-4 relative">
                          {editedProduct.imageSrc ? (
                            <>
                              <Image
                                src={editedProduct.imageSrc || "/placeholder.svg"}
                                alt="Product"
                                fill
                                className="object-contain"
                              />
                              <button
                                onClick={() => setEditedProduct({ ...editedProduct, imageSrc: "" })}
                                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none inline-flex items-center justify-center"
                              >
                                <X className="h-4 w-4 text-white" />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => productImageInputRef.current?.click()}
                              className="w-full h-full rounded-full flex items-center justify-center transition-colors duration-200"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-600"
                              >
                                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                                <path d="M12 12v9" />
                                <path d="m16 16-4-4-4 4" />
                              </svg>
                            </button>
                          )}
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          ref={productImageInputRef}
                          accept="image/*"
                          onChange={handleProductImageUpload}
                          disabled={uploadingImage}
                        />
                        {!editedProduct.imageSrc ? (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => productImageInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="rounded-full"
                          >
                            {uploadingImage ? (
                              <div className="flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
                                Uploading...
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Upload className="h-4 w-4 mr-2" />
                                Upload Image
                              </div>
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => productImageInputRef.current?.click()}
                            disabled={uploadingImage}
                            className="rounded-full"
                          >
                            <div className="flex items-center">
                              <Upload className="h-4 w-4 mr-2" />
                              Change Image
                            </div>
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="product-name" className="text-gray-700">
                          Product Name
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="product-name"
                            placeholder="Enter product name"
                            value={editedProduct.name}
                            onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                            className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                          />
                          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="product-brand" className="text-gray-700">
                          Brand
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="product-brand"
                            placeholder="Enter brand name"
                            value={editedProduct.brand}
                            onChange={(e) => setEditedProduct({ ...editedProduct, brand: e.target.value })}
                            className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                          />
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="product-category" className="text-gray-700">
                          Category
                        </Label>
                        <div className="mt-1"></div>
                        <Select
                          value={editedProduct.category.toLowerCase()}
                          onValueChange={(value) => {
                            // Capitalize the first letter of the category
                            const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
                            setEditedProduct({ ...editedProduct, category: capitalizedValue })
                          }}
                        >
                          <SelectTrigger
                            id="product-category"
                            className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12"
                          >
                            <div className="flex items-center pl-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="text-gray-400 mr-2"
                              >
                                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                              </svg>
                              <SelectValue placeholder="Select category" className="capitalize" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beverage">Beverage</SelectItem>
                            <SelectItem value="coffee">Coffee</SelectItem>
                            <SelectItem value="snacks">Snacks</SelectItem>
                            <SelectItem value="breakfast">Breakfast</SelectItem>
                            <SelectItem value="personal care">Personal Care</SelectItem>
                            <SelectItem value="supplements">Supplements</SelectItem>
                            <SelectItem value="alcohol">Alcohol</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="product-price" className="text-gray-700">
                            Price
                          </Label>
                          <div className="mt-1 relative">
                            <Input
                              id="product-price"
                              placeholder="e.g. 12.99"
                              value={editedProduct.price}
                              onChange={(e) => {
                                // Remove any existing $ symbol and only allow numbers and decimal point
                                const value = e.target.value.replace(/^\$/, "").replace(/[^\d.]/g, "")
                                setEditedProduct({ ...editedProduct, price: value ? `$${value}` : "" })
                              }}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                            />
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="product-price-unit" className="text-gray-700">
                            Price Unit
                          </Label>
                          <div className="mt-1">
                            <Input
                              id="product-price-unit"
                              placeholder="e.g. pack, bag"
                              value={editedProduct.priceUnit}
                              onChange={(e) => setEditedProduct({ ...editedProduct, priceUnit: e.target.value })}
                              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Weight and GTIN inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="product-weight" className="text-gray-700">
                          Weight
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="product-weight"
                            placeholder="e.g. 250g, 1kg"
                            value={editedProduct.weight}
                            onChange={(e) => setEditedProduct({ ...editedProduct, weight: e.target.value })}
                            className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                          />
                          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="product-gtin" className="text-gray-700">
                          GTIN Number
                        </Label>
                        <div className="mt-1 relative">
                          <Input
                            id="product-gtin"
                            placeholder="e.g. 1234567890123"
                            value={editedProduct.gtin}
                            onChange={(e) => setEditedProduct({ ...editedProduct, gtin: e.target.value })}
                            className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                          />
                          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    {/* Product Description field */}
                    <div>
                      <Label htmlFor="product-description" className="text-gray-700">
                        Product Description
                      </Label>
                      <div className="mt-1 relative">
                        <Textarea
                          id="product-description"
                          placeholder="Enter product description"
                          value={editedProduct.description}
                          onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                          className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base min-h-[120px]"
                        />
                        <div className="absolute left-3 top-3 h-5 w-5 text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                            <polyline points="14 2 14 8 20 8"></polyline>
                            <line x1="16" y1="13" x2="8" y2="13"></line>
                            <line x1="16" y1="17" x2="8" y2="17"></line>
                            <polyline points="10 9 9 9 8 9"></polyline>
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="similar-products" className="border-none mt-4">
                <AccordionTrigger className="py-4 px-6 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Layers className="h-5 w-5 text-indigo-600" />
                    <span className="font-semibold text-indigo-800">Similar Products</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 px-1">
                  <div className="space-y-6">
                    <Card className="border-dashed border-gray-300 bg-gray-50">
                      <CardHeader>
                        <CardTitle className="text-lg font-medium">Add SKUs</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {/* Image Upload Area - Taller and positioned left */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="border border-gray-200 rounded-3xl p-4 flex flex-col items-center justify-center bg-white">
                            <div className="h-48 w-full rounded-3xl flex items-center justify-center overflow-hidden mb-3 relative">
                              {newSimilarProduct.imageUrl ? (
                                <>
                                  <Image
                                    src={newSimilarProduct.imageUrl || "/placeholder.svg"}
                                    alt="Similar Product"
                                    fill
                                    className="object-contain"
                                  />
                                  <button
                                    onClick={() => setNewSimilarProduct({ ...newSimilarProduct, imageUrl: "" })}
                                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none inline-flex items-center justify-center"
                                  >
                                    <X className="h-4 w-4 text-white" />
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => similarProductImageInputRef.current?.click()}
                                  className="w-full h-full rounded-full flex items-center justify-center transition-colors duration-200"
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="32"
                                    height="32"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-gray-600"
                                  >
                                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
                                    <path d="M12 12v9" />
                                    <path d="m16 16-4-4-4 4" />
                                  </svg>
                                </button>
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              ref={similarProductImageInputRef}
                              accept="image/*"
                              onChange={handleSimilarProductImageUpload}
                              disabled={uploadingImage}
                            />
                            {!newSimilarProduct.imageUrl && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => similarProductImageInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="rounded-full"
                                size="sm"
                              >
                                {uploadingImage ? "Uploading..." : "Upload Image"}
                              </Button>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="similar-name" className="text-gray-700">
                                Name
                              </Label>
                              <div className="mb-1"></div>
                              <Input
                                id="similar-name"
                                placeholder="Enter variation name"
                                value={newSimilarProduct.name}
                                onChange={(e) => setNewSimilarProduct({ ...newSimilarProduct, name: e.target.value })}
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                              />
                            </div>
                            <div>
                              <Label htmlFor="similar-description" className="text-gray-700">
                                Description
                              </Label>
                              <div className="mb-1"></div>
                              <Textarea
                                id="similar-description"
                                placeholder="Enter short description"
                                value={newSimilarProduct.description}
                                onChange={(e) =>
                                  setNewSimilarProduct({ ...newSimilarProduct, description: e.target.value })
                                }
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                rows={2}
                              />
                            </div>
                            <div>
                              <Label htmlFor="similar-weight" className="text-gray-700">
                                Weight
                              </Label>
                              <div className="mb-1"></div>
                              <div className="relative flex items-center">
                                <Input
                                  id="similar-weight"
                                  placeholder="e.g. 250g, 1kg"
                                  value={newSimilarProduct.weight}
                                  onChange={(e) =>
                                    weightEditMode &&
                                    setNewSimilarProduct({ ...newSimilarProduct, weight: e.target.value })
                                  }
                                  className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                  disabled={!weightEditMode}
                                />
                                <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                {newSimilarProduct.weight && (
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="absolute right-2 h-8 w-8 p-0 rounded-full"
                                    onClick={() => setWeightEditMode(!weightEditMode)}
                                  >
                                    {weightEditMode ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="text-blue-500"
                                      >
                                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                        <path d="m15 5 4 4" />
                                      </svg>
                                    )}
                                  </Button>
                                )}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="similar-gtin" className="text-gray-700">
                                GTIN Number
                              </Label>
                              <div className="mb-1"></div>
                              <div className="relative">
                                <Input
                                  id="similar-gtin"
                                  placeholder="e.g. 1234567890123"
                                  value={newSimilarProduct.gtin}
                                  onChange={(e) => setNewSimilarProduct({ ...newSimilarProduct, gtin: e.target.value })}
                                  className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                />
                                <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="w-full flex justify-center mt-1">
                          <Button
                            type="button"
                            onClick={addSimilarProduct}
                            className="w-2/3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Similar Product
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-2 text-gray-700">Added Similar Products</h4>
                      {editedProduct.similarProducts && editedProduct.similarProducts.length > 0 ? (
                        <div className="space-y-3">
                          {editedProduct.similarProducts.map((product) => (
                            <div
                              key={product.id}
                              className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <div className="h-12 w-12 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50">
                                <Image
                                  src={product.imageUrl || "/placeholder.svg?height=48&width=48"}
                                  alt={product.name}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-sm">{product.name}</p>
                                <div className="flex gap-2 text-xs text-gray-500">
                                  <span>{product.description}</span>
                                  {product.brand && <span className="text-purple-500">Brand: {product.brand}</span>}
                                  {product.weight && <span className="text-blue-500">Weight: {product.weight}</span>}
                                  {product.gtin && <span className="text-green-500">GTIN: {product.gtin}</span>}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                                onClick={() => removeSimilarProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                          <p className="text-sm text-gray-500">No similar products added yet.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="influencer-details" className="border-none mt-4">
                <AccordionTrigger className="py-4 px-6 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-purple-600" />
                    <span className="font-semibold text-purple-800">Influencer Details (Optional)</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-6 px-1">
                  <div className="space-y-6">
                    <Card className="overflow-hidden border-gray-200">
                      <CardContent className="p-0">
                        <div className="flex flex-col md:flex-row">
                          {/* Left side - Image upload */}
                          <div className="w-full md:w-1/3 bg-gradient-to-br from-purple-50 to-pink-50 p-6 flex flex-col items-center justify-center">
                            <div className="h-48 w-48 rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden bg-white mb-4 relative">
                              {editedInfluencer.image ? (
                                <>
                                  <Image
                                    src={editedInfluencer.image || "/placeholder.svg"}
                                    alt="Influencer"
                                    fill
                                    className="object-cover"
                                  />
                                  <button
                                    onClick={() => setEditedInfluencer({ ...editedInfluencer, image: "" })}
                                    className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none inline-flex items-center justify-center"
                                  >
                                    <X className="h-4 w-4 text-white" />
                                  </button>
                                </>
                              ) : (
                                <User className="h-24 w-24 text-gray-300" />
                              )}
                            </div>
                            <input
                              type="file"
                              className="hidden"
                              ref={influencerImageInputRef}
                              accept="image/*"
                              onChange={handleInfluencerImageUpload}
                              disabled={uploadingImage}
                            />
                            {editedInfluencer.image ? (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => influencerImageInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="rounded-full mt-2"
                              >
                                {uploadingImage ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                                    Uploading...
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Change Image
                                  </div>
                                )}
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => influencerImageInputRef.current?.click()}
                                disabled={uploadingImage}
                                className="rounded-full"
                              >
                                {uploadingImage ? (
                                  <div className="flex items-center">
                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-purple-500 mr-2"></div>
                                    Uploading...
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Upload Image
                                  </div>
                                )}
                              </Button>
                            )}
                          </div>

                          {/* Right side - Influencer details */}
                          <div className="w-full md:w-2/3 p-6">
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="influencer-name" className="text-gray-700">
                                  Name
                                </Label>
                                <div className="mt-1 relative">
                                  <Input
                                    id="influencer-name"
                                    placeholder="Enter influencer name"
                                    value={editedInfluencer.name}
                                    onChange={(e) => setEditedInfluencer({ ...editedInfluencer, name: e.target.value })}
                                    className="pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                                  />
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                              </div>

                              <div>
                                <Label htmlFor="influencer-bio" className="text-gray-700">
                                  Bio
                                </Label>
                                <div className="mb-1"></div>
                                <Textarea
                                  id="influencer-bio"
                                  placeholder="Enter influencer bio"
                                  value={editedInfluencer.bio}
                                  onChange={(e) => setEditedInfluencer({ ...editedInfluencer, bio: e.target.value })}
                                  rows={3}
                                  className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-base"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700">Social Accounts</h4>
                      </div>
                      <Card className="border-dashed border-gray-300 bg-gray-50">
                        <CardContent className="p-4 space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="social-platform" className="text-gray-700">
                                Platform
                              </Label>
                              <div className="mb-1"></div>
                              <Select value={newSocialAccount.icon} onValueChange={handleSocialPlatformChange}>
                                <SelectTrigger
                                  id="social-platform"
                                  className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-12"
                                >
                                  <SelectValue placeholder="Select platform" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Facebook">
                                    <div className="flex items-center">
                                      <Facebook className="h-4 w-4 text-[#1877F2] mr-2" />
                                      Facebook
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="Instagram">
                                    <div className="flex items-center">
                                      <Instagram className="h-4 w-4 text-[#E4405F] mr-2" />
                                      Instagram
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="Twitter">
                                    <div className="flex items-center">
                                      <Twitter className="h-4 w-4 text-[#1DA1F2] mr-2" />
                                      Twitter
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="Youtube">
                                    <div className="flex items-center">
                                      <Youtube className="h-4 w-4 text-[#FF0000] mr-2" />
                                      YouTube
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="TikTok">
                                    <div className="flex items-center">
                                      <TiktokIcon className="h-4 w-4 text-black mr-2" />
                                      TikTok
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="Website">
                                    <div className="flex items-center">
                                      <Globe className="h-4 w-4 text-[#000000] mr-2" />
                                      Website
                                    </div>
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="social-username" className="text-gray-700">
                                Username
                              </Label>
                              <div className="mb-1"></div>
                              <Input
                                id="social-username"
                                placeholder="Enter username"
                                value={newSocialAccount.username}
                                onChange={(e) => setNewSocialAccount({ ...newSocialAccount, username: e.target.value })}
                                className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                              />
                            </div>
                          </div>
                          <div className="w-full flex justify-center mt-1">
                            <Button
                              type="button"
                              onClick={addSocialAccount}
                              className="w-2/3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Social Account
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="mt-4">
                        <h4 className="text-sm font-medium mb-2 text-gray-700">Added Accounts</h4>
                        {editedInfluencer.socialAccounts && editedInfluencer.socialAccounts.length > 0 ? (
                          <div className="space-y-3">
                            {editedInfluencer.socialAccounts.map((account, index) => (
                              <div
                                key={account.id || index}
                                className="flex items-center gap-3 p-3 border border-gray-100 rounded-3xl hover:bg-gray-50 transition-colors"
                              >
                                <div
                                  className={`h-10 w-10 rounded-full flex items-center justify-center ${account.color} bg-opacity-10`}
                                >
                                  {renderSocialIcon(account.icon)}
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{account.name}</p>
                                  <p className="text-xs text-gray-500">
                                    <span className={account.color}>{account.url}/</span>
                                    {account.username}
                                  </p>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => removeSocialAccount(account.id || index.toString())}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 border border-dashed border-gray-200 rounded-lg">
                            <p className="text-sm text-gray-500">No social accounts added yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <DialogFooter className="mt-8">
              <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
                Cancel
              </Button>
              <Button
                onClick={saveEditedProduct}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                disabled={savingData}
              >
                {savingData ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Save Changes
                  </div>
                )}
              </Button>
            </DialogFooter>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

