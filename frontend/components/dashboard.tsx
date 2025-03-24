'use client'

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion";
import { PenIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
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
  Zap, Coffee, Rocket, Search, Share2, Check
} from "lucide-react"
import Image from "next/image"
import ImageJoy from './Images/rfront.png'
import ImageJoyBack from './Images/rback.png'
import BlueImage from './Images/blue.png'
import GreenImage from './Images/green.png'
import YellowImage from './Images/yellow.png'

import React from "react"
import { QRCodeSVG } from 'qrcode.react'
import LogoImage from './Images/download.png'
import { SocialConnect } from "./social-connect"
import { ComparisonComponent } from "./comparisonPolls"
import { AnalyticsTab } from "./PageContents/AnalyticsTab"
import { ActivityTab } from './PageContents/ActivityTab'
import { SettingsTab } from './PageContents/SettingsTab'

import { SimpleListing } from '@/components/DashComps/SimpleListing';

import { InfoContent } from './CardArea/InfoContent';
import CatalogFalse from './CardArea/CatalogFalse';
import CatalogTrue from './CardArea/CatalogTrue';
import NutritionFactsModal from "./Modals/NutritionFacts"
import ModalSidebar from './Modals/ModalSidebar'

export function DashboardComponent() {
  const [products, setProducts] = useState([
    {
    id: 1,
    name: "Sour Strawberry Strips",
    category: "JoyRide Candy Strips",
    description: "A punch of sour, a burst of berry",
    imageSrc: ImageJoy,
    hoverImageSrc: ImageJoyBack,
    gtin: "844911008768",
    brand: "JoyRide Candy Co.", 
    weight: "32g (1.13 oz)",
    socialAccounts: [
      {
        name: "Facebook",
        icon: "Facebook",
        color: "text-[#1877F2]",
        username: "JOYRIDESweets",
        bgColor: "bg-[#1877F2]",
        hoverBg: "hover:bg-[#1877F2]/90",
        lightBg: "hover:bg-[#1877f2]/10",
        url: "https://facebook.com",
      },
      {
        name: "Instagram Profile",
        icon: "Instagram",
        color: "text-[#E4405F]",
        username: "joyridesweets",
        bgColor: "bg-[#E4405F]",
        hoverBg: "hover:bg-[#E4405F]/90",
        lightBg: "hover:bg-[#E4405F]/10",
        url: "https://instagram.com",
      },
      {
        name: "Twitter",
        icon: "Twitter",
        color: "text-[#1DA1F2]",
        username: "joyridesweets",
        bgColor: "bg-[#1DA1F2]",
        hoverBg: "hover:bg-[#1DA1F2]/90",
        lightBg: "hover:bg-[#1DA1F2]/10",
        url: "https://twitter.com",
      },
      {
        name: "YouTube Channel",
        icon: "Youtube",
        color: "text-[#FF0000]",
        username: "ryan",
        bgColor: "bg-[#FF0000]",
        hoverBg: "hover:bg-[#FF0000]/90",
        lightBg: "hover:bg-[#FF0000]/10",
        url: "https://youtube.com",
      },
      {
        name: "Company Website",
        icon: "Globe",
        color: "text-[#2563EB]",
        username: "joyridesweets.com"
      }
    ],
    similarProducts: [
      {
        name: "Blue Raspberry Strips",
        description: "Sweet and tangy blue raspberry flavor with the perfect balance of sour.",
        imageSrc: BlueImage,
        category: "JoyRide Candy Strips",
        weight: "32g"
      },
      {
        name: "Sour Green Apple Strips",
        description: "Crisp green apple flavor with a sour kick.",
        imageSrc: GreenImage,
        category: "JoyRide Candy Strips",
        weight: "32g"
      },
      {
        name: "Pink Lemonade Strips",
        description: "Zesty lemon flavor that'll make your taste buds dance.",
        imageSrc: YellowImage,
        category: "JoyRide Candy Strips",
        weight: "32g"
      }
    ],
    campaigns: [
      {
        type: "Win with JoyRide!",
        offerOne: "Win a Box of JoyRide",
        offerTwo: "Be in a Ryan Trahan Vlog!!",
        oneDescription: "Limited time offer!",
        twoDescription: "Get featured in upcoming content",
      },
     
    ],
  
  }

])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [emptyData, setemptyData] = useState("")

  const [editingProduct, setEditingProduct] = useState(null)
  const [selectedTab, setSelectedTab] = React.useState('dashboard')

  // Add new state for mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const addProduct = (product) => {
    setProducts([...products, product])
    setIsAddProductOpen(false)
  }

  const editProduct = (product) => {
    const updatedProducts = products.map(p => p.name === product.name ? product : p)
    setProducts(updatedProducts)
    setIsEditProductOpen(false)
  }

  const handleEditProduct = (updatedProduct) => {
    const updatedProducts = products.map(p => 
      p.name === updatedProduct.name ? updatedProduct : p
    )
    setProducts(updatedProducts)
  }


  return (
    <div className="flex max-h-screen flex-col md:flex-row border border-gray-200 rounded-2xl 
    ml-0 md:ml-3 mr-0 md:mr-3 pt-4 pb-4 bg-white">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between px-4 pb-4 border-b">
        <div className="flex items-center">
          <Image
            src={LogoImage}
            alt="Mall AI Logo"
            width={32}
            height={32}
            className="object-contain rounded-lg mr-3"
          />
          <span className="text-xl font-semibold text-zinc-800">Mall ai</span>
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
        <nav className="space-y-1 flex-grow">
          <div className="flex items-center m-4 border py-3 rounded-xl justify-center mb-7">
            <div className="w-8 h-8 flex items-center justify-center mr-3">
              <Image
                src={LogoImage}
                alt="Mall AI Logo"
                width={32}
                height={32}
                className="object-contain rounded-lg"
              />
            </div>
            <span className="text-xl font-semibold text-zinc-800">Mall ai</span>
          </div>

          <nav className="space-y-3">
            <a 
              onClick={() => {setSelectedTab('dashboard'); setIsSidebarOpen(false)}}
              className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
                selectedTab === 'dashboard' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
              }`}
            >
              <Home className="mr-2 h-5 w-5" />
              Dashboard
            </a>
            <a 
              onClick={() => {setSelectedTab('analytics'); setIsSidebarOpen(false)}}
              className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
                selectedTab === 'analytics' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
              }`}
            >
              <BarChart className="mr-2 h-5 w-5" />
              Analytics
            </a>
            <a 
  onClick={() => {setSelectedTab('history'); setIsSidebarOpen(false)}}
  className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
    selectedTab === 'history' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
  }`}
>
  <History className="mr-2 h-5 w-5" />
  Campaigns
</a>
            <a 
              onClick={() => {setSelectedTab('settings'); setIsSidebarOpen(false)}}
              className={`flex items-center cursor-pointer text-gray-600 hover:text-blue-600 hover:bg-blue-50 border border-transparent hover:border-blue-100 p-2 rounded-lg transition-all ${
                selectedTab === 'settings' ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' : ''
              }`}
            >
              <Settings className="mr-2 h-5 w-5" />
              Settings
            </a>
          </nav>
        </nav>
        <div className="mt-6 p-4 bg-gray-100 rounded-lg">
  <h2 className="text-zinc-800 font-semibold mb-2">New GS1 Standards</h2>
  <p className="text-sm text-gray-600 mb-4">Get your product line ready for the new GS1 QR codes with us.</p>
  <a href="https://www.gs1.org/" target="_blank" rel="noopener noreferrer">
    <Button variant="outline" className="w-full">View More</Button>
  </a>
</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-3 px-3 md:pr-4 md:pl-4 pb-3 md:mr-4
  overflow-y-auto
  space-y-6
  rounded-3xl
  bg-gradient-to-br from-white/50 to-white/90
  backdrop-blur-lg
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
          <SimpleListing onListingCreated={addProduct} />

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
              {products.map((product, index) => (
                <ProductCard
                  key={index}
                  product={product}
                  onEdit={handleEditProduct}
                />
              ))}
            </div>
          </>
        )}

{selectedTab === 'analytics' && (
<AnalyticsTab />
)}

        {selectedTab === 'history' && (
          <ActivityTab />
        )}

        {selectedTab === 'settings' && (
          // Demo fake data passed
          <SettingsTab 
            brandName={emptyData}
            setBrandName={setemptyData}
            accounteeName={emptyData}
            setAccounteeName={setemptyData}
            website={emptyData}
            setWebsite={setemptyData}
            userEmail={emptyData}
          />
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
  imageSrc?: string;
  brand?: string;
  name?: string;
  description?: string;
  category?: string;
  weight?: string;
  gtin?: string;
  hoverImageSrc?: string;
  similarProducts?: {
    name: string;
    description: string;
    imageSrc: string;
    category: string;
    weight: string;
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

function ProductCard({ product, onEdit }) {
  const [activeTab, setActiveTab] = useState("info")
  const [isHovered, setIsHovered] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

    const [tags, setTags] = useState({
      tagOne: product.tagOne || "JoyRideCandy",
      tagTwo: product.tagTwo || "SweetTreats", 
      tagThree: product.tagThree || "CandyLovers",
      tagFour: product.tagFour || "TrendingCandy"
    })

  const handleFullscreen = () => {
    const frontImageUrl = product.imageSrc.src || product.imageSrc
    const backImageUrl = product.hoverImageSrc?.src || product.hoverImageSrc

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
    setUrl(`${window?.location?.origin || ''}/joyride?data=${encodeURIComponent(JSON.stringify({
      id: product.id?.toString() || '',
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
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src={product.imageSrc}
                alt={product.category}
                width={260}
                height={288}
                className={`rounded-2x1 object-cover w-full h-full transition-opacity duration-300 ${
                  isHovered ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {product.hoverImageSrc && (
                <Image
                  src={product.hoverImageSrc}
                  alt={`${product.category} - alternate view`}
                  width={260}
                  height={288}
                  className={`rounded-2x1 object-cover w-full h-full absolute top-0 left-0 transition-opacity duration-300 ${
                    isHovered ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              )}
              
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
                      onEdit={onEdit}  // Add this line
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
    <TabsTrigger className='rounded-full px-4' value="media">Brand Media</TabsTrigger>  

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
                            <h3 className="text-lg text-center font-semibold mb-4">Implementation</h3>
                           
                            <p className="text-sm text-center text-gray-600 mb-4">
                               Place this Qr on your product packaging for customers.
                            </p>
                            
                            <div className="flex-grow flex flex-col items-center justify-center bg-white rounded-2xl border border-gray-100">
                              <QRCodeSVG
                                id="product-qr"
                                value={`${typeof window !== 'undefined' ? window.location.origin : ''}${`/joyride?data=${encodeURIComponent(JSON.stringify({
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
                                  const url = `/joyride?data=${encodeURIComponent(JSON.stringify({
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
                                      src={similarProduct.imageSrc}
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
                                      <span className="text-sm text-gray-500">Weight</span>
                                      <p className="font-medium">{similarProduct.weight}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                          <div className="relative h-24 mb-2">
                            <Image
                              src={similarProduct.imageSrc}
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
                  <SocialConnect socialAccounts={product.socialAccounts} />
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [productImage, setProductImage] = useState<string | null>(isEditing ? product.imageSrc : null)
  const [activeTab, setActiveTab] = useState("info")

    // Add proper form state management
    const [formState, setFormState] = useState<FormState>(
      {
      name: product.name || '',
      description: product.description || '',
      category: product.category || '',
      weight: product.weight || '',
      gtin: product.gtin || '',
      similarProducts: product.similarProducts || [],
      imageUrl: product.imageSrc || ''
      });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => {
      setProductImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Cleanup URLs on unmount
  useEffect(() => {
    return () => {
      if (productImage && !isEditing) {
        URL.revokeObjectURL(productImage)
      }
    }
  }, [productImage, isEditing])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget
    
    const updatedProduct = {
      ...product,
      brand: (formEl.elements.namedItem('brand') as HTMLInputElement)?.value,
      name: (formEl.elements.namedItem('name') as HTMLInputElement)?.value,
      description: (formEl.elements.namedItem('description') as HTMLInputElement)?.value,
      category: (formEl.elements.namedItem('category') as HTMLInputElement)?.value,
      weight: (formEl.elements.namedItem('weight') as HTMLInputElement)?.value,
      gtin: (formEl.elements.namedItem('gtin') as HTMLInputElement)?.value,
      imageSrc: productImage || product.imageSrc,
      hoverImageSrc: product.hoverImageSrc // Preserve the hover image
    }

    onSave(updatedProduct)
  }

  const handleFormUpdate = (field: keyof FormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row h-full gap-6">
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
            <InfoContent 
  product={product} 
  productImage={productImage} 
  setProductImage={setProductImage} 
  handleImageUpload={handleImageUpload} 
/>
            </TabsContent>

             <TabsContent value="catalog" className="mt-0 border-none p-0">
                          {isAddProductOpen ? (
                            <CatalogFalse
                              onUpdate={(items) => handleFormUpdate('similarProducts', items)} 
                              initialItems={formState.similarProducts} 
                            />
                          ) : (
                            <CatalogTrue
                              product={product} 
                              onUpdate={(items) => handleFormUpdate('similarProducts', items)} 
                            />
                          )}
                        </TabsContent>
            
<div className="flex justify-center mt-6 pt-6 space-x-4">
{isEditing ? (
              <>
                <div 
                // onClick={handleUpdate}
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
  )
}