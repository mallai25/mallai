'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion";
import { PenIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"

import { 
  Users, 
  Settings, 
  Plus,
  LogOut, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Upload, 
  BarChart, 
  Home, 
  Tag, 
  Maximize2, 
  X, 
  Eye, 
  Pencil,
  Menu, 
  ChevronDown, 
  RefreshCw, 
  Download,
  History,
  Package,
  Video,
  Award,
  Gift,
  Star,
  Zap, Coffee, Rocket, Search, Share2, Check, ImageIcon, Sparkles
} from "lucide-react"
import Image from "next/image"

import React from "react"
import { QRCodeSVG } from 'qrcode.react'
import { SocialConnect } from "./social-connect"
import { ComparisonComponent } from "./comparisonPolls"
import { AnalyticsTab } from "../PageContents/AnalyticsTab"
import { ActivityTab } from '../PageContents/ActivityTab'
import { SettingsTab } from '../PageContents/SettingsTab'
import { SimpleListing } from '../DashComps/SimpleListing';

import { InfoContent } from '../CardArea/InfoContent';
import { InfoContentTrue } from '../CardArea/InfoContentTrue';
import CatalogFalse from '../CardArea/CatalogFalse';
import CatalogTrue from '../CardArea/CatalogTrue';
import NutritionFactsModal from "../Modals/NutritionFacts"

import ModalSidebar from '../Modals/ModalSidebar'

import { FIREBASE_DB } from '../../../FirebaseConfig';
import { doc, updateDoc, getDoc, collection, query, where, getDocs, addDoc, writeBatch, deleteDoc } from "firebase/firestore"
import { getAuth } from "firebase/auth";
import axios from 'axios';
import { AnalyticsPopup, ActivityPopup } from './WelcomePopups';
import { AIGenerationsTab } from "../PageContents/AIGenerationsTab"

export function DashboardComponent({ 
  userName, 
  allStepsCompleted, 
  showWelcome 
}: { 
  userName: string;
  allStepsCompleted: boolean;
  showWelcome: boolean;
}) {
  const [userEmail, setUserEmail] = useState("Loading...");
  const [showAnalyticsPopup, setShowAnalyticsPopup] = useState(false);
  const [showStep5Popup, setShowStep5Popup] = useState(false);
  const [step3Status, setStep3Status] = useState(false);
  const [step4Status, setStep4Status] = useState(false);
  const [step5Status, setStep5Status] = useState(false);
  const [userProducts, setUserProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [brandName, setBrandName] = useState("");
  const [accounteeName, setAccounteeName] = useState("");
  const [website, setWebsite] = useState("");
  const [SocialAccounts, setSocialAccounts] = useState([]);


  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email || "");
    } else {
      setUserEmail("No email found");
    }
  }, []);

  useEffect(() => {
    const checkSteps = async () => {
      const user = getAuth().currentUser;
      if (user) {
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
            setStep3Status(userData.Step3 || false);
            setStep4Status(userData.Step4 || false);
            setStep5Status(userData.Step5 || false);
        }
      }
    };
    checkSteps();
  }, []);

  // Effect to handle product display based on buttons
  useEffect(() => {
    const fetchUserProducts = async () => {
      const user = getAuth().currentUser;
      if (user && allStepsCompleted) {
        const productsRef = collection(FIREBASE_DB, 'products');
        const q = query(productsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        const products = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUserProducts(products);
      }
    };

    fetchUserProducts();
  }, []);

  
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Reset loading when products switch

  useEffect(() => {
    const loadUserData = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setUserEmail(user.email || "");
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const data = userDoc.data();
          setBrandName(data.brandName || "");
          setAccounteeName(data.displayName || user.displayName || "");
          setWebsite(data.website || "");
          setSocialAccounts(data.socialAccounts || "");
        } else {
          // If user doc doesn't exist yet, use auth displayName as fallback
          setAccounteeName(user.displayName || "");
        }
      } else {
        setUserEmail("No email found");
        setAccounteeName("");
      }
    };
    loadUserData();
  }, []);


  const [products, setProducts] = useState([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  // Add new state for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Add these new states at the top of the component
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [aiPrompt, setAIPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

const addProduct = async (product) => {
  const user = getAuth().currentUser;

  if (user) {
    try {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const userWebsite = userDoc.exists() ? userDoc.data().website || "" : "";
      const brand = userDoc.exists() ? userDoc.data().brand || "" : "";
      const founder = userDoc.exists() ? userDoc.data().founder || "" : "";
      const backgroundImageUrl = userDoc.exists() ? userDoc.data().backgroundImageUrl || "" : "";
      const brandImageUrl = userDoc.exists() ? userDoc.data().brandImageUrl || "" : "";
      const socialAccounts = userDoc.exists() ? userDoc.data().socialAccounts || [] : [];
      const campaignMedia = userDoc.exists() ? userDoc.data().campaignMedia || [] : [];

      // Create the product data without the image first
      const productData = {
        ...product,
        userId: user.uid,
        website: userWebsite,
        brand: brand,
        founder: founder,
        backgroundImageUrl: backgroundImageUrl,
        brandImageUrl: brandImageUrl,
        campaignMedia: campaignMedia,
        socialAccounts: socialAccounts,
        createdAt: new Date(),
        imageUrl: product.imageUrl || '',  // Use existing imageUrl if available
        imageName: product.imageName || ''
      };

      // Remove the raw image file from the data
      delete productData.image;
      
      // Add to Firebase
      const docRef = await addDoc(collection(FIREBASE_DB, 'products'), productData);
      
      // Update local state
      const newProduct = {
        ...productData,
        id: docRef.id
      };
      
      setUserProducts(prevProducts => [...prevProducts, newProduct]);
      setIsAddProductOpen(false);
      
    } catch (error) {
      console.error('Error adding product:', error);
    }
  }
};


  const handleEditProduct = (updatedProduct) => {
    const updatedProducts = products.map(p => 
      p.name === updatedProduct.name ? updatedProduct : p
    )
    setProducts(updatedProducts)
  }

  return (
    <div className="flex flex-col md:flex-row bg-white">
      {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between px-4 pb-4 border-b">
        <div className="flex items-center">
        {/* <span className="text-xl font-semibold text-zinc-700">Hi, {accounteeName}</span> */}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        ${isSidebarOpen ? 'block' : 'hidden'} 
      md:block 
        w-full md:w-64 
        bg-white pb-6 pr-4 pl-6 
        flex flex-col
        fixed md:relative
        top-0 left-0
        mr-4
        h-full
        z-50
      `}>
        {/* Mobile close button */}
        <div className="md:hidden flex justify-between items-center py-4">
          <span className="text-xl font-semibold">Menu</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </Button>
        </div>

        {/* Rest of sidebar content */}
        <nav className="space-y-1 flex-grow pt-10">
            {/* <div className="flex flex-col my-4 mb-7">
            <div className="flex items-center">
          <span className="text-xl font-semibold text-zinc-700">Hi, {accounteeName}</span>
          </div>
            </div> */}

          <nav className="space-y-3">
            <a 
              onClick={() => {
                setSelectedTab('dashboard')
                setIsSidebarOpen(false)
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
                selectedTab === 'dashboard' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
              }`}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </a>
            <a 
                onClick={() => {
                setSelectedTab('analytics')
                setIsSidebarOpen(false)
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
                if (!step4Status) {
                setShowAnalyticsPopup(true);
                }
                }}
              className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
                selectedTab === 'analytics' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
              }`}
            >
              <BarChart className="mr-2 h-5 w-5" />
              Analytics
            </a>
            <a 
        onClick={() => {
        setSelectedTab('Activity')
        setIsSidebarOpen(false)
        mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
        if (step4Status && !step5Status) {
          setShowStep5Popup(true);
        }
        }}
  className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
    selectedTab === 'Activity' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
  }`}
>
  <History className="mr-2 h-5 w-5" />
  Campaigns
</a>
<a 
  onClick={() => {
    setSelectedTab('ai')
    setIsSidebarOpen(false)
    mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }}
  className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
    selectedTab === 'ai' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
  }`}
>
  <Sparkles className="mr-2 h-5 w-5" />
  AI Images
</a>
            <a 
              onClick={() => {
                setSelectedTab('settings')
                setIsSidebarOpen(false)
                mainContentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
                selectedTab === 'settings' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
              }`}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </a>
            
          </nav>
        </nav>
        <div className="mt-6 p-4 bg-gray-100 rounded-2xl">
  <h2 className="text-zinc-800 font-semibold mb-2">New GS1 Standards</h2>
  <p className="text-sm text-gray-600 mb-4">Get your product line ready for the new GS1 QR codes with us.</p>
  <a href="https://www.gs1.org/" target="_blank" rel="noopener noreferrer">
    <Button variant="outline" className="w-full rounded-xl">View More</Button>
  </a>
