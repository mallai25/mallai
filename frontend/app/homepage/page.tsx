"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig"
// Update the imports to include the necessary Firebase functions
import { doc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore"
import { updateProfile } from "firebase/auth"
import axios from "axios"
import {
  User,
  LogOut,
  Home,
  Gift,
  BarChart,
  MessageSquare,
  Settings,
  MapPin,
  Mail,
  Upload,
  Check,
  Clock,
  ChevronRight,
  Users,
  QrCode,
} from "lucide-react"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Eye } from "lucide-react"

import LogoImage from "../login/Images/download.png"

import { InfluencerDialog } from "../join/Components/InfluencerDialog"
import { ProductDetailDialog } from "../join/Components/ProductDetailDialog"

// Add import for the live mock data at the top of the file
import {
  productData,
  rewardsCampaigns,
  pollsParticipation,
  RewardThen,
  subscribedBrands,
  influencers,
} from "../join/mockdata"
import { rewardsCampaignsLive, pollsParticipationLive, subscribedBrandsLive } from "../join/mock-data-live"

import { HomeIcon } from "lucide-react" // rename to avoid conflict
import { Calendar } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Remove the direct import and use a string path instead

interface Stamp {
  stamped: boolean
}

interface PurchaseHistory {
  product: string
  date: string
}

interface Participant {
  id: string
  name: string
  email: string
  location: string
  joinDate: string
  avatar?: string
  purchaseHistory?: PurchaseHistory[]
  stamps?: Stamp[]
}

