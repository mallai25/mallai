'use client';  // Add this at the top

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Sparkles, Twitter, Globe, Check, Eye, Download, Share2, Facebook, Instagram, Youtube,
   Shield, Zap, ChevronDown, Gift, Users, BarChart, Building2  } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from 'qrcode.react'

import { motion, AnimatePresence } from "framer-motion";
import mallLogo from "./Images/download.png"
import Link from 'next/link'
import { useState, useEffect, useRef, ChangeEvent, FormEvent } from 'react'
import { CreativitySection } from "./CreativitySection";
import { DashboardComponent } from "./dashboard";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import RewardsImage from "./Images/Rewards.jpg"
import CampaignImage from "./Images/campaigns.jpg"

import { FIREBASE_DB } from "../FirebaseConfig";
import { collection, addDoc, getFirestore, doc, updateDoc } from "firebase/firestore"
import { User } from 'firebase/auth'; // Add this import at the top
import axios from 'axios'; // Add this import at the top with other imports

// Add before the AdaptHero component:
interface SocialAccount {
  name: string;
  iconName: string;
  username: string;
  icon: any;
  bgColor: string;
  hoverBg: string;
  lightBg: string;
  color: string;
  isOpen: boolean;
  urlPrefix: string;
}

const ImageUploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

// Feature type for better organization
type Feature = {
  name: string
}

// Plan type for better organization
type Plan = {
  id: string
  name: string
  price: number
  period: string
  description: string
  badge: string
  badgeColor: string
  buttonColor: string
  hoverColor: string
  iconColor: string
  shadowColor: string
  features: Feature[]
  icon: React.ReactNode
  popular?: boolean
}