</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-3 mt-1 px-3 md:pr-4 md:pl-4 pb-3 md:mr-4
  overflow-y-auto
  space-y-6
  rounded-3xl
  bg-gradient-to-br from-white/50 to-white/90
  shadow-[0_4px_16px_0_rgba(31,38,135,0.03)]
  border border-white/20
  scrollbar-thin
  scrollbar-thumb-gray-200/60
  scrollbar-track-gray-100/30
  hover:scrollbar-thumb-gray-300/70
  transition-all duration-300">
        {selectedTab === 'dashboard' && (
          <>
            {/* Search and filters header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <div className="relative w-full md:w-full pr-0">
      <Input 
        type="text" 
        placeholder="Search for..." 
        className="pl-10 rounded-full" 
      />
      <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
          <div className="flex w-full md:w-auto space-x-4">
          <SimpleListing onListingCreated={addProduct}  />

          <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
              <Button 
  className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 flex-1 md:flex-none"
>
  <div className="bg-emerald-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
    <Plus className="w-2 h-2" />
  </div>
  Product Line
</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[1200px] w-[98%] h-[91vh] flex flex-col rounded-lg
              overflow-y-auto pl-5 sm:pl-5 pr-5 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
                <div className="mb-2">
                  <h2 className="text-lg text-zinc-800 font-semibold">
                    Add New Product
                  </h2>
                  <p className="text-sm text-zinc-600 mt-1.5">
                    Fill in the details for the new product. Click save when you're done.
                  </p>
                </div>
                <div className="relative flex-1">
                  <ProductForm onSave={addProduct} isAddProductOpen={isAddProductOpen} onEdit={handleEditProduct} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
            </div>

            {/* Product cards */}
            <div className="space-y-6">
                {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-b-gray-200"></div>
                </div>
                ) : (
                  <>
                  {userProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-600 bg-white rounded-3xl shadow-md border border-gray-100 p-8 max-w-2xl mx-auto">
                      <div className="flex items-center justify-center w-16 h-16 mb-4 bg-blue-50 rounded-full">
                        <Package className="w-8 h-8 text-blue-500" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">Your Listing Card</h3>
                      <p className="text-gray-500 text-center mb-6 max-w-md">
                        Add your first product to create a beautiful listing card that showcases your brand and product details.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <Tag className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Product Details</h4>
                            <p className="text-xs text-gray-500">Display your product name, description, and category</p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <ImageIcon className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Product Images</h4>
                            <p className="text-xs text-gray-500">Showcase high-quality images of your product</p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <Share2 className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Social Integration</h4>
                            <p className="text-xs text-gray-500">Connect your social media accounts</p>
                          </div>
                        </div>
                        <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0 mr-3 mt-1">
                            <BarChart className="w-5 h-5 text-blue-500" />
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">Analytics</h4>
                            <p className="text-xs text-gray-500">Track views and engagement with your listing</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    userProducts.map((product, index) => (
                      <ProductCard
                        key={index}
                        product={product}
                        onEdit={handleEditProduct}
                        setUserProducts={setUserProducts}
                        SocialAccounts={SocialAccounts}
                        website={website}
                      />
                    ))
                  )}
                </>
                )}
            </div>
          </>
        )}

