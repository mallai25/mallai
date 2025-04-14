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
  Globe,
  X,
  Building2,
  UserCircle2,
  Facebook,
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
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { InstagramIcon as TiktokIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import axios from "axios"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth"
import { EditProductDialog } from "./editModal"

import LogoImage from "../login/Images/download.png"

// Define types for our data
interface SocialAccount {
  id?: string // Make it optional for backward compatibility
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
  bio: string
  brand: string
  socialAccounts: SocialAccount[]
}

// First, update the SimilarProduct interface to include price
interface SimilarProduct {
  id: string
  name: string
  description: string
  imageUrl: string
  weight?: string
  gtin?: string
  brand?: string // Add this line
  mainProductId?: string // Add this field to store the reference to the main product
  price?: string // Add this field for the price
}

interface Product {
  id: string
  name: string
  brand: string
  category: string
  price: string
  priceUnit: string
  imageSrc: string
  description: string // Add this line
  influencer: Influencer
  similarProducts: SimilarProduct[]
  weight: string
  gtin: string
  uploaderId?: string // Add this field to track who uploaded the product
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
  const [isLogin, setIsLogin] = useState(true)
  const [accountType, setAccountType] = useState("cpg")
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // Add a new state to track which product is being considered for deletion
  // Add this near the other state declarations
  const [productToDelete, setProductToDelete] = useState<Product | null>(null)

  // Form states for login/register
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")

  // Product form state
  const [newProduct, setNewProduct] = useState<Product>({
    id: uuidv4(),
    name: "",
    brand: "",
    category: "",
    price: "",
    priceUnit: "",
    imageSrc: "",
    description: "",
    influencer: {
      id: uuidv4(),
      name: "",
      image: "",
      bio: "",
      brand: "",
      socialAccounts: [],
    },
    similarProducts: [],
    weight: "",
    gtin: "",
    uploaderId: undefined,
  })

  // Influencer form state for the product
  const [newInfluencer, setNewInfluencer] = useState<Influencer>({
    id: uuidv4(),
    name: "",
    image: "",
    bio: "",
    brand: "",
    socialAccounts: [],
  })

  // Update the newSimilarProduct state to include price
  const [newSimilarProduct, setNewSimilarProduct] = useState<SimilarProduct>({
    id: uuidv4(),
    name: "",
    description: "",
    imageUrl: "",
    weight: "",
    gtin: "",
    brand: "", // Add this line
    price: "", // Initialize price as empty string
  })

  // Social account form state
  const [newSocialAccount, setNewSocialAccount] = useState<SocialAccount>({
    name: "Instagram",
    icon: "Instagram",
    color: "text-[#E4405F]",
    url: "https://instagram.com",
    username: "",
  })

  // Add refs for file inputs
  const productImageInputRef = useRef<HTMLInputElement>(null)
  const similarProductImageInputRef = useRef<HTMLInputElement>(null)
  const influencerImageInputRef = useRef<HTMLInputElement>(null)

  // First, add a new state to track if the weight field is in edit mode
  // Add this near the other state declarations
  const [weightEditMode, setWeightEditMode] = useState(false)

  // Add a new state for price edit mode (add this near the weightEditMode state)
  const [priceEditMode, setPriceEditMode] = useState(false)

  // Add this near the other state declarations
  const [mainProductId, setMainProductId] = useState<string>(newProduct.id)

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

  // Handle sign in
  const handleSignIn = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      setShowLoginPrompt(false)
      toast({
        title: "Signed in successfully",
        description: "You are now logged in to your account.",
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle sign up
  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      const user = userCredential.user

      // Update the user's profile with the name
      await updateProfile(user, {
        displayName: name,
      })

      // Store additional user data in Firestore
      const userDocRef = doc(FIREBASE_DB, "users", user.uid)
      await setDoc(userDocRef, {
        name: name,
        email: email,
        accountType: accountType,
        createdAt: new Date().toISOString(),
      })

      setShowLoginPrompt(false)
      toast({
        title: "Account created successfully",
        description: "Your account has been created and you are now logged in.",
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Fetch products from Firestore
  const fetchProducts = async () => {
    try {
      const listedProductsCollection = collection(FIREBASE_DB, "listingTry")
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
      // Set empty array to prevent UI from being stuck in loading state
      setProducts([])
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
      // Don't return early, just set the flag
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
      similarProducts: [...newProduct.similarProducts, { ...newSimilarProduct, mainProductId }],
    })

    // Update the addSimilarProduct function to pre-fill the similar product with the main product's price
    // Find where you set the mainAsSimilar object and add the price field:
    const mainAsSimilar: SimilarProduct = {
      id: uuidv4(),
      name: newProduct.name,
      description: newProduct.description || `Original ${newProduct.name}`,
      imageUrl: newProduct.imageSrc,
      weight: newProduct.weight,
      gtin: newProduct.gtin,
      brand: newProduct.brand, // Explicitly add the brand name from the main product
      mainProductId: newProduct.id, // Add the main product ID reference to itself
      price: newProduct.price, // Add the price from the main product
    }

    // Reset logic in addSimilarProduct function to include price
    setNewSimilarProduct({
      id: uuidv4(),
      name: "",
      description: "",
      imageUrl: "",
      weight: newProduct.weight || "", // Keep pre-filling with the main product weight
      brand: newProduct.brand || "", // Keep pre-filling with the main product brand
      gtin: "",
      mainProductId, // Keep the reference to the main product ID
      price: newProduct.price || "", // Keep pre-filling with the main product price
    })

    // Reset price edit mode along with weight edit mode
    setWeightEditMode(false)
    setPriceEditMode(false)

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

  // Find the handleSocialPlatformChange function and modify it to include a unique ID for each social account
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

  // Find the addSocialAccount function and modify it to handle TikTok usernames the same way as YouTube usernames

  // Modify the addSocialAccount function to handle both YouTube and TikTok usernames and ensure unique entries
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

    // Add @ symbol for YouTube and TikTok usernames if they don't already have one
    let username = newSocialAccount.username
    if ((newSocialAccount.icon === "Youtube" || newSocialAccount.icon === "TikTok") && !username.startsWith("@")) {
      username = `@${username}`
    }

    // Create a unique ID for this social account to ensure we can add multiple of the same platform
    const socialAccountWithId = {
      ...newSocialAccount,
      id: uuidv4(), // Add a unique ID
      username: username, // Use the potentially modified username
    }

    setNewInfluencer({
      ...newInfluencer,
      socialAccounts: [...newInfluencer.socialAccounts, socialAccountWithId],
    })

    // Reset the social account form
    setNewSocialAccount({
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

  // Update the removeSocialAccount function to use the id instead of index
  const removeSocialAccount = (id: string) => {
    if (!checkAuth()) return

    const updatedAccounts = newInfluencer.socialAccounts.filter((account) =>
      // Handle both cases: accounts with and without id
      account.id ? account.id !== id : false,
    )

    setNewInfluencer({
      ...newInfluencer,
      socialAccounts: updatedAccounts,
    })

    toast({
      title: "Social account removed",
      description: "The social account has been removed from your influencer.",
    })
  }

  // Save new product with influencer to Firestore
  const saveProduct = async () => {
    if (!user) {
      setShowLoginPrompt(true)
      return
    }

    if (!newProduct.name || !newProduct.brand || !newProduct.category || !newProduct.price || !newProduct.imageSrc) {
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
      const productToSave = {
        ...newProduct,
        uploaderId: user.uid, // Add the current user's ID as the uploader
      }

      // If influencer information is provided, add it to the product
      if (newInfluencer.name && newInfluencer.image && newInfluencer.bio) {
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
      await setDoc(doc(FIREBASE_DB, "listingTry", productToSave.id), productToSave)

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
        description: "",
        influencer: {
          id: uuidv4(),
          name: "",
          image: "",
          bio: "",
          brand: "",
          socialAccounts: [],
        },
        similarProducts: [],
        weight: "",
        gtin: "",
        uploaderId: undefined,
      })

      setNewInfluencer({
        id: uuidv4(),
        name: "",
        image: "",
        bio: "",
        brand: "",
        socialAccounts: [],
      })

      // Reset the mainProductId state with a new ID
      setMainProductId(uuidv4())

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

  // Find the deleteProduct function and modify it to handle the confirmation flow
  // Replace the existing deleteProduct function with this:
  // Delete product from Firestore
  const deleteProduct = async (id: string) => {
    if (!checkAuth()) return

    try {
      await deleteDoc(doc(FIREBASE_DB, "listingTry", id))
      await fetchProducts()

      toast({
        title: "Product deleted successfully",
        description: "The product has been removed from the database.",
      })

      // Close the confirmation dialog
      setProductToDelete(null)
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

    // Handle special category cases
    let matchesCategory = categoryFilter === "all"

    if (
      categoryFilter === "personal_Care" &&
      (product.category.toLowerCase() === "personal care" || product.category.toLowerCase() === "deodorant")
    ) {
      matchesCategory = true
    } else if (
      categoryFilter === "snacks" &&
      (product.category.toLowerCase() === "snacks" || product.category.toLowerCase() === "candy")
    ) {
      matchesCategory = true
    } else if (categoryFilter.toLowerCase() === product.category.toLowerCase()) {
      matchesCategory = true
    }

    return matchesSearch && matchesCategory
  })

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
                <Avatar className="w-9 h-9 rounded-xl">
                  <AvatarImage src={LogoImage.src || "/placeholder.svg"} alt="" />
                </Avatar>
                <span className="text-xl font-semibold text-zinc-800">Mall ai</span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/join">
              <Button variant="outline" className="flex items-center gap-2 rounded-full">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </Button>
            </Link>
            {user ? (
              <Button
                onClick={async () => {
                  try {
                    await signOut(FIREBASE_AUTH)
                    toast({
                      title: "Logged out successfully",
                      description: "You have been logged out of your account.",
                    })
                  } catch (error) {
                    console.error("Error signing out:", error)
                    toast({
                      title: "Error logging out",
                      description: "There was an error logging out. Please try again.",
                      variant: "destructive",
                    })
                  }
                }}
                variant="outline"
                className="flex items-center gap-2 rounded-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </Button>
            ) : (
              <Button
                onClick={() => setShowLoginPrompt(true)}
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
        {!user && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <div className="text-blue-500 mt-1">
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
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-blue-800">Browsing as Guest</h3>
            </div>
          </div>
        )}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage your products and influencers on Mall ai platform.</p>
        </div>

        <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
            <div></div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full md:w-auto">
              <div className="relative w-full md:w-auto">
                <ScrollArea className="w-full">
                  <div className="flex space-x-2 min-w-max">
                    {[
                      "all",
                      "beverage",
                      "coffee",
                      "snacks",
                      "breakfast",
                      "personal_Care",
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
                          : category === "personal_Care"
                            ? "Personal Care"
                            : category.charAt(0).toUpperCase() + category.slice(1)}
                      </Button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>

              <Button
                onClick={() => setShowAddProduct(true)}
                className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 w-full md:w-auto"
                title={"Add a new product"}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <TabsContent value="products" className="mt-6">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.reverse().map((product) => (
                  <motion.div
                    key={product.id}
                    className="group"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200 h-full rounded-3xl">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <Image
                          src={product.imageSrc || "/placeholder.svg?height=200&width=200"}
                          alt={product.name}
                          // Duck Tape For Now
                          {...(product.brand === "Black Rifle Coffee" ||
                          product.brand === "Alani Nu" ||
                          product.brand === "Kin Euphorics"
                            ? {
                                width: 100,
                                height: 100,
                              }
                            : {
                                width: 160,
                                height: 160,
                              })}
                          className={`object-contain group-hover:scale-110 transition-transform duration-300 z-10 ${
                            product.brand === "Black Rifle Coffee" ||
                            product.brand === "Alani Nu" ||
                            product.brand === "Kin Euphorics"
                              ? "object-cover"
                              : "object-contain"
                          }`}
                        />
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 rounded-full bg-white/80 hover:bg-white shadow-md"
                            onClick={() => setEditingProduct(product)}
                            title={user ? "Edit product" : "View product details (login to edit)"}
                          >
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
                              className="text-blue-600"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </Button>
                        </div>
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
                              {product.brand === "Drink BRĒZ" || product.brand === "Kin Euphorics"
                                ? "Non-Alcoholic"
                                : product.category}
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
                            onClick={() => setProductToDelete(product)}
                            disabled={!user || (product.uploaderId && user && product.uploaderId !== user.uid)}
                            title={
                              !user
                                ? "Login to delete products"
                                : product.uploaderId && product.uploaderId !== user.uid
                                  ? "Only the uploader can delete this product"
                                  : "Delete product"
                            }
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
              <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="bg-blue-50 inline-flex p-4 rounded-full mb-4">
                  <ImageIcon className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-bold mb-2">No products found</h3>
                <p className="text-gray-500 mb-6 max-w-md mx-auto">
                  {searchQuery || categoryFilter !== "all"
                    ? "No products match your search criteria."
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
                  {/* <Button
                    onClick={() => {
                      setSearchQuery("")
                      setCategoryFilter("all")
                      setShowAddProduct(true)
                    }}
                    className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </Button> */}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Login Prompt Dialog */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 border-b">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">
                {isLogin ? "Login to Your Account" : "Create an Account"}
              </DialogTitle>
              <DialogDescription className="text-center">
                {isLogin
                  ? accountType === "cpg"
                    ? "Sign in as brand to manage your products and SKU pre-data"
                    : "Sign in to manage products and pre-data"
                  : accountType === "cpg"
                    ? "Join to start uploading your brand's products"
                    : "Join to start uploading products of the brand you associate with"}
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 relative">
            <div className="mb-6 flex justify-center">
              <div className="bg-gray-100 p-1 rounded-full flex items-center shadow-md">
                <Button
                  type="button"
                  variant={accountType === "cpg" ? "default" : "ghost"}
                  className={`rounded-full px-6 py-5 text-sm flex items-center gap-2 ${accountType === "cpg" ? "bg-blue-600 text-white" : "text-gray-600"}`}
                  onClick={() => setAccountType("cpg")}
                >
                  <Building2 className="h-4 w-4" />
                  CPG Brand
                </Button>
                <Button
                  type="button"
                  variant={accountType === "guest" ? "default" : "ghost"}
                  className={`rounded-full px-6 py-5 text-sm flex items-center gap-2 ${accountType === "guest" ? "bg-blue-600 text-white" : "text-gray-600"}`}
                  onClick={() => setAccountType("guest")}
                >
                  <UserCircle2 className="h-4 w-4" />
                  Guest Uploader
                </Button>
              </div>
            </div>

            <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-4">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required={!isLogin}
                      className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm h-12 text-base"
                    />
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm h-12 text-base"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm h-12 text-base"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>
              )}

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-md h-12 text-base"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                  </div>
                ) : isLogin ? (
                  "Sign In"
                ) : (
                  "Create Account"
                )}
              </Button>

              <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-sm px-1"
                  >
                    {isLogin ? "Create one" : "Sign in"}
                  </button>
                </p>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={showAddProduct} onOpenChange={setShowAddProduct}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden rounded-xl">
          <ScrollArea className="max-h-[90vh]">
            <div className="p-6">
              <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl">Add New Product</DialogTitle>
                <DialogDescription>
                  {user ? "Fill in the details below to add a new product." : "Please log in to add a new product."}
                </DialogDescription>
                {!user && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                    <div className="flex items-center gap-2">
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
                        className="text-amber-500"
                      >
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                        <line x1="12" y1="9" x2="12" y2="13"></line>
                        <line x1="12" y1="17" x2="12.01" y2="17"></line>
                      </svg>
                      <span>You are in view-only mode. Please log in to add or edit products.</span>
                    </div>
                  </div>
                )}
              </DialogHeader>

              <Accordion type="single" collapsible defaultValue="product-details">
                <AccordionItem value="product-details" className="border-none">
                  <AccordionTrigger className="py-4 px-6 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    <div className="flex items-center gap-3 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <Package className="h-5 w-5 text-blue-600" />
                        <span className="font-semibold text-blue-800">Product Details</span>
                      </div>
                      {newProduct.imageSrc &&
                        newProduct.name &&
                        newProduct.brand &&
                        newProduct.category &&
                        newProduct.price &&
                        newProduct.priceUnit &&
                        newProduct.gtin &&
                        newProduct.weight && (
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
                                  onClick={() => user && setNewProduct({ ...newProduct, imageSrc: "" })}
                                  className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none inline-flex items-center justify-center"
                                  disabled={!user}
                                >
                                  <X className="h-4 w-4 text-white" />
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => user && productImageInputRef.current?.click()}
                                className="w-full h-full rounded-full flex items-center justify-center transition-colors duration-200"
                                disabled={!user}
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
                                  className={!user ? "text-gray-300" : "text-gray-600"}
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
                            disabled={uploadingImage || !user}
                          />
                          {!newProduct.imageSrc && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => user && productImageInputRef.current?.click()}
                              disabled={uploadingImage || !user}
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
                              onChange={(e) => user && setNewProduct({ ...newProduct, name: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                              disabled={!user}
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
                              onChange={(e) => user && setNewProduct({ ...newProduct, brand: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                              disabled={!user}
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
                            value={
                              newProduct.category === "Personal Care"
                                ? "personal_Care"
                                : newProduct.category.toLowerCase()
                            }
                            onValueChange={(value) => {
                              if (user) {
                                // Handle special case for personal_Care
                                if (value === "personal_Care") {
                                  setNewProduct({ ...newProduct, category: "Personal Care" })
                                } else {
                                  // Capitalize the first letter of the category
                                  const capitalizedValue = value.charAt(0).toUpperCase() + value.slice(1)
                                  setNewProduct({ ...newProduct, category: capitalizedValue })
                                }
                              }
                            }}
                            disabled={!user}
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
                                {/* Display the formatted category name */}
                                <SelectValue placeholder="Select category" className="capitalize" />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beverage">Beverage</SelectItem>
                              <SelectItem value="coffee">Coffee</SelectItem>
                              <SelectItem value="snacks">Snacks</SelectItem>
                              <SelectItem value="breakfast">Breakfast</SelectItem>
                              <SelectItem value="personal_Care">Personal Care</SelectItem>
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
                                value={newProduct.price}
                                onChange={(e) => {
                                  if (user) {
                                    // Remove any existing $ symbol and only allow numbers and decimal point
                                    const value = e.target.value.replace(/^\$/, "").replace(/[^\d.]/g, "")
                                    setNewProduct({ ...newProduct, price: value ? `$${value}` : "" })
                                  }
                                }}
                                className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                disabled={!user}
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
                                onChange={(e) => user && setNewProduct({ ...newProduct, priceUnit: e.target.value })}
                                className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                disabled={!user}
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
                              onChange={(e) => user && setNewProduct({ ...newProduct, weight: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                              disabled={!user}
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
                              onChange={(e) => user && setNewProduct({ ...newProduct, gtin: e.target.value })}
                              className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                              disabled={!user}
                            />
                            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                          </div>
                        </div>
                      </div>

                      {/* Add Product Description field */}
                      <div>
                        <Label htmlFor="product-description" className="text-gray-700">
                          Product Description
                        </Label>
                        <div className="mt-1 relative">
                          <Textarea
                            id="product-description"
                            placeholder="Enter product description"
                            value={newProduct.description}
                            onChange={(e) => user && setNewProduct({ ...newProduct, description: e.target.value })}
                            className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base min-h-[120px]"
                            disabled={!user}
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
                      {user &&
                        newProduct.imageSrc &&
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
                                // Update the addSimilarProduct function to pre-fill the similar product with the main product's price
                                // Find where you set the mainAsSimilar object and add the price field:
                                const mainAsSimilar: SimilarProduct = {
                                  id: uuidv4(),
                                  name: newProduct.name,
                                  description: newProduct.description || `Original ${newProduct.name}`,
                                  imageUrl: newProduct.imageSrc,
                                  weight: newProduct.weight,
                                  gtin: newProduct.gtin,
                                  brand: newProduct.brand, // Explicitly add the brand name from the main product
                                  mainProductId: newProduct.id, // Add the main product ID reference to itself
                                  price: newProduct.price, // Add the price from the main product
                                }

                                // Update the mainProductId state with the current product ID
                                setMainProductId(newProduct.id)

                                setNewProduct({
                                  ...newProduct,
                                  similarProducts: [mainAsSimilar, ...newProduct.similarProducts],
                                })

                                // Update the pre-fill logic for newSimilarProduct to include price
                                setNewSimilarProduct({
                                  ...newSimilarProduct,
                                  weight: newProduct.weight || "",
                                  brand: newProduct.brand || "",
                                  mainProductId: newProduct.id, // Add the main product ID reference
                                  price: newProduct.price || "", // Pre-fill with the main product's price
                                })

                                // Reset weight edit mode
                                setWeightEditMode(false)

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
                              disabled={!user}
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
                                      onClick={() =>
                                        user && setNewSimilarProduct({ ...newSimilarProduct, imageUrl: "" })
                                      }
                                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none inline-flex items-center justify-center"
                                      disabled={!user}
                                    >
                                      <X className="h-4 w-4 text-white" />
                                    </button>
                                  </>
                                ) : (
                                  <button
                                    onClick={() => user && similarProductImageInputRef.current?.click()}
                                    className="w-full h-full rounded-full flex items-center justify-center transition-colors duration-200"
                                    disabled={!user}
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
                                      className={!user ? "text-gray-300" : "text-gray-600"}
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
                                disabled={uploadingImage || !user}
                              />
                              {!newSimilarProduct.imageUrl && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => user && similarProductImageInputRef.current?.click()}
                                  disabled={uploadingImage || !user}
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
                                  onChange={(e) =>
                                    user && setNewSimilarProduct({ ...newSimilarProduct, name: e.target.value })
                                  }
                                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                  disabled={!user}
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
                                    user && setNewSimilarProduct({ ...newSimilarProduct, description: e.target.value })
                                  }
                                  className="rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-base"
                                  rows={2}
                                  disabled={!user}
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
                                      user &&
                                      weightEditMode &&
                                      setNewSimilarProduct({ ...newSimilarProduct, weight: e.target.value })
                                    }
                                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                    disabled={!user || !weightEditMode}
                                  />
                                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  {user && newSimilarProduct.weight && (
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
                                <div className="mb-1"></div>
                                <div className="relative flex items-center">
                                  <Input
                                    id="similar-price"
                                    placeholder="e.g. 12.99"
                                    value={newSimilarProduct.price}
                                    onChange={(e) =>
                                      user &&
                                      priceEditMode &&
                                      setNewSimilarProduct({ ...newSimilarProduct, price: e.target.value })
                                    }
                                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                    disabled={!user || !priceEditMode}
                                  />
                                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                  {user && newSimilarProduct.price && (
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 h-8 w-8 p-0 rounded-full"
                                      onClick={() => setPriceEditMode(!priceEditMode)}
                                    >
                                      {priceEditMode ? (
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
                                    onChange={(e) =>
                                      user && setNewSimilarProduct({ ...newSimilarProduct, gtin: e.target.value })
                                    }
                                    className="pl-10 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-12 text-base"
                                    disabled={!user}
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
                              disabled={!user}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Similar Product
                            </Button>
                          </div>
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
                                    {product.brand && <span className="text-purple-500">Brand: {product.brand}</span>}
                                    {product.weight && <span className="text-blue-500">Weight: {product.weight}</span>}
                                    {product.price && <span className="text-green-500">Price: {product.price}</span>}
                                    {product.gtin && <span className="text-green-500">GTIN: {product.gtin}</span>}
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 rounded-full text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => user && removeSimilarProduct(product.id)}
                                  disabled={!user}
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
                                {newInfluencer.image ? (
                                  <>
                                    <Image
                                      src={newInfluencer.image || "/placeholder.svg"}
                                      alt="Influencer"
                                      fill
                                      className="object-cover"
                                    />
                                    <button
                                      onClick={() => user && setNewInfluencer({ ...newInfluencer, image: "" })}
                                      className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none inline-flex items-center justify-center"
                                      disabled={!user}
                                    >
                                      <X className="h-4 w-4 text-white" />
                                    </button>
                                  </>
                                ) : (
                                  <User className={`h-24 w-24 ${!user ? "text-gray-200" : "text-gray-300"}`} />
                                )}
                              </div>
                              <input
                                type="file"
                                className="hidden"
                                ref={influencerImageInputRef}
                                accept="image/*"
                                onChange={handleInfluencerImageUpload}
                                disabled={uploadingImage || !user}
                              />
                              {newInfluencer.image ? (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => user && influencerImageInputRef.current?.click()}
                                  disabled={uploadingImage || !user}
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
                                  onClick={() => user && influencerImageInputRef.current?.click()}
                                  disabled={uploadingImage || !user}
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
                                      value={newInfluencer.name}
                                      onChange={(e) =>
                                        user && setNewInfluencer({ ...newInfluencer, name: e.target.value })
                                      }
                                      className="pl-10 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                                      disabled={!user}
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
                                    value={newInfluencer.bio}
                                    onChange={(e) =>
                                      user && setNewInfluencer({ ...newInfluencer, bio: e.target.value })
                                    }
                                    rows={3}
                                    className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 text-base"
                                    disabled={!user}
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
                                <Select
                                  value={newSocialAccount.icon}
                                  onValueChange={handleSocialPlatformChange}
                                  disabled={!user}
                                >
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
                                  onChange={(e) =>
                                    user && setNewSocialAccount({ ...newSocialAccount, username: e.target.value })
                                  }
                                  className="rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500 h-12 text-base"
                                  disabled={!user}
                                />
                              </div>
                            </div>
                            <div className="w-full flex justify-center mt-1">
                              <Button
                                type="button"
                                onClick={addSocialAccount}
                                className="w-2/3 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                                disabled={!user}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Social Account
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <div className="mt-4">
                          <h4 className="text-sm font-medium mb-2 text-gray-700">Added Accounts</h4>
                          {newInfluencer.socialAccounts.length > 0 ? (
                            <div className="space-y-3">
                              {newInfluencer.socialAccounts.map((account, index) => (
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
                                    onClick={() => user && removeSocialAccount(account.id || index.toString())}
                                    disabled={!user}
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
                  {user ? "Cancel" : "Close"}
                </Button>
                {user ? (
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
                ) : (
                  <Button
                    onClick={() => {
                      setShowAddProduct(false)
                      setShowLoginPrompt(true)
                    }}
                    className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Login
                  </Button>
                )}
              </DialogFooter>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      {editingProduct && (
        <EditProductDialog
          product={editingProduct}
          open={!!editingProduct}
          onOpenChange={(open) => {
            if (!open) setEditingProduct(null)
          }}
          onProductUpdated={fetchProducts}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!productToDelete} onOpenChange={(open) => !open && setProductToDelete(null)}>
        <DialogContent className="sm:max-w-[425px] rounded-lg">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
           <div className="mb-4"></div>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setProductToDelete(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => productToDelete && deleteProduct(productToDelete.id)}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}
