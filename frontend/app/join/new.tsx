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
import { Label } from "@/components/ui/label"

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

  const [selectedCategory, setSelectedCategory] = useState('All');

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
      <section className="py-8 md:py-12 flex justify-center overflow-hidden">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2 space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
                </svg>
                Easy Tracking
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
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
            </div>

            <div className="w-full md:w-1/2 space-y-4 mt-8 md:mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-green-400"></div>
                  <div className="relative">
                    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
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

                <div className="relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-pink-400"></div>
                  <div className="relative">
                    <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-pink-100 p-2 rounded-full animate-pulse">
                          <QrCode className="w-5 h-5 text-pink-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Scan QR</p>
                          <p className="text-xs text-gray-500">Scan product QR codes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <div className="w-full px-4 py-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4 p-1">
            {['All', 'Food & Beverage', 'Fashion', 'Electronics', 'Beauty', 'Sports'].map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`rounded-full px-4 py-2 text-sm ${
                  selectedCategory === category 
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {productData.map((product, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-0">
                <div className="relative h-48 w-full">
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-600 font-medium">{product.price}</span>
                    <Button
                      onClick={() => handleProductQRClick(product)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Login Dialog */}
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold mb-4">
              {isLogin ? 'Welcome Back!' : 'Create Account'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button
              onClick={isLogin ? handleSignIn : handleSignUp}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Processing...
                </div>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </Button>
            <p className="text-center text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-blue-600 hover:underline font-medium"
              >
                {isLogin ? 'Create one' : 'Sign in'}
              </button>
            </p>
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
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="text-center w-full mx-auto mb-10 z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-gray-900">
              Discover Amazing Products
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Browse through our curated selection of products and earn rewards for your participation.
            </p>
          </div>

          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productData
                .filter(product => {
                  if (selectedCategory === 'All') return true;
                  return product.category.toLowerCase() === selectedCategory.toLowerCase();
                })
                .slice(currentProductPage * PRODUCTS_PER_PAGE, (currentProductPage + 1) * PRODUCTS_PER_PAGE)
                .map((product, index) => (
                  <Card 
                    key={index} 
                    className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                  >
                    <CardContent className="p-0">
                      <div className="relative h-48">
                        <Image
                          src={product.imageSrc}
                          alt={product.name}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                        <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                        <div className="flex justify-between items-center">
                          <span className="text-blue-600 font-medium">{product.price}</span>
                          <Button
                            onClick={() => handleProductQRClick(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            {/* Pagination */}
            {Math.ceil(productData.filter(product => {
              if (selectedCategory === 'All') return true;
              return product.category.toLowerCase() === selectedCategory.toLowerCase();
            }).length / PRODUCTS_PER_PAGE) > 1 && (
              <div className="flex justify-center mt-8 space-x-1">
                {Array.from({
                  length: Math.ceil(
                    productData.filter(product => {
                      if (selectedCategory === 'All') return true;
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
        </div>
      </section>

      {/* Product Detail Dialog */}
      <ProductDetailDialog
        open={showProductDialog}
        onOpenChange={setShowProductDialog}
        product={selectedProduct}
      />

      {/* Influencer Dialog */}
      <InfluencerDialog
        open={showInfluencerDialog}
        onOpenChange={setShowInfluencerDialog}
        influencer={selectedInfluencer}
      />
    </div>
  );
}