{selectedTab === 'analytics' && (
  <>
    {showAnalyticsPopup && (
      <AnalyticsPopup 
        onNext={async () => {
          const user = getAuth().currentUser;
          if (user) {
            const userRef = doc(FIREBASE_DB, 'users', user.uid);
            await updateDoc(userRef, {
              Step4: true
            });
            setShowAnalyticsPopup(false);
            setStep4Status(true);
          }
        }}
      />
    )}
    <AnalyticsTab userProducts={userProducts} />
  </>
)}

        {selectedTab === 'Activity' && (
          <>
          {showStep5Popup && (
            <ActivityPopup 
              onNext={async () => {
                const user = getAuth().currentUser;
                if (user) {
                  const userRef = doc(FIREBASE_DB, 'users', user.uid);
                  await updateDoc(userRef, {
                    Step5: true
                  });
                  setShowStep5Popup(false);
                  setStep5Status(true);
                }
              }}
            />
          )}
          <ActivityTab />
          </>
        )}

{selectedTab === 'settings' && (
  <SettingsTab 
    brandName={brandName}
    setBrandName={setBrandName}
    accounteeName={accounteeName}
    setAccounteeName={setAccounteeName}
    website={website}
    setWebsite={setWebsite}
    userEmail={userEmail}
  />
)}

{selectedTab === 'ai' && (
  <AIGenerationsTab />
)}
      </main>

      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="sm:max-w-[1000px] h-[91vh] flex flex-col rounded-lg
              overflow-y-auto pl-5 sm:pl-5 pr-5 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
          <div className="mb-0">
            <h2 className="text-lg text-zinc-800 font-semibold">
              Edit Product
            </h2>
            <p className="text-sm text-zinc-600 mt-1.5">
              Update the product details. Click save when you're done.
            </p>
          </div>
          <div className="relative flex-1">
            <ProductForm 
              product={editingProduct}
              onSave={(updatedProduct) => {
                handleEditProduct(updatedProduct)
                setIsEditModalOpen(false)
              }}
              isEditing={true}
              onEdit={handleEditProduct} 
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface Product {
  id: number;
  brand?: string;
  name?: string;
  description?: string;
  category?: string;
  weight?: string;
  gtin?: string;
  hoverimageUrl?: string;
  imageUrl?: string;
  userId?: string;
  updatedAt?: Date;
  similarProducts?: {
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    gtin: string;
  }[];
  campaigns?: {
    name: string;
    description: string;
    image: string;
    type: string;
    status: string;
  }[];
  socialAccounts?: {
    name: string;
    icon: string;
    color: string;
    bgColor: string,
    hoverBg: string,
    lightBg: string,
    url: string;
    username: string;
  }[];
}