export default function HomePage() {
  const router = useRouter()
   // Create refs for product carousels
  const carouselRefs = useRef({})

  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [userName, setUserName] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [userAddress, setUserAddress] = useState("")
  const [userLocation, setUserLocation] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [subscribedBrandsList, setSubscribedBrandsList] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState("Prelims")
  // Add state for the data mode toggle
  const [dataMode, setDataMode] = useState<"demo" | "live">("demo")

  const [showProductDialog, setShowProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showCampaignDialog, setShowCampaignDialog] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null)
  const [currentProductPage, setCurrentProductPage] = useState(0)
  const PRODUCTS_PER_PAGE = 3
  const [showInfluencerDialog, setShowInfluencerDialog] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null)
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("")
  const [expandedFeatures, setExpandedFeatures] = useState(false)
  const [activeSimilarProduct, setActiveSimilarProduct] = useState(null)
  const [hoveredSimilarProduct, setHoveredSimilarProduct] = useState(null)
  
  // Add state for Firebase products
  const [firebaseProducts, setFirebaseProducts] = useState<any[]>([])
  const [firebaseInfluencers, setFirebaseInfluencers] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)

  // Update the useEffect to fetch products from Firebase
  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        // Fetch products from Firebase
        const productsCollection = collection(FIREBASE_DB, "listingsMade")
        const productsSnapshot = await getDocs(productsCollection)
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Fetch influencers from Firebase
        const influencersCollection = collection(FIREBASE_DB, "influencers")
        const influencersSnapshot = await getDocs(influencersCollection)
        const influencersList = influencersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        // Set the state with Firebase data
        setFirebaseProducts(productsList)
        setFirebaseInfluencers(influencersList)
      } catch (error) {
        console.error("Error fetching Firebase data:", error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchFirebaseData()
  }, [])

  // Update the useEffect for user authentication to not fetch products
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user)
        setUserEmail(user.email || "")
        setUserName(user.displayName || "")

        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid))
          if (userDoc.exists()) {
            const userData = userDoc.data()
            setUserAddress(userData.address || "")
            setUserLocation(userData.location || "")
            setProfileImage(userData.profileImage || null)
            setAge(userData.age || "")
            setGender(userData.gender || "")
          }

          // Set mock subscribed brands based on data mode
          setSubscribedBrandsList(dataMode === "demo" ? subscribedBrands : subscribedBrandsLive)
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      } else {
        // Instead of redirecting, set default guest values
        setUser(null)
        setUserName("Guest")
        setSubscribedBrandsList([])
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [router, dataMode])

  const handleSimilarProductClick = (product, similarProduct) => {
    // Set the active similar product when clicked
    setActiveSimilarProduct(similarProduct)
    setSelectedProduct({
      ...product,
      ...similarProduct,
      brand: product.brand,
      category: product.category,
      priceUnit: product.priceUnit,
    })
    setShowProductDialog(true)
  }

  // Updated profile image upload function using axios
  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append("image", file)

      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData)

      if (response.data.success) {
        const downloadUrl = response.data.data.secure_url

        // Update the user profile
        await updateProfile(user, { photoURL: downloadUrl })

        // Update Firestore document
        await updateDoc(doc(FIREBASE_DB, "users", user.uid), {
          profileImage: downloadUrl,
        })

        // Update state
        setProfileImage(downloadUrl)
      }
    } catch (error) {
      console.error("Error uploading profile image:", error)

      // Remove the fallback to Firebase Storage since we're matching the provided code
    } finally {
      setUploadingImage(false)
    }
  }

  const handleUpdateProfile = async () => {
    if (!user) return

    try {
      // Update displayName in Firebase Auth
      await updateProfile(user, { displayName: userName })

      // Update user document in Firestore
      await updateDoc(doc(FIREBASE_DB, "users", user.uid), {
        displayName: userName,
        address: userAddress,
        location: userLocation,
        age: age,
        gender: gender,
        updatedAt: new Date(),
      })

      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile. Please try again.")
    }
  }

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut()
      router.push("/join")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  const handleProductQRClick = (product: any) => {
    setSelectedProduct(product)
    setShowProductDialog(true)
  }

  // Update the handleCampaignClick function to use the correct data based on mode
  const handleCampaignClick = (campaign: any) => {
    setSelectedCampaign(campaign)
    setSelectedParticipant(RewardThen[0]) // For demo, select first participant
    setShowCampaignDialog(true)
  }

  // Update the handleInfluencerClick function to use Firebase influencers
  const handleInfluencerClick = (influencer: any) => {
    // Find the matching influencer from the Firebase influencers array
    const matchingInfluencer =
      firebaseInfluencers.find((inf) => inf.id === influencer.id) || influencers.find((inf) => inf.id === influencer.id)
    setSelectedInfluencer(matchingInfluencer || influencer)
    setShowInfluencerDialog(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <>
            {/* Welcome Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName || "User"}!</h1>
                <p className="text-gray-600 mt-1">Track your rewards campaigns and poll participation.</p>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm relative">
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <User className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Rewards Campaigns Section */}
            <Card className="mb-6 overflow-hidden border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-lg shadow-md">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Rewards Campaigns
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-blue-100 transition-all group"
                  onClick={() => {
                    setActiveTab("polls")
                    window.scrollTo(0, 0)
                  }}
                >
                  Next
                  <ChevronRight className="ml-1 w-5 h-5 text-blue-600 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {(dataMode === "demo" ? rewardsCampaigns : rewardsCampaignsLive).length > 0 ? (
                  <div className="space-y-6">
                    {(dataMode === "demo" ? rewardsCampaigns : rewardsCampaignsLive).map((campaign) => (
                      <motion.div
                        key={campaign.id}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="group"
                      >
                        <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100 group-hover:border-blue-200">
                          <div className="flex flex-col sm:flex-row p-0">
                            {/* Left - Image */}
                            <div className="w-full sm:w-64 h-48 relative flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none overflow-hidden">
                              <div className="absolute inset-0 bg-black/10 z-10"></div>
                              <Image
                                src={
                                  campaign.brand === "JoyRide Candy Co."
                                    ? "/joy.jpeg"
                                    : campaign.brand === "Prime Hydration"
                                      ? "/prof.jpeg"
                                      : "/logo.png"
                                }
                                alt={campaign.name}
                                width={200}
                                height={160}
                                className="object-contain absolute inset-0 m-auto z-20"
                              />
                              <div className="absolute bottom-3 left-3 z-30">
                                <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm shadow-md px-3 py-1.5 rounded-full">
                                  <div className="relative w-5 h-5 rounded-full overflow-hidden">
                                    <Image
                                      src={
                                        campaign.brand === "JoyRide Candy Co."
                                          ? "/joy.jpeg"
                                          : campaign.brand === "Prime Hydration"
                                            ? "/prof.jpeg"
                                            : "/logo.png"
                                      }
                                      alt={campaign.brand}
                                      fill
                                      className="object-cover"
                                      sizes="20px"
                                    />
                                  </div>
                                  <span className="text-xs font-medium text-gray-800">{campaign.brand}</span>
                                </div>
                              </div>
                            </div>

                            {/* Right - Details */}
                            <div className="p-5 sm:p-6 flex-1 relative">
                              {/* View Details Button - Top Right */}
                              <Button
                                size="sm"
                                className="absolute top-4 right-4 text-xs h-9 bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all rounded-full px-4"
                                onClick={() => handleCampaignClick(campaign)}
                              >
                                View Details
                              </Button>

                              {/* Campaign Name and Prize */}
                              <h3 className="font-bold text-xl mb-2 pr-28">{campaign.name}</h3>
                              <p className="text-sm text-gray-600 mb-4">{campaign.prize}</p>

                              {/* Progress Section */}
                              <div className="max-w-md">
                                <div className="flex justify-between mb-2">
                                  <span className="text-sm font-medium">
                                    {campaign.uploadedReceipts} of {campaign.totalRequired} collected
                                  </span>
                                  <span className="text-sm font-medium text-blue-600">
                                    {Math.round((campaign.uploadedReceipts / campaign.totalRequired) * 100)}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-blue-400 to-blue-600 relative"
                                    style={{ width: `${(campaign.uploadedReceipts / campaign.totalRequired) * 100}%` }}
                                  >
                                    <div className="absolute inset-0 bg-white/20 overflow-hidden flex">
                                      <div className="w-2 h-full bg-white/40 skew-x-[20deg] animate-[shimmer_2s_infinite]"></div>
                                    </div>
                                  </div>
                                </div>

                                {/* End Date */}
                                <div className="flex items-center gap-1 text-xs text-gray-500 mt-4">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>Ends {campaign.endDate}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 inline-flex p-4 rounded-full mb-6 shadow-lg">
                      <Gift className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No active reward campaigns</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Join brand campaigns to start earning rewards and exclusive offers
                    </p>
                    <Button
                      onClick={() => setActiveTab("brands")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                    >
                      Discover Campaigns
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Campaign Details Dialog */}
            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogContent className="w-[95vw] max-w-[1000px] p-2 rounded-xl">
                {selectedCampaign && (
                  <ScrollArea className="bg-white w-full h-[80vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] rounded-md">
                    <div className="p-4">
                      <div className="w-full">
                        {/* Add brand header with toggle buttons */}
                        <div className="mb-6 flex items-center justify-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-blue-500 to-indigo-600 p-0.5">
                              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                <Image
                                  src={
                                    selectedCampaign.brand === "JoyRide Candy Co."
                                      ? "/"
                                      : selectedCampaign.brand === "Prime Hydration"
                                        ? "/"
                                        : "/"
                                  }
                                  alt={selectedCampaign.brand}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.brand}</h2>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row w-full gap-6">
                          <div className="space-y-8 w-full md:w-3/6">
                            {/* Purchase Journey */}
                            <Card className="bg-white p-4 flex flex-col shadow-md border-0">
                              <div className="mb-3 flex items-center justify-between w-full">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">Purchase Journey</h3>
                                  <p className="text-xs text-gray-500">Path to {selectedCampaign.prize}</p>
                                </div>
                                <div className="bg-blue-100 p-2 rounded-lg">
                                  <Gift className="w-5 h-5 text-blue-600 flex-shrink-0" />
                                </div>
                              </div>

                              <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-blue-100" />
                                {selectedCampaign.purchaseHistory?.map((purchase: any, i: number) => (
                                  <div key={i} className="relative flex items-start mb-4 last:mb-0">
                                    <div className="absolute left-4 top-2.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                                    <div className="ml-8 flex-1">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">{purchase.product}</span>
                                        <span className="text-sm font-medium text-blue-600 ml-2">
                                          {purchase.amount}
                                        </span>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <p className="mt-1 text-xs text-gray-500">{purchase.date}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </Card>

                            {/* Stamps Progress */}
                            <div className="bg-white p-5 rounded-xl shadow-md">
                              <div className="flex items-center justify-between mb-4">
                                <h4 className="font-medium">Stamps Progress</h4>
                                <div className="bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full font-medium">
                                  {selectedCampaign.uploadedReceipts}/{selectedCampaign.totalRequired} Stamps
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="grid grid-cols-6 gap-2">
                                  {Array.from({ length: selectedCampaign.totalRequired }).map((_, i) => (
                                    <div key={i} className="aspect-square relative">
                                      {i < selectedCampaign.uploadedReceipts ? (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                                          <Check className="text-white w-5 h-5" />
                                        </div>
                                      ) : (
                                        <div className="w-full h-full rounded-lg border-2 border-dashed border-blue-200 flex items-center justify-center hover:bg-blue-50 transition-colors">
                                          <span className="text-blue-300 text-xs font-medium">{i + 1}</span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-6 w-full md:w-3/6">
                            {/* Recent Receipts */}
                            <div className="mt-0">
                              <h4 className="font-medium mb-3">Recent Receipts</h4>
                              <ScrollArea className="h-[290px] pr-4">
                                <div className="space-y-4">
                                  {selectedCampaign.receipts?.map((receipt: any, index: number) => (
                                    <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all">
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-medium">Receipt #{receipt.id}</p>
                                            <div className="flex items-center justify-between">
                                              <p className="text-xs text-gray-400">{receipt.date}</p>
                                            </div>
                                            <p className="text-xs text-gray-500">{receipt.store}</p>
                                          </div>
                                          <Button variant="outline" size="sm" className="rounded-full">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View Receipt
                                          </Button>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ))}
                                </div>
                                <ScrollBar />
                              </ScrollArea>
                            </div>

                            {/* Upload Receipt Button */}
                            <div className="mt-6 w-full flex justify-center">
                              <label className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-6 cursor-pointer hover:bg-blue-50 transition-colors flex flex-col items-center justify-center">
                                <div className="bg-blue-100 p-3 rounded-full mb-3">
                                  <Upload className="w-6 h-6 text-blue-600" />
                                </div>
                                <span className="text-sm font-medium text-blue-600">Upload New Receipt</span>
                                <span className="text-xs text-gray-500 mt-1">Click or drag receipt image here</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                      // Handle the file upload here
                                      console.log("Receipt file:", file)
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <ScrollBar orientation="vertical" className="bg-gray-100 w-2" />
                  </ScrollArea>
                )}
              </DialogContent>
            </Dialog>
          </>
        )

      // Replace the polls section in the renderTabContent function with this enhanced version
      case "polls":
        return (
          <>
            {/* Welcome Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName || "User"}!</h1>
                <p className="text-gray-600 mt-1">Track your rewards campaigns and poll participation.</p>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm relative">
                {profileImage ? (
                  <img src={profileImage || "/placeholder.svg"} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <User className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Polls Section */}
            <Card className="mb-6 overflow-hidden border-0 shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between pb-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20">
                <div className="flex items-center space-x-2">
                  <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2 rounded-lg shadow-md">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600">
                    Polls Participation
                  </CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-emerald-100 transition-all group"
                  onClick={() => {
                    setActiveTab("dashboard")
                    window.scrollTo(0, 0)
                  }}
                >
                  <ChevronRight className="mr-1 w-5 h-5 text-emerald-600 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                  Back
                </Button>
              </CardHeader>
              <CardContent className="p-6">
                {(dataMode === "demo" ? pollsParticipation : pollsParticipationLive).length > 0 ? (
                  <div className="space-y-4">
                    {(dataMode === "demo" ? pollsParticipation : pollsParticipationLive).map((poll) => (
                      <motion.div
                        key={poll.id}
                        whileHover={{ y: -5 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        className="group"
                      >
                        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-4 flex justify-between items-center group-hover:border-emerald-200">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600 p-0.5 flex-shrink-0">
                              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                                <Image
                                  src={poll.logo || poll.image || "/placeholder.svg?height=48&width=48"}
                                  alt={poll.brand}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">{poll.title}</h3>
                              <p className="text-sm text-gray-600">{poll.brand}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {poll.date}
                                {poll.reward && (
                                  <span className="ml-3 bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                    {poll.reward}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center">
                            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center mr-3">
                              <Check className="w-3 h-3 mr-1" />
                              Completed
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="rounded-full hover:bg-emerald-50 transition-all"
                            >
                              <ChevronRight className="w-5 h-5 text-emerald-600" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 px-4">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 inline-flex p-4 rounded-full mb-6 shadow-lg">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No polls participation yet</h3>
                    <p className="text-gray-500 mb-6 max-w-md mx-auto">
                      Participate in brand polls to share your opinion and earn rewards
                    </p>
                    <Button
                      onClick={() => setActiveTab("brands")}
                      className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all"
                    >
                      Find Polls
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )

      // Update the brands tab to use Firebase products
      case "brands":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Discover Brands</h1>
              <p className="text-gray-600 mt-1">Find more consumer packaged goods brands and their campaigns.</p>
            </div>

            {/* Categories Section */}
            <div className="w-full bg-white rounded-xl shadow-sm p-4 border border-gray-100">
              <ScrollArea className="w-full whitespace-nowrap pb-2">
                <div className="flex space-x-4 p-1">
                  {[
                    "Prelims",
                    "Beverage",
                    "Coffee",
                    "Snacks",
                    "Breakfast",
                    "Personal Care",
                    "Alcohol",
                    "Supplements",
                  ].map((category) => (
                    <motion.div key={category} className="flex-none first:ml-0" whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={category === selectedCategory ? "default" : "ghost"}
                        className={`whitespace-nowrap rounded-full px-4 sm:px-5 text-sm sm:text-base h-9 sm:h-10 ${
                          category === selectedCategory
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md"
                            : "hover:bg-gray-100 text-gray-800 border-gray-200"
                        } transition-all duration-200`}
                        onClick={() => {
                          setSelectedCategory(category)
                          setCurrentProductPage(0)
                        }}
                      >
                        {category}
                      </Button>
                    </motion.div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            {/* Loading State */}
            {loadingProducts ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                {/* Product Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(firebaseProducts.length > 0 ? firebaseProducts : productData)
                    .sort((a, b) => {
                      // Convert ids to strings and compare them
                      const idA = String(a.id);
                      const idB = String(b.id);
                      return idB.localeCompare(idA);
                    })
                    .filter((product) => {
                      if (selectedCategory === "Prelims") return true
                      // Handle the renamed category
                      if (selectedCategory === "Snacks" && product.category.toLowerCase() === "candy") return true
                      if (selectedCategory === "Snacks" && product.category.toLowerCase() === "snacks") return true
                      if (selectedCategory === "Breakfast" && product.category.toLowerCase() === "breakfast") return true
                      if (selectedCategory === "Personal Care" && 
                        (product.category.toLowerCase() === "personal Care" || 
                         product.category.toLowerCase() === "deodorant")) return true
                      return product.category.toLowerCase() === selectedCategory.toLowerCase()
                    })
                    .slice(currentProductPage * PRODUCTS_PER_PAGE, (currentProductPage + 1) * PRODUCTS_PER_PAGE)
                    .map((product) => (
                      <motion.div
                        key={product.id}
                        className="group w-full"
                        whileHover={{ y: -8 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full border border-gray-100 group-hover:border-blue-200">
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <Image
                              src={product.imageSrc || product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              width={160}
                              height={160}
                              className="object-contain cursor-pointer group-hover:scale-110 transition-transform duration-300 z-10"
                            />
                            {product.influencer && (
                              <button
                                onClick={() => handleInfluencerClick(product.influencer)}
                                className="absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 shadow-md z-20"
                              >
                                <Image
                                  src={product.influencer.image || product.influencer.imageUrl || "/placeholder.svg"}
                                  alt={product.influencer.name}
                                  width={48}
                                  height={48}
                                  className="object-cover"
                                />
                              </button>
                            )}
                          </div>
                          <div className="p-5">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-lg">{product.brand}</h3>
                                <p className="text-gray-600 text-sm">{product.category}</p>
                              </div>
                              <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                                <span className="text-lg font-bold text-blue-700">{product.price}</span>
                                <span className="text-xs text-blue-600 ml-1">
                                  /{product.priceUnit ||
                                    (product.brand === "ItsCalledW"
                                      ? "/stick"
                                      : product.brand === "Ketone-IQ"
                                        ? "/serving"
                                        : product.category === "Beverage"
                                          ? "/pack"
                                          : "/bag")}
                                </span>
                              </div>
                            </div>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="w-full mt-4 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all"
                                >
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="w-[95vw] max-w-[950px] p-0 rounded-lg">
                                <ScrollArea className="h-[84vh] p-4 rounded-md">
                                  <div className="mt-5 p-0 sm:p-1">
                                    <DialogHeader className="mb-4 sm:mb-6">
                                      <div className="sm:flex sm:items-center">
                                        <div className="sm:flex-auto">
                                          <DialogTitle className="text-lg sm:text-xl">
                                            {product.name} Overview
                                          </DialogTitle>
                                          <DialogDescription className="text-sm">
                                            Product details and variations
                                          </DialogDescription>
                                        </div>
                                        <div className="mt-4 sm:ml-16 sm:mt-0">
                                          <div className="bg-indigo-50 p-3 sm:p-3 rounded-full flex justify-between items-center border border-indigo-100">
                                            <h4 className="font-medium text-sm sm:text-base text-indigo-900 mr-8">
                                              Total
                                            </h4>
                                            <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full w-8 h-8">
                                              <p className="text-md sm:text-md font-bold text-indigo-700">
                                                {product.similarProducts?.length || 0}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </DialogHeader>

                                    <div className="space-y-3">
                                      <div className="border border-gray-100 min-h-96 rounded-3xl px-4 py-2 mb-2 w-full bg-white">
                                        <div className="relative space-y-2">
                                          <button className="absolute right-0 top-0 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-full transition-colors flex items-center space-x-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            <span className="text-xs font-medium text-green-700">Live</span>
                                          </button>
                                          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pl-2">
                                            <h4 className="text-lg font-semibold">{product.category}</h4>
                                            <span className="mt-1 sm:mt-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                              {product.price}
                                            </span>
                                          </div>
                                        </div>

                                        <div className="p-2 mt-2 relative min-h-44">
                                          <button
                                            className="absolute -left-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                                            onClick={() => {
                                              const container = document.getElementById(
                                                `product-carousel-${product.id}`,
                                              )
                                              if (container) container.scrollLeft -= container.offsetWidth / 2
                                            }}
                                          >
                                            <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
                                          </button>

                                          <div
                                            id={`product-carousel-${product.id}`}
                                            className="flex overflow-x-auto sm:overflow-x-hidden scroll-smooth px-0 sm:px-0 gap-3 sm:gap-6 snap-x snap-mandatory sm:snap-none pb-4 sm:pb-0 -mx-2 sm:mx-0"
                                            ref={(el) => {
                                              if (el) carouselRefs.current[product.id] = el
                                            }}
                                         >
                                            {product.similarProducts?.map((item: any) => (
                                              <div
                                                key={item.id}
                                                className="flex-none w-[80%] sm:w-1/3 snap-center first:ml-2 sm:first:ml-0"
                                              >
                                                <div className="border border-gray-100 rounded-xl p-3 hover:border-blue-200 transition-colors group/card"
                                                onClick={() => handleSimilarProductClick(product, item)}
                                                onMouseEnter={() => setHoveredSimilarProduct(item)}
                                                onMouseLeave={() => setHoveredSimilarProduct(null)}>
                                                  <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                                                    <div className="absolute inset-0 duration-300 z-10"></div>
                                                    {hoveredSimilarProduct === item && (
                                                    <div className="absolute top-1 left-1 z-20 bg-emerald-100 text-emerald-700 font-bold text-xs px-2 py-1 rounded-full">
                                                      {item.price || product.price}
                                                    </div>
                                                  )}
                                                    <Button
                                                      variant="ghost"
                                                      size="sm"
                                                      className="absolute top-1 right-1 z-20 h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 p-0 shadow-md border-2 border-white transition-all group"
                                                      onClick={() => handleProductQRClick(item)}
                                                    >
                                                      <QrCode className="h-5 w-5 text-white" />
                                                    </Button>
                                                    <div className="w-full h-full flex items-center justify-center">
                                                      <Image
                                                        src={item.imageUrl || "/placeholder.svg"}
                                                        alt={item.name}
                                                        width={200}
                                                        height={200}
                                                        className="object-contain transform scale-75 group-hover/card:scale-90 transition-transform duration-300 ease-in-out rounded-xl"
                                                      />
                                                    </div>
                                                  </div>
                                                  <div className="space-y-1">
                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                        {item.name}
                                                      </span>
                                                    </div>
                                                    <p className="text-xs text-gray-600">{item.description}</p>
                                                  </div>
                                                </div>
                                              </div>
                                            ))}
                                          </div>

                                          <button
                                                                                    className="absolute -right-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                                                                                    onClick={() => {
                                                                                      const container = carouselRefs.current[product.id]
                                                                                      if (container) container.scrollLeft += container.offsetWidth / 2
                                                                                    }}
                                                                                  >
                                                                                    <ChevronRight className="w-5 h-5 text-gray-700" />
                                                                                  </button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </ScrollArea>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                {Math.ceil(
                  (firebaseProducts.length > 0 ? firebaseProducts : productData).filter((product) => {
                    if (selectedCategory === "Prelims") return true
                    // Handle the renamed category
                    if (selectedCategory === "Snacks" && product.category.toLowerCase() === "candy") return true
                    if (selectedCategory === "Snacks" && product.category.toLowerCase() === "snacks") return true
                    if (selectedCategory === "Breakfast" && product.category.toLowerCase() === "breakfast") return true
                    return product.category.toLowerCase() === selectedCategory.toLowerCase()
                  }).length / PRODUCTS_PER_PAGE,
                ) > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    {Array.from({
                      length: Math.ceil(
                        (firebaseProducts.length > 0 ? firebaseProducts : productData).filter((product) => {
                          if (selectedCategory === "Prelims") return true
                          return product.category === selectedCategory
                        }).length / PRODUCTS_PER_PAGE,
                      ),
                    }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentProductPage(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          idx === currentProductPage
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 w-8"
                            : "bg-gray-300 hover:bg-blue-400"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )

      case "settings":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600 mt-1">Manage your profile and preferences.</p>
            </div>

            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input value={userEmail} disabled className="pl-10 rounded-[12px] bg-gray-50 py-6" />
                      </div>
                    </div>
                    <div>
                      <Label>Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <div className="relative mt-1">
                        <HomeIcon className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                        <Textarea
                          value={userAddress}
                          onChange={(e) => setUserAddress(e.target.value)}
                          className="w-full resize-none rounded-[12px] pl-10"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input
                          value={userLocation}
                          onChange={(e) => setUserLocation(e.target.value)}
                          placeholder="City, State"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-blue-600 rounded-2xl" onClick={handleUpdateProfile}>
                      Save Changes
                    </Button>
                  </div>

                  <div className="flex flex-col items-center justify-start space-y-6">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                        <AvatarImage src={profileImage || ""} alt="Profile" />
                        <AvatarFallback>
                          <User className="w-16 h-16 text-blue-300" />
                        </AvatarFallback>
                      </Avatar>

                      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md cursor-pointer transition-colors">
                        <Upload className="w-5 h-5" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-500">
                        {uploadingImage ? "Uploading..." : "Upload a profile picture"}
                      </p>
                    </div>

                    {/* Age and Gender inputs */}
                    <div className="w-full space-y-4">
                      <div>
                        <Label>Age</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="pl-10 rounded-[12px]"
                            placeholder="Enter your age"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <div className="relative mt-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full rounded-[12px] py-6 flex justify-between items-center pl-10 relative"
                              >
                                <Users className="absolute left-3 h-5 w-5 text-gray-400" />
                                <span className="text-left flex-1">{gender || "Select gender"}</span>
                                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                              <DropdownMenuItem onClick={() => setGender("male")}>Male</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setGender("female")}>Female</DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setGender("other")}>Other</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return null
    }
  }

  const renderHeader = () => (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link href="/">
            <div className="flex items-center gap-2">
              <Avatar className="w-9 h-9 rounded-xl">
                <AvatarImage src={LogoImage.src} alt="Logo" />
              </Avatar>
              <span className="text-xl font-semibold text-zinc-800">Mall AI</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <div className="bg-gray-100 p-1 rounded-full flex">
            <Button
              size="sm"
              variant={dataMode === "demo" ? "default" : "ghost"}
              className={`rounded-full px-3 text-xs h-7 ${dataMode === "demo" ? "bg-blue-600 text-white" : "text-gray-600"}`}
              onClick={() => setDataMode("demo")}
            >
              Demo
            </Button>
            <Button
              size="sm"
              variant={dataMode === "live" ? "default" : "ghost"}
              className={`rounded-full px-3 text-xs h-7 ${dataMode === "live" ? "bg-blue-600 text-white" : "text-gray-600"}`}
              onClick={() => setDataMode("live")}
            >
              Live
            </Button>
          </div>

          {user ? (
            <Button onClick={handleSignOut} variant="outline" className="flex items-center gap-2 rounded-full">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          ) : (
            <Button
              onClick={() => router.push("/join")}
              className="flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <User className="w-4 h-4" />
              <span>Login</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
  

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {renderHeader()}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24">
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Button
                      variant={activeTab === "dashboard" ? "default" : "ghost"}
                      className={`w-full justify-start rounded-2xl ${
                        activeTab === "dashboard" ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                      }`}
                      onClick={() => setActiveTab("dashboard")}
                    >
                      <Home className="w-4 h-4 mr-3" />
                      Dashboard
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "brands" ? "default" : "ghost"}
                      className={`w-full justify-start rounded-2xl ${
                        activeTab === "brands" ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                      }`}
                      onClick={() => setActiveTab("brands")}
                    >
                      <BarChart className="w-4 h-4 mr-3" />
                      Brands
                    </Button>
                  </li>
                  <li>
                    <Button
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className={`w-full justify-start rounded-2xl ${
                        activeTab === "settings" ? "bg-blue-600 text-white hover:bg-blue-700" : ""
                      }`}
                      onClick={() => setActiveTab("settings")}
                      disabled={!user}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Button>
                  </li>
                </ul>
              </nav>

              {/* Brands Subscribed Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium text-sm">Brands Subscribed</h3>
                </div>
                <div className="space-y-3">
                  {subscribedBrandsList.length > 0 ? (
                    subscribedBrandsList.map((brand) => (
                      <div key={brand.id} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={brand.logo} alt={brand.name} />
                          <AvatarFallback>{brand.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate">{brand.name}</p>
                          <p className="text-xs text-gray-500">{brand.campaigns} campaigns</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">No brands subscribed yet</p>
                      {!user && (
                        <Button
                          variant="link"
                          size="sm"
                          className="text-blue-600 p-0 h-auto mt-1"
                          onClick={() => router.push("/login")}
                        >
                          Login to subscribe
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">{renderTabContent()}</div>
        </div>
      </div>
      <InfluencerDialog
        influencer={selectedInfluencer}
        open={showInfluencerDialog}
        onOpenChange={setShowInfluencerDialog}
      />
      <ProductDetailDialog product={selectedProduct} open={showProductDialog} onOpenChange={setShowProductDialog} />
    </div>
  )
}

