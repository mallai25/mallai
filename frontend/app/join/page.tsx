'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ArrowLeft, ChevronRight, Gift, User, Upload, Check, ArrowRight, Package, BarChart, QrCode, PodcastIcon } from 'lucide-react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

// Import images
import LogoImage from '../login/Images/download.png';
import HeroImage from '../login/Images/cpg.jpg';

import { InfluencerDialog } from './Components/InfluencerDialog';
import { ProductDetailDialog } from './Components/ProductDetailDialog';
import { productData, influencers } from './mockdata';

export default function JoinPage() {
  const router = useRouter();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [selectedCategory, setSelectedCategory] = useState('Prelim');

  const [showInfluencerDialog, setShowInfluencerDialog] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [currentProductPage, setCurrentProductPage] = useState(0);
  const PRODUCTS_PER_PAGE = 4;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      if (userCredential.user) {
        const userRef = doc(FIREBASE_DB, 'users', userCredential.user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // Update login count
          // This is just to simulate, we're not actually updating the doc
          console.log('User logged in successfully');
        } 
        
        // Redirect to the homepage after successful login
        router.push('/homepage');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        // Create user document in Firestore
        await setDoc(doc(FIREBASE_DB, 'users', userCredential.user.uid), {
          displayName: name,
          email: userCredential.user.email,
          userType: 'consumerBase',
          createdAt: new Date(),
          loginCount: 1,
          lastLogin: new Date()
        });

        // Redirect to homepage after successful registration
        router.push('/homepage');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInfluencerClick = (influencer) => {
    const matchingInfluencer = influencers.find(inf => inf.name === influencer.name);
    setSelectedInfluencer(matchingInfluencer);
    setShowInfluencerDialog(true);
  };

  const handleProductQRClick = (product) => {
    setSelectedProduct(product);
    setShowProductDialog(true);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Centered */}
      <header className="w-full bg-white py-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center px-4">
          <div className="flex items-center gap-6 justify-center w-full">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Image
                  src={LogoImage}
                  alt="Logo"
                  width={40}
                  height={40}
                  className="object-contain rounded-lg"
                />
                <span className="text-xl font-semibold text-zinc-800">Mall AI</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-10 flex justify-center overflow-hidden">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex items-center">
            <div className="w-full space-y-4">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Easy Tracking
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-lg transition-all">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-5xl font-bold leading-tight tracking-tight"
                >
                  Track Your{" "}
                  <span className="text-[#4147d5]">Brand Rewards</span> In One Place
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-base md:text-xl leading-relaxed mt-4"
                >
                  Stay connected with your favorite influencer brands, participate in exclusive polls, and unlock special giveaways.
                </motion.p>
              </div>

              {/* Hide on mobile, show on medium screens and up */}
              <div className="hidden md:block py-3">
                </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">

                <div className="hidden sm:block relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-white"></div>
                  <div className="relative">
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full animate-pulse">
                          <PodcastIcon className="w-5 h-5 text-green-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Subscribe Brands</p>
                          <p className="text-xs text-gray-500">Follow up with brands</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-white"></div>
                  <div className="relative">
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-pink-100 p-2 rounded-full animate-pulse">
                          <QrCode className="w-5 h-5 text-pink-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Brand Polls</p>
                          <p className="text-xs text-gray-500">Vote on new items</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Cards - Desktop Version */}
              <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-8">
                <div></div>

                <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                  <div className="flex-1 min-w-[240px]">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full ring-2 ring-blue-100 animate-pulse">
                          <BarChart className="w-5 h-5 text-blue-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Track Activity</p>
                          <p className="text-xs text-gray-500">See participations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[240px]">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full ring-2 ring-purple-100 animate-pulse">
                          <Gift className="w-5 h-5 text-purple-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Giveaways</p>
                          <p className="text-xs text-gray-500">Win prizes</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[240px]">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full ring-2 ring-green-100 animate-pulse">
                          <Package className="w-5 h-5 text-green-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Products</p>
                          <p className="text-xs text-gray-500">Latest releases</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Feature Boxes - Mobile Version */}