function ProductCard({ product, onEdit, setUserProducts, SocialAccounts, website }) {
  const [activeTab, setActiveTab] = useState("info")
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const [tags, setTags] = useState({
    tagOne: product.tagOne || "",
    tagTwo: product.tagTwo || "", 
    tagThree: product.tagThree || "",
    tagFour: product.tagFour || ""
  })


  useEffect(() => {
    // Always set info as the first active tab
    setActiveTab('info')
  }, [])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  const handleFullscreen = () => {
    const frontImageUrl = product.imageUrl || product.imageUrl
    const backImageUrl = product.hoverimageUrl?.src || product.hoverimageUrl

    const dialog = document.createElement('dialog')
    dialog.className = 'fixed inset-0 w-full h-full bg-black/80 z-50 p-4'
    
    dialog.innerHTML = `
      <div class="flex flex-col items-center justify-center h-full relative">
        <button class="absolute top-2 right-6 p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all duration-200 ease-in-out transform hover:scale-105" data-close-button>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        ${backImageUrl ? `
          <!-- Tab Buttons -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 z-50">
            <button class="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors tab-button first-tab">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button class="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors tab-button second-tab">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        ` : ''}

        <div class="overflow-hidden max-h-[90vh] w-full">
          <div class="flex transition-transform duration-300 ease-in-out image-container" style="width: ${backImageUrl ? '200%' : '100%'}">
            <div class="flex-shrink-0 ${backImageUrl ? 'w-1/2' : 'w-full'} flex justify-center">
              <Image
                src="${frontImageUrl}" 
                alt="${product.category}"
                class="max-h-[90vh] max-w-[90vw] object-contain"
              />
            </div>
            ${backImageUrl ? `
              <div class="flex-shrink-0 w-1/2 flex justify-center">
                <Image
                  src="${backImageUrl}" 
                  alt="${product.category} - alternate view"
                  class="max-h-[90vh] max-w-[90vw] object-contain"
                />
              </div>
            ` : ''}
          </div>
        </div>
      </div>
    `
    
    document.body.appendChild(dialog)
    dialog.showModal()
    
    // Add event listeners
    const closeButton = dialog.querySelector('[data-close-button]')
    const firstTab = dialog.querySelector('.first-tab')
    const secondTab = dialog.querySelector('.second-tab')
    const imageContainer = dialog.querySelector('.image-container')
    let currentImageIndex = 0

    const updateImagePosition = () => {
      (imageContainer as HTMLElement).style.transform = `translateX(-${currentImageIndex * 50}%)`
      
      // Update tab visibility
      if (currentImageIndex === 1) {
        firstTab?.classList.add('block')
        firstTab?.classList.remove('hidden')
        secondTab?.classList.add('hidden')
        secondTab?.classList.remove('block')
      } else {
        firstTab?.classList.add('hidden')
        firstTab?.classList.remove('block')
        secondTab?.classList.add('block')
        secondTab?.classList.remove('hidden')
      }
    }

    if (backImageUrl) {
      firstTab.addEventListener('click', () => {
        currentImageIndex = 0
        updateImagePosition()
      })

      secondTab.addEventListener('click', () => {
        currentImageIndex = 1
        updateImagePosition()
      })
    }

    closeButton.addEventListener('click', () => {
      dialog.close()
      dialog.remove()
    })
    
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        if (currentImageIndex === 1) {
          currentImageIndex = 0
          updateImagePosition()
          setTimeout(() => {
            dialog.close()
            dialog.remove()
          }, 300)
        } else {
          dialog.close()
          dialog.remove()
        }
      }
    })
  }

  useEffect(() => {
    setUrl(`${window?.location?.origin || ''}/product?data=${encodeURIComponent(JSON.stringify({
      id: product.id,
    }))}`)
  }, [product.id])


  const icons = [Gift, Zap, Coffee, Rocket]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const downloadQRCode = () => {
    const svgElement = document.getElementById('product-qr');

    if (!svgElement) {
      console.error('QR Code SVG element not found');
      return;
    }

    // Convert SVG to Canvas
    const canvas = document.createElement('canvas');
    const svgData = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new window.Image(); // Use the native DOM `Image` API

    img.onload = () => {
      canvas.width = svgElement.clientWidth || 200;
      canvas.height = svgElement.clientHeight || 200;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Convert Canvas to PNG
      const pngUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = pngUrl;
      link.download = 'productCode.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up object URL
      URL.revokeObjectURL(url);
    };

    img.src = url; // Set the source of the image
  };

  return (
    <Card>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[30%] mb-4 md:mb-0 md:mr-6">
            <div 
              className="relative bg-gray-100 h-[288px] rounded-2xl cursor-pointer group"
            >
              <Image
                src={product.imageUrl} // Use the stored imageURL
                alt={product.imageUrl}
                width={260}
                height={288}
                className={'rounded-2xl object-cover w-full h-full transition-opacity duration-300'}
              />
              <p></p>
              
              {/* Fullscreen button */}
              <button
                onClick={handleFullscreen}
                className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-black/70"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="w-full md:w-[70%]">
            <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div className='w-full'>
             <span className="inline-block mt-2 mb-2 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {product.category}
                  </span>
             </div>            
             <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="w-full md:w-auto rounded-3xl"
                  >
                    <Settings className="w-4 h-4" />
                    Edit
                  </Button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-[1200px] w-[98%] h-[91vh] flex flex-col rounded-lg
                overflow-y-auto pl-5 sm:pl-5 pr-5 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
                  <div className="mb-0">
                    <h2 className="text-lg text-zinc-800 font-semibold">
                      Edit Product
                    </h2>
                    <p className="text-sm text-zinc-600 mt-1.5">
                      Update the product details. Click save when you're done.
                    </p>
                  </div>
                  <div className="relative flex-1">
                    <ProductForm 
                      product={product}
                      onSave={(updatedProduct) => {
                        onEdit(updatedProduct)
                        setIsEditModalOpen(false)
                      }}
                      isEditing={true}
                      onEdit={onEdit} 
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Update Tabs to be responsive */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex items-center mb-4">
              
                <ScrollArea className="w-full flex justify-center pb-2">
<TabsList className="inline-flex py-4 rounded-full">

  {/* Catalog tab - show if similarProducts exists and has items */}
  {product.similarProducts && product.similarProducts.length > 0 && (
    <TabsTrigger className='rounded-full px-4' value="catalog">Catalog</TabsTrigger>
  )}

{/* Info tab is always shown */}
  <TabsTrigger className='rounded-full px-4' value="info">Info</TabsTrigger>

    {/* Media tab - show if socialAccounts exists and has items */}
    {SocialAccounts && SocialAccounts.length > 0 && (
    <TabsTrigger className='rounded-full px-4' value="media">Brand Media</TabsTrigger>
  )}
  

  {/* Campaigns tab - show if campaigns exists and has items */}
  {product.campaigns && product.campaigns.length > 0 && (
    <TabsTrigger className='rounded-full px-4' value="campaigns">Active Campaigns</TabsTrigger>
  )}
  
  {/* Polling tab - show if campaigns exists (since polling is related to campaigns) */}
  {product.campaigns && product.campaigns.length > 0 && (
    <TabsTrigger className='rounded-full px-4' value="polling">Polling</TabsTrigger>
  )}

</TabsList>
                  <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                  
              </div>
              <TabsContent value="info">
              <div className="border border-gray-200 rounded-2xl p-4">
                {product && product.name ? (
                <>
                  <h3 className="text-lg text-zinc-800 font-semibold">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  </>
                ): (
                  <div className="flex flex-col items-center justify-center py-2">
                  <Button 
                    onClick={() => setIsEditModalOpen(true)}
                    variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 flex-1 md:flex-none"
                   >
              <div
                className="bg-emerald-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
                <Pencil className="w-2 h-2" />
              </div>
                    Update Information
                  </Button>
                </div>
                )}
                
                
                <div className="flex justify-between mt-9 pr-2">
                  <div className='flex w-full justify-between'>
                    <div className='flex gap-2'>
                      <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline">
                        Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[900px] w-[98%] h-[80vh] sm:h-[80vh] rounded-2xl
              overflow-y-auto pl-4 sm:pl-5 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
                      <DialogHeader className="pb-0">
                        <div className="flex items-center justify-center">
                          <DialogTitle className="text-zinc-800 font-semibold">Details Overview</DialogTitle>
                          
                        </div>
                      </DialogHeader>
                      <div className="flex flex-col md:grid md:grid-cols-[1fr,1fr] gap-6 md:gap-8 px-1 md:px-0">
                        {/* Left Column - Product Details */}
                        <Card className="p-6">
                          <h3 className="font-semibold mb-4">Product Information</h3>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <div>
                                <Label className="text-sm text-gray-500">Brand Name</Label>
                                <Input
                                  value={product.brand || ""}
                                  placeholder="Enter brand name"
                                  className="mt-1"
                                  disabled
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-gray-500">GTIN Number</Label>
                                <Input
                                  value={product.gtin || ""}
                                  placeholder="Enter GTIN number"
                                  className="mt-1"
                                  disabled
                                />
                              </div>
                              <div>
                                <Label className="text-sm text-gray-500">Category</Label>
                                <Input
                                  value={product.category || ""}
                                  placeholder="Enter category"
                                  className="mt-1"
                                  disabled
                                />
                              </div>
                                <div>
                                  <div className="mt-6 w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center">
                                  <Image
                                      src={product.imageSrc}
                                      alt={product.category || 'Product image'}
                                      width={80}
                                      height={80}
                                      className="object-contain w-full h-full"
                                    />
                                  </div>
                                </div>
                            </div>
                          </div>
                        </Card>

                        {/* Right Column - QR Code */}
                        <Card className="p-6">
                          <div className="flex flex-col h-full">
                            <h3 className="text-lg text-center font-semibold mb-3">Implementation</h3>
                            <p className="text-sm text-center text-gray-600 mb-4">
                               Place this Qr on your product packaging for customers.
                            </p>
                            
                            <div className="flex-grow flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
                              <QRCodeSVG
                                id="product-qr"
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}${`/product?data=${encodeURIComponent(JSON.stringify({
                                  id: product.id,
                                }))}`}`}
                                size={200}
                                level="M"
                                includeMargin={true}
                              />
                            </div>
                            
                            <div className="flex justify-center gap-4 mt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  const url = `/product?data=${encodeURIComponent(JSON.stringify({
                                    id: product.id,
                                  }))}`;
                                  window.open(url, '_blank');
                                }}
                                className="flex items-center rounded-2xl gap-2"
                              >
                                <Eye className="w-5 h-4" />
                                Visit 
                              </Button>
                              <Button 
                                variant="outline" 
                                onClick={downloadQRCode}
                                className="flex items-center rounded-2xl gap-2"
                              >
                                <Download className="w-4 h-4" />
                                Download
                              </Button>
                                <Button variant="outline"
                                  className="bg-cyan-500 hover:bg-cyan-600 text-white flex rounded-full items-center gap-2"
                                  onClick={copyToClipboard}
                                >
                                  <div className="bg-cyan-400/50 text-white flex justify-center items-center rounded-full p-1">
                                    {copied ? <span className='px-2'> Copied!</span> : <Share2 className="w-4 h-4" />}
                                  </div>
                                </Button> 
                            </div>
                          </div>
                        </Card>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Dialog>
                  {!product.campaigns ? (
                    <></>
                  ): (
                    <><DialogTrigger asChild>
                      <Button variant="outline">
                        Nutrition
                      </Button>
                    </DialogTrigger>
                    </>
                  )}
                    

                    <DialogContent className="sm:max-w-lg w-[98%] max-h-[91vh] rounded-lg
                    overflow-y-auto space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
                    <DialogHeader>
                        <DialogTitle className="text-lg font-medium text-gray-900 text-center">Nutrition Facts</DialogTitle>
                      </DialogHeader>
                      <NutritionFactsModal />
                    </DialogContent>
                  </Dialog>
                    </div>
                    <div>
                      <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="mr-[-12px]"
                        onClick={() => setIsEditModalOpen(true)}
                        >
                        <PenIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                      </div>
                </div>
                </div>
                </div>
              </TabsContent>

              <TabsContent value="campaigns">
              <ScrollArea className="w-full overflow-hidden">
                  <div className="flex space-x-4 pb-4">
                    {/* Campaign Overview Card */}
                    {product.campaigns?.map((campaign, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 rounded-xl border border-blue-100 transition-all duration-300"
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
            <div className="flex-shrink-0 mb-4 md:mb-0">
              <div className="p-3 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full inline-block shadow-md">
                {React.createElement(icons[index % icons.length], { className: "w-4 h-4 text-white" })}
              </div>
            </div>
            <div className="flex-grow">
              <div className="flex justify-center"> 
                    <h3 className="text-xl font-bold text-blue-700 mb-3 text-center">{campaign.type}</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-50">
      <div className="flex-shrink-0">
        <Zap className="w-6 h-6 text-purple-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-blue-800">{campaign.offerOne}</p>
        <p className="text-xs text-blue-600 mt-1">{campaign.oneDescription}</p>
      </div>
    </div>
    <div className="flex items-center space-x-4 bg-white p-4 rounded-lg border border-blue-100 shadow-sm hover:shadow-md transition-all duration-300 hover:bg-blue-50">
      <div className="flex-shrink-0">
        <Package className="w-6 h-6 text-purple-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-blue-800">{campaign.offerTwo}</p>
        <p className="text-xs text-blue-600 mt-1">{campaign.twoDescription}</p>
      </div>
    </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

{(!product.campaigns || product.campaigns.length === 0) && (
      <div className="text-center w-full flex justify-center align-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <div className="text-gray-500">No campaigns available for this product</div>
      </div>
    )}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>
              <TabsContent value="catalog" >
                  <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-4 pb-4">

                      {/* Similar Products */}
  {!product.similarProducts || product.similarProducts.length === 0 ? (
                            <div className="flex border border-dashed border-gray-200 rounded-lg w-full flex-col items-center justify-center py-6">
      <Button 
        onClick={() => setIsEditModalOpen(true)}
        variant="default"
        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 flex-1 md:flex-none"
      >
        <div className="bg-emerald-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
          <Plus className="w-2 h-2" />
        </div>
        Add Item
      </Button>
      <p className="text-sm text-gray-500 mt-4">Optional</p>
    </div>
                       ) : (
                       <>
                        {product.similarProducts?.map((similarProduct, index) => (
                        <Card key={index} className="bg-white rounded-2xl p-3 border border-dashed min-w-[160px] relative">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute top-2 right-2 h-8 w-8 bg-black/5 hover:bg-black/10 z-20"
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px]">
                              <DialogHeader>
                                <DialogTitle>Similar Product Details</DialogTitle>
                              </DialogHeader>
                              <div className="flex gap-6 p-4">
                                <div className="w-1/2">
                                <Card>
                                  <div className="relative h-[300px] rounded-lg overflow-hidden">
                                    <Image
                                      src={similarProduct.imageUrl}
                                      alt={similarProduct.name}
                                      fill
                                      className="object-contain w-full h-full"
                                    />
                                  </div>
                                </Card>
                                  
                                </div>
                                <div className="w-1/2 space-y-4">
                                  <h3 className="text-xl font-semibold">{similarProduct.name}</h3>
                                  <p className="text-gray-600">{similarProduct.description}</p>
                                  <div className="space-y-2">
                                    <div>
                                      <span className="text-sm text-gray-500">Category</span>
                                      <p className="font-medium">{similarProduct.category}</p>
                                    </div>
                                    <div>
                                      <span className="text-sm text-gray-500">GTIN</span>
                                      <p className="font-medium">{similarProduct.gtin}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <div className="relative h-24 mb-2">
                            <Image
                              src={similarProduct.imageUrl}
                              alt={similarProduct.name}
                              fill
                              className="object-contain rounded-lg"
                            />
                          </div>
                          <h4 className="font-medium text-center">{similarProduct.name}</h4>
                        </Card>
                      ))}
                        </>
                      )}

                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
              </TabsContent>
              <TabsContent value="polling" className="border-none p-0">
                <div className="flex flex-col w-full space-y-6">
                {!product.campaigns ? (
      <div className="text-center w-full flex justify-center align-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-200">
        <div className="text-gray-500">No polling data available for this product</div>
      </div>
    ) : (
      <>
        <ComparisonComponent />
      </>
    )}
  </div>
              </TabsContent>

                <TabsContent value="media" className="mt-0 border-none p-0">
                  <div className="space-y-6">
                  <SocialConnect socialAccounts={SocialAccounts} productWebsite={website} />
                  </div>
                </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border-t pt-4">
          <div className="flex items-center text-gray-500 mb-2 sm:mb-0 sm:mr-3">
          <Tag className="w-4 h-4 text-green-600 mr-2" />
          <span className="text-sm font-medium">Tags</span>
          </div>
            <div className="flex flex-wrap gap-2 flex-1 mx-4">
            {Object.entries(tags).map(([key, value]) => (
              <TagItem 
              key={key} 
              tagKey={key} 
              value={value} 
              product={product}
              tags={tags}
              setTags={setTags}
              />
            ))}

            
            </div>
            <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-600 hover:bg-red-50/80 rounded-full p-2 transition-all duration-200"
            onClick={() => setShowDeleteDialog(true)}
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
            className="transition-transform duration-200 hover:scale-110"
            >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
            </Button>

            <div 
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-200 ${
              showDeleteDialog ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            >
            <div className="bg-white rounded-[24px] shadow-lg p-6 w-[90%] max-w-md mx-4 border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-600 mb-6">
              Are you sure you want to delete this product? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                className="rounded-full"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="rounded-full bg-red-500 hover:bg-red-600"
                onClick={async () => {
                const user = getAuth().currentUser;
                if (user) {
                  try {
                  const productsRef = collection(FIREBASE_DB, 'products');
                  const q = query(productsRef, where('userId', '==', user.uid));
                  const querySnapshot = await getDocs(q);
                  const batch = writeBatch(FIREBASE_DB);
                  
                  querySnapshot.docs.forEach((doc) => {
                    if (doc.data().name === product.name) {
                    batch.delete(doc.ref);
                    }
                  });
                  
                    await batch.commit();
                    // Update local state using the setter function with callback
                    setUserProducts(prevProducts => prevProducts.filter(p => p.name !== product.name));

                    } catch (error) {
                    console.error('Error deleting product:', error);
                    }
                  }
                  setShowDeleteDialog(false);
                }}
              >
                Delete
              </Button>
              </div>
            </div>
            </div>
        </div>

      </CardContent>
    </Card>
  )
}

function TagItem({ tagKey, value, product, tags, setTags }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);

  if (isEditing) {
    return (
      <div className="relative group flex items-center">
        <input
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors outline-none"
          autoFocus
        />
        <Button
          variant="ghost"
          size="sm"
          className="ml-1 text-green-500 hover:text-green-600 p-1 rounded-full"
            onClick={async () => {
            const newTags = { ...tags, [tagKey]: editValue };
            // Update local state immediately
            setTags(newTags);
            setIsEditing(false);
            value = editValue; // Update the displayed value immediately
            
            const user = getAuth().currentUser;
            if (user) {
              const productsRef = collection(FIREBASE_DB, 'products');
              const q = query(productsRef, where('userId', '==', user.uid));
              const querySnapshot = await getDocs(q);
              const batch = writeBatch(FIREBASE_DB);
              
              querySnapshot.docs.forEach((doc) => {
              if (doc.data().name === product.name) {
                const updatedData = {
                [tagKey]: editValue,
                tags: newTags
                };
                batch.update(doc.ref, updatedData);
              }
              });
              
              await batch.commit();
            }
            }}
        >
          <Check className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className="relative group flex items-center">
      <a
        href={`https://twitter.com/hashtag/${value.replace('#', '')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
      >
        {value}
      </a>
      <Button
        variant="ghost"
        size="sm"
        className="ml-1 text-gray-400 hover:text-gray-600 p-1 rounded-full"
        onClick={() => setIsEditing(true)}
      >
        <PenIcon className="h-3 w-3" />
      </Button>
    </div>
  );
}

