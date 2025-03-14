
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { useRouter } from 'next/navigation';
import LogoImage from '../login/Images/download.png';
import { Search, Sparkles, Twitter, Globe, Check, Eye, Download, Share2, Facebook, Instagram, Youtube,
Shield, Zap, ChevronDown  } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion";
   

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


export default function NewUserPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

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

  // Check if user is authenticated
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        // If not authenticated, redirect to login
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Handle plan selection
  const handleSelectPlan = (plan: string, period: string = 'semiannual') => {
    router.push(`/onboarding?plan=${plan}&period=${period}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <header className="backdrop-blur-lg bg-white/70 py-4 border-b border-gray-100">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image 
              className="w-8 h-8 md:w-10 md:h-10 rounded-xl"
              height="40" 
              src={LogoImage}
              alt="Mall AI Logo" 
              width={40} 
            />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Mall AI
            </span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Pricing Section */}
                <div className="dark:from-gray-950 dark:to-gray-900">
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
      </main>
    </div>
  );
}