export function AdaptHero() {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false)

  const [isAnnual, setIsAnnual] = useState(false)
  const [hoveredPlan, setHoveredPlan] = useState<string | null>(null)
  const [expandedFeatures, setExpandedFeatures] = useState(false)

    // Common features across all plans
    const features: Feature[] = [
      { name: "Purchase GS1 Barcode" },
      { name: "Dynamic QR Data" },
      { name: "Product Profile pages" },
      { name: "Reward Campaigns setup" },
      { name: "Create Product Polls" },
      { name: "Highlight SKU Management" },
      { name: "Receive orders through Stripe" },
      { name: "Product Description creation Assistance" },
    ]
  
    // Plans data
    const plans: Plan[] = [
      {
        id: "basic",
        name: "Basic",
        price: 31,
        period: "/mo",
        description: "Perfect for new brands",
        badge: "15 DAY FREE TRIAL",
        badgeColor: "bg-emerald-100 text-emerald-700",
        buttonColor: "bg-emerald-600 hover:bg-emerald-700",
        hoverColor: "hover:border-emerald-300",
        iconColor: "bg-emerald-500 shadow-emerald-200",
        shadowColor: "hover:shadow-emerald-200",
        features,
        icon: <Zap className="w-5 h-5 text-emerald-600" />,
      },
      {
        id: "pro",
        name: "Pro",
        price: isAnnual ? 372 : 186, // $174/mo for 6 months, $145/mo for 12 months
        period: isAnnual ? "/ 12 months" : "/ 6 months",
        description: isAnnual ? "Annual commitment" : "Periodic commitment",
        badge: "15 DAY FREE TRIAL",
        badgeColor: "bg-blue-500 text-white",
        buttonColor: "bg-blue-500 hover:bg-blue-600",
        hoverColor: "hover:border-blue-500",
        iconColor: "bg-blue-400 shadow-blue-300/30",
        shadowColor: "hover:shadow-blue-500/30",
        features,
        icon: <Sparkles className="w-5 h-5 text-blue-500" />,
        popular: true,
      },
      {
        id: "conditioned",
        name: "Conditioned",
        price: 31,
        period: "/mo",
        description: "For brands with GS1 barcodes",
        badge: "15 DAY FREE TRIAL",
        badgeColor: "bg-purple-100 text-purple-700",
        buttonColor: "bg-purple-600 hover:bg-purple-700",
        hoverColor: "hover:border-purple-300",
        iconColor: "bg-purple-500 shadow-purple-200",
        shadowColor: "hover:shadow-purple-200",
        features: [{ name: "Use existing GS1 Barcode" }, ...features.slice(1)],
        icon: <Shield className="w-5 h-5 text-purple-600" />,
      },
    ]
  
    // Animation variants
    const cardVariants = {
      hover: {
        y: -10,
        transition: {
          duration: 0.3,
          ease: "easeOut",
        },
      },
    }
  
    const checkVariants = {
      initial: { scale: 0 },
      animate: { scale: 1, transition: { type: "spring", stiffness: 500, damping: 30 } },
    }
  
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
    }
  
    const itemVariants = {
      hidden: { y: 20, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
      },
    }
    
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('formybabygirl')

  const auth = FIREBASE_AUTH

  const scrollToDashboard = () => {
    dashboardRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const signUpNow = async () => {
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.log(error);
      // alert('SignUp in failed: ' + error.message);
    } 
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    signUpNow()
    setButtonText("You're on the list!")
    setShowThankYouPopup(true)
  }

  const suggestions = [
    {
      question: "What makes matcha unique?",
      answer: "Unlike regular green tea, matcha uses whole powdered leaves, providing higher antioxidant levels and a rich umami flavor."
    },
    {
      question: "Why are chia seeds popular in smoothies?",
      answer: "They absorb liquid and form a gel-like texture, adding thickness while providing fiber, omega-3s, and plant-based protein."
    },
    {
      question: "How is Greek yogurt different from regular yogurt?",
      answer: "It’s strained to remove excess whey, making it thicker, higher in protein, and lower in sugar while maintaining probiotic benefits."
    },
    {
      question: "What’s special about dark chocolate?",
      answer: "It contains flavonoids, which may improve heart health, and natural compounds that boost serotonin levels for mood enhancement."
    },
    {
      question: "Is quinoa a grain or a seed?", 
      answer: "Quinoa is technically a seed but classified as a whole grain due to its fiber and nutrient profile, making it a great gluten-free alternative."
    },
    {
      question: "What is tahini used for?",
      answer: "A creamy paste made from ground sesame seeds, often used in hummus, dressings, and desserts for its nutty flavor and smooth texture."
    },
    {
      question: "Are cashews actually nuts?",
      answer: "Cashews are seeds that grow on the bottom of cashew apples. They require careful processing to remove toxic compounds before eating."
    }
];

  const [buttonText, setButtonText] = useState("Join list"); // New state for button text

  const [emailError, setEmailError] = useState<string>(''); // New state for email error message

  const waitlistRef = useRef<HTMLDivElement>(null);

  const scrollToWaitlist = () => {
    waitlistRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Easy Gtin upload
    const [gtin, setGtin] = useState('')
    const [showDetails, setShowDetails] = useState(false)
      // Add new state for social accounts
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    { 
      name: "Facebook", 
      iconName: "Facebook", 
      username: "", 
      icon: Facebook, 
      bgColor: "bg-[#1877F2]", 
      color: "text-[#1877F2]",
      hoverBg: "hover:bg-[#1877F2]/90",
      lightBg: "hover:bg-[#1877f2]/10",
      isOpen: false,
      urlPrefix: "https://facebook.com"
    },
    { 
      name: "Twitter", 
      iconName: "Twitter", 
      username: "", 
      icon: Twitter, 
      color: "text-[#1DA1F2]",
      bgColor: "bg-[#1DA1F2]",
      hoverBg: "hover:bg-[#1DA1F2]/90",
      lightBg: "hover:bg-[#1DA1F2]/10",
      isOpen: false,
      urlPrefix: "https://twitter.com"
    },
    { 
      name: "Instagram", 
      iconName: "Instagram", 
      username: "", 
      icon: Instagram, 
      color: "text-[#E4405F]",
      bgColor: "bg-[#E4405F]",
      hoverBg: "hover:bg-[#E4405F]/90",
      lightBg: "hover:bg-[#E4405F]/10",
      isOpen: false,
      urlPrefix: "https://instagram.com"
    },
    { 
      name: "YouTube", 
      iconName: "Youtube", 
      username: "", 
      icon: Youtube, 
      color: "text-[#FF0000]",
      bgColor: "bg-[#FF0000]",
      hoverBg: "hover:bg-[#FF0000]/90",
      lightBg: "hover:bg-[#FF0000]/10",
      isOpen: false,
      urlPrefix: "https://youtube.com"
    },

  ])

    const [formData, setFormData] = useState({
      name: '',
      description: '',
      website: '',
      image: null as File | null,
      socialAccounts: [] as {name: string, icon: string, username: string, url: string}[],
      imageUrl: '',
      claimedListing: false,
    })
    const [isSaved, setIsSaved] = useState(false)
    const [copied, setCopied] = useState(false)
    const [urlDemo, setUrlDemo] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    const [productId, setProductId] = useState<string | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    // Add new state for user
    const [user, setUser] = useState<User | null>(null);

    // Add useEffect to listen to auth state changes
    useEffect(() => {
      const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
        setUser(user);
      });

      return () => unsubscribe();
    }, []);

    const handleGtinChange = (e: ChangeEvent<HTMLInputElement>) => {
      setGtin(e.target.value)
    }

    const handleGtinCheck = () => {
      if (gtin.length > 0) {
        setShowDetails(true)
      }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target
      setFormData(prev => ({ ...prev, [name]: value }))
      if (isSaved) setHasChanges(true);
    }

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData);

          if (response.data.success) {
            setFormData(prev => ({ 
              ...prev, 
              image: file,
              imageUrl: response.data.data.secure_url 
            }));

            if (productId) {
              const docRef = doc(FIREBASE_DB, "products", productId);
              await updateDoc(docRef, {
                imageUrl: response.data.data.secure_url,
                imageName: file.name
              });
            }
          }
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    }

    const handleDemoSubmit = async (e: FormEvent) => {
      e.preventDefault(); // Prevent form submission
    };

    // Modify handleSaveProduct to include claimedListing based on auth status
    const handleSaveProduct = async () => {
      if (formData.name && formData.description) {
        try {
          // Generate temporary ID for unsigned users
          const tempUserId = !user ? `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : null;

          // Create base product data
          const productData = {
            name: formData.name,
            description: formData.description,
            website: formData.website || '',
            socialAccounts: formData.socialAccounts,
            createdAt: new Date().toISOString(),
            gtin: gtin,
            claimedListing: user !== null,
            userId: user?.uid || tempUserId, // Use real user ID or temp ID
            isTemporary: !user, // Flag to identify temporary users
            imageUrl: formData.imageUrl || '',
            imageName: formData.image?.name || ''
          };

          const docRef = await addDoc(collection(FIREBASE_DB, "products"), productData);
          setIsSaved(true);
          setProductId(docRef.id);

          // If using a temporary ID, you might want to store it in localStorage
          if (tempUserId) {
            localStorage.setItem(`temp_product_${docRef.id}`, tempUserId);
          }
        } catch (error) {
          console.error("Error saving product: ", error);
        }
      }
    };

    const handleUpdateProduct = async () => {
      if (!productId) return;

      try {
        const docRef = doc(FIREBASE_DB, "products", productId);
        await updateDoc(docRef, {
          name: formData.name,
          description: formData.description,
          website: formData.website,
          socialAccounts: formData.socialAccounts,
          imageUrl: formData.imageUrl || '',
          imageName: formData.image?.name || '',
          updatedAt: new Date().toISOString(),
        });

        setHasChanges(false);
      } catch (error) {
        console.error("Error updating product: ", error);
      }
    };

    useEffect(() => {
      setUrlDemo(`${window?.location?.origin || ''}/view?data=${encodeURIComponent(JSON.stringify({
        id: productId?.toString() || '',
      }))}`)
    }, [productId])

      const copyToClipboard = async () => {
        try {
          await navigator.clipboard.writeText(urlDemo)
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


  const handleSocialInputChange = (name: string, value: string) => {
    setSocialAccounts(accounts => {
      const newAccounts = accounts.map(account => {
        if (account.name === name) {
          const cleanUsername = value.replace(/[@\s]/g, '')
          return { ...account, username: cleanUsername }
        }
        return account
      })

      // Update formData with the new social accounts
      setFormData(prev => ({
        ...prev,
        socialAccounts: newAccounts
          .filter(acc => acc.username)
          .map(acc => ({
            name: acc.name,
            icon: acc.iconName,
            username: acc.username,
            color: acc.color,
            bgColor: acc.bgColor,
            hoverBg: acc.hoverBg,
            lightBg: acc.lightBg,
            url: acc.urlPrefix,
          }))
      }))
      return newAccounts
    })
  }

  const toggleSocialInput = (name: string) => {
    setSocialAccounts(accounts =>
      accounts.map(account => ({
        ...account,
        isOpen: account.name === name ? !account.isOpen : false
      }))
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="backdrop-blur-lg bg-white/70">
        <div className="container mx-auto px-4 pt-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image className="w-8 h-8 md:w-10 md:h-10 rounded-xl"
              height="40" src={mallLogo} alt="Mall AI Logo" width={40} />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Mall ai
            </span>
          </div>
          <Button 
            variant="outline" 
            className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 border-none"
            onClick={() => window.location.href = '/login'}
          >
            Sign In
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-14">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-left space-y-8">
            <Link href="https://www.gs1.org/">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white rounded-full px-3 py-1.5 shadow-md hover:shadow-xl transition-all duration-200"
              >
                <span className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-2 py-0.5 rounded-full text-xs font-medium">
                  New
                </span>
                <span className="text-gray-700 text-sm font-medium pr-1">
                  GS1 Transition to QR codes →
                </span>
              </motion.div>
            </Link>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-bold leading-tight tracking-tight"
            >
              Improve retail with{" "}
              <span className="text-[#4147d5]">
                product QR codes
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 text-lg md:text-2xl leading-relaxed"
            >
              Set the adoption of GS1 QR codes on products and experience seamless in-app display every time a product QR code is scanned.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-4"
            >
              <Button 
                onClick={() => setSelectedQuestion(0)}
                className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-full px-8 py-6 text-lg font-medium transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2"
              >
                <Sparkles className="w-6 h-6" />
                Get Started
              </Button>
              <Button 
                onClick={scrollToDashboard}
                variant="outline"
                className="bg-white hover:bg-gray-50 text-gray-800 rounded-full px-8 py-6 text-lg font-medium border-2 border-gray-200 hover:border-gray-300 transition-all duration-200"
              >
                View Demo
              </Button>
            </motion.div>
          </div>

          <div className="pr-3 md:pr-0 pl-2 md:pl-0">
<motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#5159ff]/10 to-[#4147d5]/10 rounded-3xl transform rotate-6" />
            <div 
              className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50"
              style={{
                backgroundImage: `url(${RewardsImage.src})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                height: '500px'
              }}
            >
              <div className="absolute inset-0 bg-black/30" />
            </div>
          </motion.div>
          </div>

        </div>
      </main>

      {/* Suggestions section */}
      <div className={`container mx-auto px-2 md:px-4 mb-2 ${selectedQuestion === null ? "h-auto" : "min-h-[16rem]"}`}>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 max-w-3xl mx-auto">
          {suggestions.map((item, index) => (
            <div 
              key={index} 
              className={`flex flex-col items-center w-auto ${
                index >= 3 ? 'hidden md:flex' : ''
              }`}
            >
              <Button 
                onClick={() => setSelectedQuestion(selectedQuestion === index ? null : index)}
                className={`bg-emerald-600 hover:bg-white text-white hover:text-emerald-600 border border-gray-300 hover:border-emerald-600 rounded-full px-4 py-2 text-sm flex items-center gap-2 transition-all duration-200 whitespace-nowrap ${
                  selectedQuestion === index ? 'bg-white text-emerald-600 border-emerald-600' : ''
                }`}
              >
                <Sparkles className="w-4 h-4" />
                {item.question}
              </Button>

              {selectedQuestion === index && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mt-3 mb-4 w-[90vw] md:w-auto max-w-md text-sm md:text-base text-gray-700 bg-white rounded-xl p-4 shadow-lg border border-gray-100"
                >
                  {item.answer}
                </motion.div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Problem section */}
      <CreativitySection />

      <div className="bg-white">
        {/* Demo Build Button */}
        <div className="flex justify-center selection: mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="inline-flex bg-white rounded-full p-1 shadow-md"
          >
            <Button 
              className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-full px-6 md:px-8 py-2 md:py-3 text-sm md:text-base transition-colors duration-200 flex items-center gap-2"
            >
              Demo Build
            </Button>
          </motion.div>
        </div>

        {/* Product Demo */}
        <div ref={dashboardRef}>
          <DashboardComponent />
        </div>

        {/* Pricing Section */}
        <div className="py-14 px-4">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Pro plan toggle */}
              <div className="inline-flex items-center justify-center shadow-lg px-4 py-2 bg-white dark:bg-gray-800 rounded-full mb-4">
                <span
                  className={`mr-3 text-sm ${!isAnnual ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                >
                  6 Months
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${isAnnual ? "bg-blue-500" : "bg-gray-300 dark:bg-gray-700"}`}
                  aria-label={isAnnual ? "Switch to 6 months" : "Switch to 12 months"}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAnnual ? "translate-x-7" : "translate-x-1"}`}
                  />
                </button>
                <span
                  className={`ml-3 flex items-center text-sm ${isAnnual ? "font-medium text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}`}
                >
                  12 Months
                  <span className="ml-2 inline-flex items-center rounded-full bg-green-100 dark:bg-green-900 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:text-green-300">
                    Pro Plan
                  </span>
                </span>
              </div>
            </motion.div>
    
            {/* Plans */}
            <motion.div
              className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {plans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  className={`relative cursor-pointer ${
                    plan.popular
                      ? "bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 dark:from-blue-950 dark:via-blue-900 dark:to-blue-950 text-white"
                      : "bg-white dark:bg-gray-800 dark:border-gray-700"
                  } rounded-3xl shadow-lg p-6 sm:p-8 border ${
                    plan.popular ? "border-gray-800 dark:border-blue-700" : "border-gray-100 dark:border-gray-700"
                  } ${plan.hoverColor} transition-all duration-300`}
                  initial="initial"
                  whileHover="hover"
                  variants={{
                    ...cardVariants,
                    ...itemVariants
                  }}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  style={{
                    transform: plan.popular ? "scale(1.05)" : "scale(1)",
                    zIndex: plan.popular ? 10 : 1,
                  }}
                  custom={index}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-0 right-0 flex justify-center">
                      <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-xs font-medium px-4 py-1 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
        
                  <div className="flex items-center justify-between mb-4">
                    <span className={`${plan.badgeColor} text-xs font-medium px-3 py-1 rounded-full`}>{plan.badge}</span>
                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-full">
                      {plan.icon}
                    </div>
                  </div>
        
                  <div className="mb-6">
                    <h3
                      className={`text-xl font-semibold ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"} mb-2`}
                    >
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline">
                      <div
                        className={`text-4xl font-bold ${plan.popular ? "text-white" : "text-gray-900 dark:text-white"}`}
                      >
                        ${plan.price}
                      </div>
                      <span
                        className={`text-lg font-normal ml-1 ${plan.popular ? "text-gray-300" : "text-gray-600 dark:text-gray-300"}`}
                      >
                        {plan.period}
                      </span>
                    </div>
                    <p className={plan.popular ? "text-gray-300" : "text-gray-500 dark:text-gray-400"}>
                      {plan.description}
                    </p>
                  </div>
        
                  {/* Features - Show first 4 by default, rest on expand */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.slice(0, 4).map((feature, index) => (
                      <motion.li
                        key={index}
                        className="flex items-center"
                        initial="initial"
                        animate="animate"
                        variants={checkVariants}
                        custom={index}
                      >
                        <div className={`w-5 h-5 rounded-full ${plan.iconColor} mr-3 flex items-center justify-center`}>
                          <Check className="w-3 h-3 text-white" />
                        </div>
                        <span className={plan.popular ? "text-gray-100" : "text-gray-700 dark:text-gray-200"}>
                          {feature.name}
                        </span>
                      </motion.li>
                    ))}
        
                    <AnimatePresence>
                      {expandedFeatures && (
                        <>
                          {plan.features.slice(4).map((feature, index) => (
                            <motion.li
                              key={`expanded-${index}`}
                              className="flex items-center"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div
                                className={`w-5 h-5 rounded-full ${plan.iconColor} mr-3 flex items-center justify-center`}
                              >
                                <Check className="w-3 h-3 text-white" />
                              </div>
                              <span className={plan.popular ? "text-gray-100" : "text-gray-700 dark:text-gray-200"}>
                                {feature.name}
                              </span>
                            </motion.li>
                          ))}
                        </>
                      )}
                    </AnimatePresence>
        
                    {plan.features.length > 4 && (
                      <button
                        onClick={() => setExpandedFeatures(!expandedFeatures)}
                        className={`text-sm flex items-center ${
                          plan.popular
                            ? "text-blue-300 hover:text-blue-200"
                            : "text-blue-600 hover:text-blue-700 dark:text-blue-400"
                        }`}
                      >
                        {expandedFeatures ? "Show less" : "Show all features"}
                        <ChevronDown
                          className={`ml-1 w-4 h-4 transition-transform ${expandedFeatures ? "rotate-180" : ""}`}
                        />
                      </button>
                    )}
                  </ul>
        
                  <Button
                    onClick={() => {
                      const periodParam = plan.id === 'pro' ? `&period=${isAnnual ? 'annual' : 'semiannual'}` : '';
                      window.location.href = `/onboarding?plan=${plan.id}${periodParam}`;
                    }}
                    className={`w-full ${plan.buttonColor} text-white rounded-xl py-6 transition-all duration-300 hover:shadow-lg ${plan.shadowColor} ${
                      hoveredPlan === plan.id ? "translate-y-0 shadow-xl" : ""
                    }`}
                  >
                    Subscribe
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Free Account Promotion Box - NEW */}
        <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="rounded-3xl shadow-[0_4px_15px_rgb(0,0,0,0.08)] bg-white overflow-hidden">        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-flex items-center justify-center bg-blue-100 rounded-full px-3 py-1 mb-6">
                  <Users className="w-4 h-4 text-blue-700 mr-2" />
                  <span className="text-xs font-medium text-blue-700">For Consumers</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4">
                  Keep Track of Favorite Brands
                </h2>
                <p className="text-gray-600 mb-6 md:pr-12">
                  Create a free account to track all rewards campaigns from your favorite consumer packaged goods brands.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="bg-blue-100 p-2 rounded-full mr-3 mt-1.5 flex-shrink-0">
                      <Gift className="w-4 h-4 text-blue-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Rewards Campaigns</h3>
                      <p className="text-sm text-gray-600">Track all your entries in one place</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-purple-100 p-2 rounded-full mr-3 mt-1.5 flex-shrink-0">
                      <Users className="w-4 h-4 text-purple-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Influencer Giveaways</h3>
                      <p className="text-sm text-gray-600">Follow your favorite creator's CPG Brand</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-green-100 p-2 rounded-full mr-3 mt-1.5 flex-shrink-0">
                      <BarChart className="w-4 h-4 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Activity Dashboard</h3>
                      <p className="text-sm text-gray-600">View all your participation history</p>
                    </div>
                  </div>
                </div>
                <Link href="/join">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3 px-8 font-medium shadow-lg hover:shadow-blue-300/50 transition-all duration-300 transform hover:-translate-y-1">
                    Create Free Account
                  </Button>
                </Link>
              </div>
              <div className="hidden md:block relative">
              <div className="absolute inset-0">
  <Image
    src={CampaignImage}
    alt="Campaign background"
    fill
    className="object-cover object-center"
    priority
  />
  <div className="absolute inset-0 bg-blue-600/30 bg-opacity-20 backdrop-blur-sm"></div>
</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-2xl max-w-xl">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Gift className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="font-medium text-sm">Rewards Tracker</h3>
                          <p className="text-xs text-gray-500">12 active campaigns</p>
                        </div>
                      </div>
                      <div className="bg-green-100 px-2 py-1 rounded-full ml-3">
                        <span className="text-xs font-medium text-green-700">New</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
  <div key={i} className="p-3 bg-gray-50 rounded-xl">
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full ${
        i === 1 ? 'bg-blue-100' : 
        i === 2 ? 'bg-purple-100' : 
        'bg-emerald-100'
      } flex items-center justify-center`}>
          <Building2 className="w-4 h-4 text-blue-600" />

      </div>
      <div className="ml-3 flex-1">
        <h4 className="text-xs font-medium">Brand Campaign {i}</h4>
        <div className="flex items-center mt-1">
          <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{width: `${i * 25}%`}}></div>
          </div>
          <span className="text-xs text-gray-500 ml-2">{i * 25}%</span>
        </div>
      </div>
    </div>
  </div>
))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Host yours */}
        <div className="flex justify-center py-6 px-4 mt-4">
          <h2 className="text-xl md:text-3xl font-bold text-gray-900">Try your item.</h2>
        </div>

        {showDetails === false ? 
          <div className="flex justify-center ml-4 mr-4 items-center">
          <div className="p-5 bg-white rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-2 text-center">Enter GTIN or any</h2>
            <div className="flex space-x-2">
              <Input 
                value={gtin}
                onChange={handleGtinChange}
                placeholder="Enter GTIN Number"
                className="rounded-xl"
              />
              <Button className="rounded-xl bg-emerald-600 hover:bg-emerald-700" onClick={handleGtinCheck}  >
                <Check className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
          :
          <div className="flex justify-center items-start p-8">
            <div className="flex flex-col md:flex-row w-full max-w-6xl gap-8">
              {/* Left Column */}
              <div className="flex-1 p-6 bg-white rounded-3xl shadow-lg shadow-gray-300">
                <form onSubmit={handleDemoSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="Enter Name" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="description">Description</Label>
                    <Input id="description" name="description" placeholder="Enter Description" onChange={handleInputChange} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="website">Website</Label>
                    <Input id="website" name="website" placeholder="Enter Website URL" onChange={handleInputChange} />
                  </div>
                  {/* Add inside the form, after website input */}
                  <div className="flex items-center space-x-4 mb-4">
                    {socialAccounts.map((account) => (
                      <div
                        key={account.name}
                        className={`flex items-center transition-all duration-300 ease-in-out ${
                          account.isOpen ? 'w-40' : 'w-10'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => toggleSocialInput(account.name)}
                          className={`${account.bgColor} p-2.5 rounded-full text-white hover:opacity-90 transition-opacity relative`}
                        >
                          <account.icon className="w-4 h-4" />
                          {account.username && !account.isOpen && (
                            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                          )}
                        </button>

                        {account.isOpen && (
                          <div className="ml-2 flex-1">
                            <Input
                              value={account.username}
                              onChange={(e) => handleSocialInputChange(account.name, e.target.value)}
                              placeholder="username"
                              className="w-full text-sm h-8"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {isSaved && (
                    <div className="flex justify-start space-x-4 pt-4">
                      <Button 
  variant="outline" 
  onClick={() => {
    const url = `/view?data=${encodeURIComponent(JSON.stringify({
      id: productId,
    }))}`;
    window.open(url, '_blank');
  }}
  className="flex items-center gap-2"
>
  <Eye className="w-5 h-4" />
</Button>
        <Button 
          variant="outline" 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          {/* <Download className="w-4 h-4" /> */}
          QR Code
        </Button>

        {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-80 relative">
          <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">QR Code</h3>
            </div>
          <div className="bg-white rounded-lg flex justify-center">
        <QRCodeSVG
          id="product-qr"
          value={`${typeof window !== 'undefined' ? window.location.origin : ''}${`/view?data=${encodeURIComponent(JSON.stringify({
            id: productId,
          }))}`}`}
          size={200}
          level="M"
          includeMargin={true}
        />
      </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                className="rounded-full"
                onClick={() => setIsOpen(false)}
              >
                Close
              </Button>

              <Button 
          variant="outline" 
          onClick={downloadQRCode}
        >
          Download
        </Button>

            </div>
          </div>
        </div>
      )}

        <Button variant="outline"
        className="bg-cyan-500 hover:bg-cyan-600 text-white flex rounded-full items-center gap-2"
        onClick={copyToClipboard}
                 >
                 <div className="bg-cyan-400/50 text-white flex justify-center items-center rounded-full p-1">
                  {copied ? <span className='px-2'> Copied!</span> :
                   <Share2 className="w-4 h-4" />}
                  </div>
          </Button> 
                    </div>
                  )}
                </form>
              </div>

              {/* Right Column */}
              <div className="flex-1 p-6 bg-white rounded-3xl shadow-lg shadow-gray-300 relative">
                <div className="space-y-4 flex flex-col items-center mb-16">
                  <p className="font-semibold text-lg">GTIN: {gtin}</p>
                  <Label htmlFor="image-upload" className="cursor-pointer block">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {formData.image ? (
                        <Image 
                          src={URL.createObjectURL(formData.image)} 
                          alt="Uploaded image" 
                          layout="fill" 
                          objectFit="fill"
                        />
                      ) : (
                        <ImageUploadIcon className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                  </Label>
                  <Input 
                    id="image-upload" 
                    type="file" 
                    className="hidden" 
                    onChange={handleImageChange}
                    accept="image/*"
                  />
                  {formData.name ? (
                    <p className="font-semibold text-lg">{formData.name}</p>
                  ) : (
                    <Skeleton className="h-4 w-3/4" />
                  )}
                  {formData.description ? (
                    <p className="text-sm text-gray-600">{formData.description}</p>
                  ) : (
                    <Skeleton className="h-4 w-5/6" />
                  )}
                  {formData.website ? (
                    <p className="text-sm text-blue-500 underline">
                      <a href={`https://${formData.website}`} target="_blank" rel="noopener noreferrer">
                        {formData.website}
                      </a>
                    </p>
                  ) : (
                    <Skeleton className="h-4 w-1/2" />
                  )}
                  {/* Add social icons at the bottom */}
                  <div className="mt-2 bottom-16 flex items-center gap-2">
                    {socialAccounts.map((account) => 
                      account.username && (
                        <a
                          key={account.name}
                          href={`${account.urlPrefix}/@${account.username}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${account.bgColor} p-2 rounded-full text-white hover:opacity-80 transition-all duration-200 transform hover:scale-105`}
                        >
                          <account.icon className="w-4 h-4" />
                        </a>
                      )
                    )}
                  </div>
                </div>

                {formData.description && formData.name ?
                <Button 
                onClick={isSaved ? handleUpdateProduct : handleSaveProduct} 
                className={`absolute bottom-6 right-6 ${
                  isSaved && !hasChanges 
                    ? 'bg-green-500 hover:bg-green-600' 
                    : 'bg-cyan-500 hover:bg-cyan-600'
                } rounded-full text-white py-2 px-4 shadow-lg transition duration-300 ease-in-out text-sm`}
                disabled={isSaved && !hasChanges}
              >
                {isSaved ? (hasChanges ? 'Save Changes' : 'Saved') : 'Save'}
              </Button>
              :
              <Button 
                  // onClick={handleDemoSubmit} 
                  className="absolute bottom-6 right-6 bg-cyan-500 hover:bg-cyan-600 rounded-full text-white py-2 px-4 shadow-lg transition duration-300 ease-in-out text-sm cursor-wait"
                  disabled={isSaved}
                >
                  {isSaved ? 'Finish' : 'Finish'}
                </Button>

                }
              </div>
            </div>
          </div>
        }

        {/* Join Mailing List */}
        <div ref={waitlistRef} className="flex items-center justify-center py-20 px-5 ">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-6xl"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Info Box */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-2">Join Our Waitlist</h2>
                <p className="text-indigo-100">Be amongst the first to experience early features</p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-indigo-200 mb-2">Stay updated:</p>
                <div className="flex space-x-2">
                  <a 
                    href="https://x.com/mall_ai" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300 ease-in-out"
                  >
                    <Globe className="w-5 h-5 text-white" />
                  </a>
                  <a 
  href="https://x.com/Amos_JR_" 
  target="_blank" 
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition duration-300 ease-in-out"
>
  <img 
    src="https://cdn.prod.website-files.com/65cb48cde186214fb4069892/65cb48cde186214fb40698f9_64dd5fc29c67de708e82e324_Twitter-icon.svg.png" 
    alt="Twitter Icon" 
    className="w-4 h-4"
  />
</a>
                </div>
              </div>
            </div>
          </div>

          {/* Form Box */}
          <div className="bg-white rounded-3xl shadow-[0_-4px_16px_-8px_rgba(0,0,0,0.08),0_2px_15px_0px_rgba(0,0,0,0.1),0_6px_10px_-3px_rgba(0,0,0,0.06)] overflow-hidden md:col-span-2">
            <div className="p-6 h-full flex flex-col justify-between">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Get Early Access</h3>
                <p className="text-gray-600">Sign up to be notified when we launch and get exclusive early access!</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border-2 border-indigo-100 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    required
                  />
                  {emailError && <p className="mt-2 text-sm text-red-600">{emailError}</p>}
                </div>
                <div className="space-y-4">
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 rounded-2xl transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
                  >
                    {buttonText}
                  </Button>

                </div>
              </form>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Thank You Popup */}
      {showThankYouPopup && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center">
            <h3 className="text-2xl font-bold mb-4">Thank You!</h3>
            <p className="text-gray-600 mb-6">You've successfully joined our waitlist. We'll keep you updated on our progress!</p>
            <Button
              onClick={() => setShowThankYouPopup(false)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 ease-in-out"
            >
              Close
            </Button>
          </div>
        </motion.div>
      )}
    </div>
      </div>
    </div>
  )
}