<section className="md:hidden px-4 bg-white">
  <div className="max-w-7xl mx-auto">
    <div className="space-y-6">
      {/* Box 1 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white rounded-2xl border border-gray-100">
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl inline-block shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Subscribe Brands</h3>
                <p className="text-gray-600 leading-relaxed">Follow your favorite brands.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Box 2 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white rounded-2xl border border-gray-100">
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl inline-block shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Join Campaigns</h3>
                <p className="text-gray-600 leading-relaxed">Participate in reward campaigns.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Box 3 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white rounded-2xl border border-gray-100">
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-5">
              <div className="flex-shrink-0">
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl inline-block shadow-md"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="20" x2="12" y2="10"></line>
                    <line x1="18" y1="20" x2="18" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="16"></line>
                  </svg>
                </motion.div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Vote in Polls</h3>
                <p className="text-gray-600 leading-relaxed">Shape products with exclusive polls.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  </div>
</section>

            </div>
          </div>
        </div>
      </section>

                
      {/* Login/Register Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
  <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-2xl">
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
      {/* Left side - Image */}
      <div className="hidden md:block relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 z-10" />
        <Image
          src={HeroImage}
          alt="Login"
          fill
          className="object-cover"
        />
      </div>

      {/* Right side - Form */}
      <div className="p-6 md:p-8 bg-white flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          
          {/* Header */}
          <div className="mb-8 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-gray-600 text-sm">
              {isLogin 
                ? 'Sign in to access your rewards and campaigns' 
                : 'Join to track your participation in rewards campaigns'}
            </p>
          </div>
          
          {/* Form */}
          <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <Input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={!isLogin}
                  className="h-12 pl-12 w-full bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                  <User className="w-4 h-4" />
                </div>
              </div>
            )}
            
            <div className="relative group">
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 pl-12 w-full bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </div>
            </div>

            <div className="relative group">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 pl-12 w-full bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
              />
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-medium transition-all duration-200"
              disabled={loading}
            >
              {loading 
                ? <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>{isLogin ? 'Signing in...' : 'Creating account...'}</span>
                  </div>
                : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>

            <div className="text-center mt-6">
            <div className="text-center mt-6">
  <p className="text-gray-600 text-sm">
    {isLogin ? "Don't have an account?" : "Already have an account?"}
    <button 
      type="button"
      onClick={() => setIsLogin(!isLogin)} 
      className="ml-2 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-sm px-1"
    >
      {isLogin ? "Create one" : "Sign in"}
      <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">
        →
      </span>
    </button>
  </p>
</div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>

      <div className="w-full flex justify-center mt-12">
      <Button 
  onClick={() => setShowLoginDialog(true)}
  className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-3xl px-6 py-4 text-lg shadow-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 flex items-center"
>
  Get Started
  <div className="bg-blue-400/50 text-white ml-2 flex justify-center items-center rounded-full p-1.5">
    <ArrowRight className="w-4 h-4" />
  </div>
</Button>
      </div>

      {/* Discover Amazing Products Section */}
      <section className="py-16 bg-white mt-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative">
        <div className="absolute -top-16 -left-20 w-64 h-64 bg-blue-300 rounded-full opacity-5 animate-pulse"></div>
        <div className="absolute top-40 -right-20 w-64 h-64 bg-yellow-300 rounded-full opacity-5 animate-pulse" style={{ animationDelay: '3s' }}></div>
        
          <div className="text-center w-full mx-auto mb-10 z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-gray-900">
              Discover Amazing Products
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with your favorite brands and discover products curated just for you.
            </p>
          </div>

          {/* Product Categories */}
          <div className="relative">
  <ScrollArea className="w-full">
    <div className="flex justify-start sm:justify-center px-4 sm:px-0 mb-4 overflow-x-auto">
      <div className="flex space-x-2 min-w-max scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {['Prelim', 'Beverage', 'Coffee', 'Candy', 'Personal Care', 'Alcohol', 'Supplements'].map((category) => (
          <motion.div
            key={category}
            className="flex-none first:ml-0"
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant={category === selectedCategory ? 'default' : 'outline'} 
              className={`whitespace-nowrap rounded-full px-4 sm:px-5 text-sm sm:text-base h-9 sm:h-10 ${
                category === selectedCategory 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                  : 'hover:bg-gray-100 text-gray-800 border-gray-200'
              } transition-all duration-200`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
    <ScrollBar 
      orientation="horizontal" 
      className="sm:hidden" // Show scrollbar only on mobile
    />
  </ScrollArea>
</div>
          
          {/* Product Cards */}
          <div className="flex justify-center mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full px-4 sm:px-0 max-w-7xl">
              {productData
                .filter(product => {
                  if (selectedCategory === 'Prelim') return true;
                  return product.category.toLowerCase() === selectedCategory.toLowerCase();
                })
                .slice(
                  currentProductPage * PRODUCTS_PER_PAGE,
                  (currentProductPage + 1) * PRODUCTS_PER_PAGE
                )
                .map((product) => (
                  <div key={product.id} className="group w-full max-w-full sm:w-[280px] mx-auto">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center relative">
                        <Image
                          src={product.imageSrc}
                          alt={product.name}
                          width={160}
                          height={160}
                          className="object-contain cursor-pointer group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.influencer && (
                          <button
                            onClick={() => handleInfluencerClick(product.influencer)}
                            className="absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 shadow-md"
                          >
                            <Image
                              src={product.influencer.image}
                              alt={product.influencer.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </button>
                        )}
                      </div>
                      <div className="py-2 px-4">
                        <div className="flex justify-end">
                          <div>
                            <h3 className="font-bold text-lg">{product.brand}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1 line-clamp-2">{product.category}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="text-lg font-bold">{product.price}</span>
                            <span className="text-sm text-gray-500 ml-1">
  {product.brand === "ItsCalledW" ? "/stick" : 
   product.brand === "Ketone-IQ" ? "/serving" :
   product.category === "Beverage" ? "/pack" : "/bag"}
</span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="rounded-full text-xs">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-[950px] p-0 rounded-lg">
                              <ScrollArea className="h-[84vh] p-4 rounded-md">
                                <div className="mt-5 p-0 sm:p-1">
                                  <DialogHeader className="mb-4 sm:mb-6">
                                    <div className="sm:flex sm:items-center">
                                      <div className="sm:flex-auto">
                                        <DialogTitle className="text-lg sm:text-xl">{product.name} Overview</DialogTitle>
                                        <DialogDescription className="text-sm">
                                          Product details and variations
                                        </DialogDescription>
                                      </div>
                                      <div className="mt-4 sm:ml-16 sm:mt-0">
                                        <div className="bg-indigo-50 p-3 sm:p-3 rounded-full flex justify-between items-center border border-indigo-100">
                                          <h4 className="font-medium text-sm sm:text-base text-indigo-900 mr-8">Total</h4>
                                          <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full w-8 h-8">
                                            <p className="text-md sm:text-md font-bold text-indigo-700">
                                              {product.similarProducts.length}
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
                                            const container = document.getElementById(`product-carousel-${product.id}`);
                                            if (container) container.scrollLeft -= container.offsetWidth / 2;
                                          }}
                                        >
                                          <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
                                        </button>

                                        <div 
                                          id={`product-carousel-${product.id}`}
                                          className="flex overflow-x-auto sm:overflow-x-hidden scroll-smooth px-0 sm:px-0 gap-3 sm:gap-6 snap-x snap-mandatory sm:snap-none pb-4 sm:pb-0 -mx-2 sm:mx-0"
                                        >
                                          {product.similarProducts.map((item: any) => (
                                            <div key={item.id} className="flex-none w-[80%] sm:w-1/3 snap-center first:ml-2 sm:first:ml-0">
                                              <div className="border border-gray-100 rounded-xl p-3 hover:border-blue-200 transition-colors group/card">
                                                <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                                                  <div className="absolute inset-0 duration-300 z-10"></div>
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
                                                      src={item.imageUrl}
                                                      alt={item.name}
                                                      layout="fill"
                                                      objectFit="cover"
                                                      className="object-contain transform scale-75 group-hover/card:scale-90 transition-transform duration-300 ease-in-out"
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
                                            const container = document.getElementById(`product-carousel-${product.id}`);
                                            if (container) container.scrollLeft += container.offsetWidth / 2;
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
                    </div>
                  </div>
                ))}
            </div>
          </div>

  {/* Add pagination */}
  {Math.ceil(productData.filter(product => {
    if (selectedCategory === 'Prelim') return true;
    return product.category.toLowerCase() === selectedCategory.toLowerCase();
  }).length / PRODUCTS_PER_PAGE) > 1 && (
    <div className="flex justify-center mt-8 space-x-1">
      {Array.from({
        length: Math.ceil(
          productData.filter(product => {
            if (selectedCategory === 'Prelim') return true;
            return product.category.toLowerCase() === selectedCategory.toLowerCase();
          }).length / PRODUCTS_PER_PAGE
        )
      }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentProductPage(idx)}
          className={`w-2 h-2 rounded-full transition-all ${
            idx === currentProductPage ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-blue-400'
          }`}
        />
      ))}
    </div>
  )}
          
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">
            Ready to Join the Community?
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Create your free account today and start tracking your favorite campaigns.
          </p>
          <Button 
            onClick={() => setShowLoginDialog(true)}
            className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-3xl shadow-lg h-12 px-8 text-lg font-medium"
          >
            Create Account
          </Button>
        </div>
      </section>

      <InfluencerDialog
        influencer={selectedInfluencer}
        open={showInfluencerDialog}
        onOpenChange={setShowInfluencerDialog}
      />

      <ProductDetailDialog
        product={selectedProduct}
        open={showProductDialog}
        onOpenChange={setShowProductDialog}
      />
    </div>
  );
}