interface FormState {
  name: string;
  description: string;
  category: string;
  weight: string;
  gtin: string;
  similarProducts: any[];
  imageUrl: string;
}

interface ProductFormProps {
  product?: Product;
  onSave: (product: Product) => void;
  isEditing?: boolean;
  isAddProductOpen?: boolean;
  onEdit: (product: Product) => void;
}

function ProductForm({ 
  product = {} as Product, 
  onSave, 
  isEditing = false, 
  isAddProductOpen = false, 
  onEdit ,
}: ProductFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productImage, setProductImage] = useState<string | null>(isEditing ? product.imageUrl : null);
  const [activeTab, setActiveTab] = useState("info");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleUpdate = async () => {
    const user = getAuth().currentUser;
    if (user && product.id) {
      try {

        // Prepare the updated product data
        const updatedProductData = {
          ...formState,
          imageUrl: productImage || formState.imageUrl, // Use new image if available
          similarProducts: formState.similarProducts, // Include updated similar products
          userId: user.uid,
          updatedAt: new Date()
        };

        // Update in Firebase
        const productsRef = collection(FIREBASE_DB, 'products');
        const q = query(productsRef, where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(FIREBASE_DB);
        let found = false;
        
        querySnapshot.docs.forEach((doc) => {
          if (doc.id === product.id.toString()) {
            found = true;
            batch.update(doc.ref, updatedProductData);
          }
        });
        
        if (found) {
          await batch.commit();
          
          // Update local state
          onEdit({
            ...updatedProductData,
            id: product.id
          });

          if (typeof isAddProductOpen !== 'undefined') {
            setIsEditModalOpen(false);
          }
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    }
  };

  // Add proper form state management
  const [formState, setFormState] = useState<FormState>(
    {
    name: product.name || '',
    description: product.description || '',
    category: product.category || '',
    weight: product.weight || '',
    gtin: product.gtin || '',
    similarProducts: product.similarProducts || [],
    imageUrl: product.imageUrl || ''
    });
    

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Create FormData for upload
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData);

      if (response.data.success) {
        // Update the form state with the Cloudinary URL
        setFormState(prev => ({
          ...prev,
          imageUrl: response.data.data.secure_url
        }));

        // Also update the UI preview
        setProductImage(response.data.data.secure_url);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };


  const handleFormUpdate = (field: keyof FormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const user = getAuth().currentUser;
    let website = "";
    let brand = "";
    let socialAccounts = [];
    let campaignMedia = [];
    let founder = "";
    let brandImageUrl = "";
    let backgroundImageUrl = "";
    
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        website = userDoc.data().website || "";
        brand = userDoc.data().brandName || "";
        founder = userDoc.data().founder || "";
        backgroundImageUrl = userDoc.data().backgroundImageUrl || "";
        brandImageUrl = userDoc.data().brandImageUrl || "";
        socialAccounts = userDoc.data().socialAccounts || [];
        campaignMedia = userDoc.data().campaignMedia || [];
      }
    }
    
    const currentProductAsSimilar = {
      name: formState.name,
      description: formState.description,
      imageUrl: formState.imageUrl,
      category: formState.category,
      weight: formState.weight
    };

    const updatedProduct = {
      id: product.id || Date.now(),
      ...formState,
      socialAccounts,
      founder,
      brandImageUrl,
      backgroundImageUrl,
      userId: user?.uid,
      website,
      campaignMedia,
      brand,
      imageUrl: formState.imageUrl,
      similarProducts: [currentProductAsSimilar, ...(formState.similarProducts || [])]
    };

    if (isEditing) {
      try {
        const productsRef = collection(FIREBASE_DB, 'products');
        const q = query(productsRef, where('userId', '==', user?.uid));
        const querySnapshot = await getDocs(q);
        
        const batch = writeBatch(FIREBASE_DB);
        let found = false;
        
        querySnapshot.docs.forEach((doc) => {
          if (doc.data().name === product.name) {
            found = true;
            batch.update(doc.ref, updatedProduct as { [key: string]: any });
          }
        });
        
        if (found) {
          await batch.commit();
          onEdit(updatedProduct);
        }
      } catch (error) {
        console.error('Error updating product:', error);
      }
    } else {
      await onSave(updatedProduct);
    }
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      if (isEditing) {
        handleUpdate();
      } else {
        handleSubmit(e);
      }
    }} className="flex flex-col md:flex-row h-full gap-6">
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        orientation="vertical" 
        className="w-full h-full"
      >
        <ModalSidebar />
        <div className="flex-1 overflow-auto">
          <div className="border rounded-3xl p-6 md:p-4 bg-white">
            <TabsContent value="info" className="pr-2 pl-1 outline-0">
              {isEditing ? (
                <InfoContentTrue 
                  formData={formState}
                  updateFormData={handleFormUpdate}
                  productImage={productImage} 
                  setProductImage={setProductImage} 
                  handleImageUpload={handleImageUpload} 
                />
              ) : (
                <InfoContent 
                  formData={formState}
                  updateFormData={handleFormUpdate}
                  productImage={productImage} 
                  setProductImage={setProductImage} 
                  handleImageUpload={handleImageUpload} 
                />
              )}
            </TabsContent>


            <TabsContent value="catalog" className="mt-0 border-none p-0">
              {isAddProductOpen ? (
                <CatalogFalse 
                  onUpdate={(items) => handleFormUpdate('similarProducts', items)} 
                  initialItems={formState.similarProducts} 
                />
              ) : (
                <CatalogTrue 
                  product={formState} 
                  onUpdate={(items) => handleFormUpdate('similarProducts', items)} 
                />
              )}
            </TabsContent>

            <div className="flex justify-center mt-6 pt-6 space-x-4">
              {isEditing ? (
              <>
                <div 
                onClick={handleUpdate}
                className="bg-blue-600 hover:bg-blue-700 w-2/3 text-white rounded-3xl px-4 py-2 cursor-pointer transition-colors duration-200 flex items-center justify-center"
                >
                Update Changes
                </div>
              </>
              ) : (
              <div 
                onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as any);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-3xl px-4 py-2 cursor-pointer transition-colors duration-200 w-2/3 flex items-center justify-center"
              >
                Save Product
              </div>
              )}
            </div>
          </div>
        </div>
      </Tabs>
    </form>
  );

}