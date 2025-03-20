"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import {
  User,
  LogOut,
  Home,
  Plus,
  Trash2,
  Upload,
  ImageIcon,
  Search,
  Instagram,
  Twitter,
  Youtube,
  Package,
  Tag,
  DollarSign,
  Layers,
  Users,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Globe,
  X,
} from "lucide-react"
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig"
import { collection, getDocs, doc, deleteDoc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { InstagramIcon as TiktokIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import axios from "axios"

import LogoImage from "../login/Images/download.png"

// Define types for our data
interface SocialAccount {
  name: string
  icon: string
  color: string
  url: string
  username: string
}

interface Influencer {
  id: string
  name: string
  image: string
  followers: string
  bio: string
  brand: string
  socialAccounts: SocialAccount[]
}

interface SimilarProduct {
  id: string
  name: string
  description: string
  imageUrl: string
  weight?: string
  gtin?: string
}

interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: string
  priceUnit?: string
  imageSrc: string
  influencer?: Influencer
  similarProducts: SimilarProduct[]
  weight?: string
  gtin?: string
}

export default function ManagePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [products, setProducts] = useState<Product[]>([])
  const [influencers, setInfluencers] = useState<Influencer[]>([])
  const [activeTab, setActiveTab] = useState("products")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [savingData, setSavingData] = useState(false)
  const [showLoginPrompt, setShowLoginPrompt] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState("all")

  // Product form state
  const [newProduct, setNewProduct] = useState<Product>({
    id: uuidv4(),
    name: "",
    brand: "",
    category: "",
    price: "",
    priceUnit: "",
    imageSrc: "",
    similarProducts: [],
    weight: "",
    gtin: "",
  })

  // Influencer form state for the product
  const [newInfluencer, setNewInfluencer] = useState<Influencer>({
    id: uuidv4(),
    name: "",
    image: "",
    followers: "",
    bio: "",
    brand: "",
    socialAccounts: [],
  })

  // Similar product form state
  const [newSimilarProduct, setNewSimilarProduct] = useState<SimilarProduct>({
    id: uuidv4(),
    name: "",
    description: "",
    imageUrl: "",
    weight: "",
    gtin: "",
  })

  // Social account form state
  const [newSocialAccount, setNewSocialAccount] = useState<SocialAccount>({
    name: "",
    icon: "Instagram",
    color: "text-[#E4405F]",
    url: "https://instagram.com",
    username: "",
  })

  // Add refs for file inputs
  const productImageInputRef = useRef<HTMLInputElement>(null)
  const similarProductImageInputRef = useRef<HTMLInputElement>(null)
  const influencerImageInputRef = useRef<HTMLInputElement>(null)

  // Fetch user data and products/influencers on component mount
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }

      // Fetch products and influencers regardless of authentication status
      await fetchProducts()
      await fetchInfluencers()
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const listedProductsCollection = collection(FIREBASE_DB, "listedProducts")
      const listedProductsSnapshot = await getDocs(listedProductsCollection)
      const productsList = listedProductsSnapshot.docs.map((doc) => doc.data() as Product)
      setProducts(productsList)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: "Error fetching products",
        description: "There was an error loading products. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Fetch influencers from Firestore
  const fetchInfluencers = async () => {
    try {
      const influencersCollection = collection(FIREBASE_DB, "influencers")
      const influencersSnapshot = await getDocs(influencersCollection)
      const influencersList = influencersSnapshot.docs.map((doc) => doc.data() as Influencer)
      setInfluencers(influencersList)
    } catch (error) {
      console.error("Error fetching influencers:", error)
      toast({
        title: "Error fetching influencers",
        description: "There was an error loading influencers. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Check if user is authenticated before performing actions
  const checkAuth = () => {
    if (!user) {
      setShowLoginPrompt(true)
      return false
    }
    return true
  }

  // Handle image upload for products
  const handleProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkAuth()) return

    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData)

      if (response.data.success) {
        const downloadUrl = response.data.data.secure_url

        setNewProduct({
          ...newProduct,
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

  // Handle image upload for similar products
  const handleSimilarProductImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkAuth()) return

    const file = e.target.files?.[0]
    if (!file || !user) return

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

  // Handle image upload for influencers
  const handleInfluencerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!checkAuth()) return

    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData)

      if (response.data.success) {
        const downloadUrl = response.data.data.secure_url

        setNewInfluencer({
          ...newInfluencer,
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

  // Add similar product to the new product
  const addSimilarProduct = () => {
    if (!checkAuth()) return

    if (!newSimilarProduct.name || !newSimilarProduct.description || !newSimilarProduct.imageUrl) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields for the similar product.",
        variant: "destructive",
      })
      return
    }

    setNewProduct({
      ...newProduct,
      similarProducts: [...newProduct.similarProducts, { ...newSimilarProduct }],
    })

    // Reset the similar product form
    setNewSimilarProduct({
      id: uuidv4(),
      name: "",
      description: "",
      imageUrl: "",
      weight: "",
      gtin: "",
    })

    toast({
      title: "Similar product added",
      description: "The similar product has been added to your product.",
    })
  }

  // Remove similar product from the new product
  const removeSimilarProduct = (id: string) => {
    if (!checkAuth()) return

    setNewProduct({
      ...newProduct,
      similarProducts: newProduct.similarProducts.filter((product) => product.id !== id),
    })

    toast({
      title: "Similar product removed",
      description: "The similar product has been removed from your product.",
    })
  }

  // Add social account to the new influencer
  const addSocialAccount = () => {
    if (!checkAuth()) return

    if (!newSocialAccount.username) {
      toast({
        title: "Missing information",
        description: "Please fill in the username for the social account.",
        variant: "destructive",
      })
      return
    }

    setNewInfluencer({
      ...newInfluencer,
      socialAccounts: [...newInfluencer.socialAccounts, { ...newSocialAccount }],
    })

    // Reset the social account form
    setNewSocialAccount({
      name: `${newSocialAccount.icon} Profile`,
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

  // Remove social account from the new influencer
  const removeSocialAccount = (index: number) => {
    if (!checkAuth()) return

    const updatedAccounts = [...newInfluencer.socialAccounts]
    updatedAccounts.splice(index, 1)
    setNewInfluencer({
      ...newInfluencer,
      socialAccounts: updatedAccounts,
    })

    toast({
      title: "Social account removed",
      description: "The social account has been removed from your influencer.",
    })
  }

  // Handle social platform change
  const handleSocialPlatformChange = (platform: string) => {
    let color = "text-[#E4405F]"
    let url = "https://instagram.com"

    switch (platform) {
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

  // Save new product with influencer to Firestore
  const saveProduct = async () => {
    if (!checkAuth()) return

    if (!newProduct.name || !newProduct.brand || !newProduct.category || !newProduct.price || !newProduct.imageSrc) {
      toast({
        title: "Missing product information",
        description: "Please fill in all required fields for the product.",
        variant: "destructive",
      })
      return
    }

    // Check if influencer information is provided but incomplete
    if (
      (newInfluencer.name || newInfluencer.image || newInfluencer.followers || newInfluencer.bio) &&
      (!newInfluencer.name || !newInfluencer.image || !newInfluencer.followers || !newInfluencer.bio)
    ) {
      toast({
        title: "Incomplete influencer information",
        description: "Please fill in all required fields for the influencer or leave all fields empty.",
        variant: "destructive",
      })
      return
    }

    setSavingData(true)
    try {
      // Prepare the product to save
      const productToSave = { ...newProduct }

      // Remove or comment out this code:
      /*
      // Add the main product as the first similar product if none exist
      if (productToSave.similarProducts.length === 0) {
        const mainAsSimilar: SimilarProduct = {
          id: uuidv4(),
          name: productToSave.name,
          description: `Original ${productToSave.name}`,
          imageUrl: productToSave.imageSrc,
          weight: productToSave.weight,
          gtin: productToSave.gtin,
        }
        productToSave.similarProducts = [mainAsSimilar, ...productToSave.similarProducts]
      }
      */

      // If influencer information is provided, add it to the product
      if (newInfluencer.name && newInfluencer.image && newInfluencer.followers && newInfluencer.bio) {
        // Set the brand of the influencer to match the product brand if not specified
        if (!newInfluencer.brand) {
          newInfluencer.brand = newProduct.brand
        }

        // Save the influencer to Firestore
        await setDoc(doc(FIREBASE_DB, "influencers", newInfluencer.id), newInfluencer)

        // Add the influencer to the product
        productToSave.influencer = newInfluencer
      }

      // Save to Firestore in listedProducts collection
      await setDoc(doc(FIREBASE_DB, "listedProducts", productToSave.id), productToSave)

      // Refresh products list
      await fetchProducts()
      await fetchInfluencers()

      // Reset forms
      setNewProduct({
        id: uuidv4(),
        name: "",
        brand: "",
        category: "",
        price: "",
        priceUnit: "",
        imageSrc: "",
        similarProducts: [],
        weight: "",
        gtin: "",
      })

      setNewInfluencer({
        id: uuidv4(),
        name: "",
        image: "",
        followers: "",
        bio: "",
        brand: "",
        socialAccounts: [],
      })

      setShowAddProduct(false)

      toast({
        title: "Product saved successfully",
        description: "Your product has been added to the database.",
      })
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error saving product",
        description: "There was an error saving your product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSavingData(false)
    }
  }

  // Delete product from Firestore
  const deleteProduct = async (id: string) => {
    if (!checkAuth()) return

    try {
      await deleteDoc(doc(FIREBASE_DB, "listedProducts", id))
      await fetchProducts()

      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from the database.",
      })
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error deleting product",
        description: "There was an error deleting the product. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesCategory
  })

  // Get unique categories for filter
  // const categories = ["all", ...new Set(products.map((product) => product.category.toLowerCase()))]

  // Render social icon based on platform
  const renderSocialIcon = (platform: string) => {
    switch (platform) {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-500">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={LogoImage.src} alt="" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <span className="text-xl font-semibold text-zinc-800">Mall AI</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/homepage">
              <Button variant="outline" className="flex items-center gap-2 rounded-full">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            {user ? (
              <Button
                onClick={() => router.push("/join")}
                variant="outline"
                className="flex items-center gap-2 rounded-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                onClick={() => router.push("/join")}
                variant="outline"
                className="flex items-center gap-2 rounded-full"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your products and influencers for the Mall AI platform.</p>
          {!user && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <p className="text-blue-700">
                  You are currently in view-only mode. Please{" "}
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blue-700 underline"
                    onClick={() => router.push("/join")}
                  >
                    login
                  </Button>{" "}
                  to add or modify products and influencers.
                </p>
              </div>
            </div>
          )}
        </div>

        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            {/* <TabsList className="grid w-full md:w-[400px] grid-cols-1">
              <TabsTrigger value="products" className="rounded-lg">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Products
              </TabsTrigger>
            </TabsList> */}
            <div></div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              {/* <div className="relative w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-full md:w-[250px] rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div> */}

              <div className="relative w-full md:w-auto">
                <ScrollArea className="w-full">
                  <div className="flex space-x-2 min-w-max">
                    {[
                      "all",
                      "beverage",
                      "coffee",
                      "snacks",
                      "breakfast",
                      "personal_care",
                      "supplements",
                      "alcohol",
                    ].map((category) => (
                      <Button
                        key={category}
                        variant={categoryFilter === category ? "default" : "outline"}
                        className={`whitespace-nowrap rounded-full px-4 text-sm h-9 ${
                          categoryFilter === category
                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                            : "hover:bg-gray-100 text-gray-800"
                        } transition-all duration-200`}
                        onClick={() => setCategoryFilter(category)}
                      >
                        {category === "all"
                          ? "All Categories"
                          : category === "personal_care"
                            ? "Personal Care"
                            : category.charAt(0).toUpperCase() + category.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              <Button
                onClick={() => (user ? setShowAddProduct(true) : setShowLoginPrompt(true))}
                className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 w-full md:w-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <TabsContent value="products" className="mt-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="group"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200 h-full rounded-xl">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Image
                          src={product.imageSrc || "/placeholder.svg?height=200&width=200"}
                          alt={product.name}
                          width={160}
                          height={160}
                          className="object-contain group-hover:scale-110 transition-transform duration-300 z-10"
                        />
                        {product.influencer && (
                          <div className="absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 shadow-md z-20">
                            <Image
                              src={product.influencer.image || "/placeholder.svg?height=48&width=48"}
                              alt={product.influencer.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <CardContent className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-bold text-lg">{product.name}</h3>
                            <p className="text-gray-600 text-sm">{product.brand}</p>
                            <Badge
                              variant="outline"
                              className="mt-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200"
                            >
                              {product.category}
                            </Badge>
                          </div>
                          <div className="flex items-center bg-green-50 px-3 py-1 rounded-full border border-green-100">
                            <span className="text-lg font-bold text-green-700">{product.price}</span>
                            {product.priceUnit && (
                              <span className="text-xs text-green-600 ml-1">/{product.priceUnit}</span>
                            )}
                          </div>
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-500 flex items-center">
                            <Layers className="h-4 w-4 mr-1 text-blue-500" />
                            {product.similarProducts.length} similar products
                          </div>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="rounded-full"
                            onClick={() => deleteProduct(product.id)}
                            disabled={!user}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="bg-blue-50 inline-flex p-4 rounded-full mb-4">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== "all"
                    ? "No products match your search criteria. Try different search terms or filters."
                    : "You haven't added any products yet."}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {(searchQuery || categoryFilter !== "all") && (
                    <Button
                      onClick={() => {
                        setSearchQuery("")
                        setCategoryFilter("all")
                      }}
                      variant="outline"
                      className="rounded-full"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setSearchQuery("")
                      setCategoryFilter("all")
                      user ? setShowAddProduct(true) : setShowLoginPrompt(true)
                    }}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-[425px] rounded-xl">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>You need to be logged in to perform this action.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-4 mt-4">
            <Button variant="outline" onClick={() => setShowLoginPrompt(false)} className="rounded-full">
              Cancel
            </Button>
            <Button
              onClick={() => router.push("/join")}
              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden rounded-xl">
          <ScrollArea className="max-h-[85vh]">
            <div className="p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl">Add New Product</DialogTitle>
                <DialogDescription>Fill in the details below to add a new product to the database.</DialogDescription>
              </DialogHeader>

              <Accordion type="single" collapsible defaultValue="product-details">
                <AccordionItem value="product-details" className="border-none">
                  <AccordionTrigger className="py-4 px-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <div className="flex items-center gap-3 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Product Details</span>
                      </div>
                      {newProduct.imageSrc && (
                        <div className="h-3 w-3 rounded-full bg-green-500 border border-white shadow-sm"></div>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-6 px-1">
                    <div className="space-y-6">
                      {/* Image Upload Area - Moved to top and centered with dotted border */}
                      <div className="flex justify-center">
                        <div className="border-2 border-dashed rounded-3xl p-6 w-full max-w-xs flex flex-col items-center justify-center relative">
                          <div className="h-48 w-full rounded-3xl flex items-center justify-center overflow-hidden bg-white mb-4 relative">
                            {newProduct.imageSrc ? (
                              <>
                                <Image
                                  src={newProduct.imageSrc || "/placeholder.svg"}
                                  alt="Product"
                                  fill
                                  className="object-contain"
                                />
                                <button
                                  onClick={() => setNewProduct({ ...newProduct, imageSrc: "" })}
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
                          {!newProduct.imageSrc && (
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
                                  {newProduct.imageSrc ? "Change Image" : "Upload Image"}
                                </div>
                              )}
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
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                              value={newProduct.brand}
                              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                            value={newProduct.category}
                            onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                          >
                            <SelectTrigger
                              id="product-category"
                              className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-10"
                            >
                              <div className="flex items-center">
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
                                  <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                                </svg>
                                <SelectValue placeholder="Select category" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beverage">Beverage</SelectItem>
                              <SelectItem value="coffee">Coffee</SelectItem>
                              <SelectItem value="snacks">Snacks</SelectItem>
                              <SelectItem value="breakfast">Breakfast</SelectItem>
                              <SelectItem value="personal_care">Personal Care</SelectItem>
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
                                placeholder="e.g. $12.99"
                                value={newProduct.price}
                                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                                className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                                value={newProduct.priceUnit}
                                onChange={(e) => setNewProduct({ ...newProduct, priceUnit: e.target.value })}
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Added Weight and GTIN inputs */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="product-weight" className="text-gray-700">
                            Weight
                          </Label>
                          <div className="mt-1 relative">
                            <Input
                              id="product-weight"
                              placeholder="e.g. 250g, 1kg"
                              value={newProduct.weight}
                              onChange={(e) => setNewProduct({ ...newProduct, weight: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                              value={newProduct.gtin}
                              onChange={(e) => setNewProduct({ ...newProduct, gtin: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            />
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>
                      {newProduct.imageSrc &&
                        newProduct.name &&
                        newProduct.brand &&
                        newProduct.category &&
                        newProduct.price && (
                          <div className="flex justify-center mt-6">
                            <Button
                              type="button"
                              variant="default"
                              className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                              onClick={() => {
                                // Add the main product as the first similar product
                                const mainAsSimilar: SimilarProduct = {
                                  id: uuidv4(),
                                  name: newProduct.name,
                                  description: `Original ${newProduct.name}`,
                                  imageUrl: newProduct.imageSrc,
                                  weight: newProduct.weight,
                                  gtin: newProduct.gtin,
                                }
                                setNewProduct({
                                  ...newProduct,
                                  similarProducts: [mainAsSimilar, ...newProduct.similarProducts],
                                })

                                // Close the current accordion and open the Similar Products accordion
                                const accordionTrigger = document.querySelector(
                                  '[data-state="open"] button[data-state="open"]',
                                )
                                if (accordionTrigger) {
                                  ;(accordionTrigger as HTMLButtonElement).click()
                                }
                                const similarProductsTrigger = document.querySelector(
                                  '[value="similar-products"] button',
                                )
                                if (similarProductsTrigger) {
                                  ;(similarProductsTrigger as HTMLButtonElement).click()
                                }
                              }}
                            >
                              Continue to Similar Products
                            </Button>
                          </div>
                        )}
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
                          <CardTitle className="text-lg font-medium">Add Similar Product</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Image Upload Area - Taller and positioned left */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="border border-gray-200 rounded-3xl p-4 flex flex-col items-center justify-center bg-white">
                              <div className="h-48 w-full rounded-3xl flex items-center justify-center overflow-hidden  mb-3 relative">
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
                                <Input
                                  id="similar-name"
                                  placeholder="Enter variation name"
                                  value={newSimilarProduct.name}
                                  onChange={(e) => setNewSimilarProduct({ ...newSimilarProduct, name: e.target.value })}
                                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                />
                              </div>
                              <div>
                                <Label htmlFor="similar-description" className="text-gray-700">
                                  Description
                                </Label>
                                <Textarea
                                  id="similar-description"
                                  placeholder="Enter short description"
                                  value={newSimilarProduct.description}
                                  onChange={(e) =>
                                    setNewSimilarProduct({ ...newSimilarProduct, description: e.target.value })
                                  }
                                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  rows={2}
                                />
                              </div>
                              <div>
                                <Label htmlFor="similar-weight" className="text-gray-700">
                                  Weight
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="similar-weight"
                                    placeholder="e.g. 250g, 1kg"
                                    value={newSimilarProduct.weight}
                                    onChange={(e) =>
                                      setNewSimilarProduct({ ...newSimilarProduct, weight: e.target.value })
                                    }
                                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor="similar-gtin" className="text-gray-700">
                                  GTIN Number
                                </Label>
                                <div className="relative">
                                  <Input
                                    id="similar-gtin"
                                    placeholder="e.g. 1234567890123"
                                    value={newSimilarProduct.gtin}
                                    onChange={(e) =>
                                      setNewSimilarProduct({ ...newSimilarProduct, gtin: e.target.value })
                                    }
                                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                                  />
                                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          </div>

                          <Button
                            type="button"
                            onClick={addSimilarProduct}
                            className="w-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Similar Product
                          </Button>
                        </CardContent>
                      </Card>

                      <div className="mt-6">
                        <h4 className="text-sm font-medium mb-2 text-gray-700">Added Similar Products</h4>
                        {newProduct.similarProducts.length > 0 ? (
                          <div className="space-y-3">
                            {newProduct.similarProducts.map((product) => (
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
                              <div className="h-40 w-40 rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden bg-white mb-4 relative">
                                {newInfluencer.image ? (
                                  <Image
                                    src={newInfluencer.image || "/placeholder.svg"}
                                    alt="Influencer"
                                    fill
                                    className="object-cover"
                                  />
                                ) : (
                                  <User className="h-20 w-20 text-gray-300" />
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
                                    {newInfluencer.image ? "Change Image" : "Upload Image"}
                                  </div>
                                )}
                              </Button>
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
                                      value={newInfluencer.name}
                                      onChange={(e) => setNewInfluencer({ ...newInfluencer, name: e.target.value })}
                                      className="pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="influencer-followers" className="text-gray-700">
                                    Followers
                                  </Label>
                                  <div className="mt-1 relative">
                                    <Input
                                      id="influencer-followers"
                                      placeholder="Enter follower count (e.g. 1.2M)"
                                      value={newInfluencer.followers}
                                      onChange={(e) =>
                                        setNewInfluencer({ ...newInfluencer, followers: e.target.value })
                                      }
                                      className="pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                    <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  </div>
                                </div>

                                <div>
                                  <Label htmlFor="influencer-bio" className="text-gray-700">
                                    Bio
                                  </Label>
                                  <Textarea
                                    id="influencer-bio"
                                    placeholder="Enter influencer bio"
                                    value={newInfluencer.bio}
                                    onChange={(e) => setNewInfluencer({ ...newInfluencer, bio: e.target.value })}
                                    rows={3}
                                    className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
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
                                <Select value={newSocialAccount.icon} onValueChange={handleSocialPlatformChange}>
                                  <SelectTrigger
                                    id="social-platform"
                                    className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                  >
                                    <SelectValue placeholder="Select platform" />
                                  </SelectTrigger>
                                  <SelectContent>
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
                                <Input
                                  id="social-username"
                                  placeholder="Enter username"
                                  value={newSocialAccount.username}
                                  onChange={(e) =>
                                    setNewSocialAccount({ ...newSocialAccount, username: e.target.value })
                                  }
                                  className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                />
                              </div>
                            </div>
                            <Button
                              type="button"
                              onClick={addSocialAccount}
                              className="w-full rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Social Account
                            </Button>
                          </CardContent>
                        </Card>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2 text-gray-700">Added Social Accounts</h4>
                          {newInfluencer.socialAccounts.length > 0 ? (
                            <div className="space-y-3">
                              {newInfluencer.socialAccounts.map((account, index) => (
                                <div
                                  key={index}
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
                                    onClick={() => removeSocialAccount(index)}
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
                <Button variant="outline" onClick={() => setShowAddProduct(false)} className="rounded-full">
                  Cancel
                </Button>
                <Button
                  onClick={saveProduct}
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
                      Save Product
                    </div>
                  )}
                </Button>
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

