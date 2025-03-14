'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react'
import axios from 'axios'; // Add this import

import { ChevronLeft, ChevronRight, Lock, QrCode, Share2 } from "lucide-react";
import { ProductQA } from '../Components/DefaultQA';
import { ConnectMedia } from '../Components/MediaAccount';
import { ProductCard } from '../Components/EmptyCart';
import { FIREBASE_DB, FIREBASE_AUTH } from '../../FirebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import mallLogo from './Images/download.png';

// Add this new Loading component
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

export default function ProductDisplay() {
  return (
    <Suspense fallback={<div></div>}>
      <ProductContent />
    </Suspense>
  );
}

function ProductContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const searchParams = useSearchParams();
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [productImage, setProductImage] = useState<string | null>(null);

  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const [selectedProduct, setSelectedProduct] = useState({
    id: 1,
    name: "",
    category: "",
    description: "",
    image: productImage,
    backgroundImage: backgroundImage,
    gtin: "",
    brand: "", 
    socialAccounts: [],
    website: "",
    claimedListing: false,
    isTemporary: false, // Add this property
    imageUrl: "", // Add this field
    backgroundImageUrl: "", // Add this field
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData, {
       
      });

      if (response.data.success) {
        return response.data.data.secure_url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleProductImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      
      if (imageUrl && selectedProduct.id) {
        // Update Firebase
        const docRef = doc(FIREBASE_DB, 'products', selectedProduct.id.toString());
        await updateDoc(docRef, {
          imageUrl: imageUrl,
          imageName: file.name
        });

        // Update local state
        setProductImage(imageUrl);
        setSelectedProduct(prev => ({
          ...prev,
          imageUrl: imageUrl
        }));
      }
    } catch (error) {
      console.error('Error handling product image upload:', error);
    } finally {
    }
  };

  const handleBackgroundImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      
      if (imageUrl && selectedProduct.id) {
        // Update Firebase
        const docRef = doc(FIREBASE_DB, 'products', selectedProduct.id.toString());
        await updateDoc(docRef, {
          backgroundImageUrl: imageUrl,
          backgroundImageName: file.name
        });

        // Update local state
        setBackgroundImage(imageUrl);
        setSelectedProduct(prev => ({
          ...prev,
          backgroundImageUrl: imageUrl
        }));
      }
    } catch (error) {
      console.error('Error handling background image upload:', error);
    } finally {
    }
  };

  useEffect(() => {
    const fetchProductData = async () => {
      const data = searchParams.get('data');
      if (!data) return;

      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        
        // If we have a product ID, fetch from Firestore
        if (decodedData.id) {
          const docRef = doc(FIREBASE_DB, 'products', decodedData.id);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const productData = docSnap.data();

            setSelectedProduct({
              id: decodedData.id || 1,
              name: productData.name || "",
              category: productData.category || "",
              description: productData.description || "",
              image: productData.productImage || null,
              backgroundImage: productData.backgroundImage || null,
              gtin: productData.gtin || "",
              brand: productData.brand || "",
              socialAccounts: productData.socialAccounts || [],
              website: productData.website || "",
              claimedListing: productData.claimedListing || false,
              isTemporary: productData.isTemporary || false,
              imageUrl: productData.imageUrl || "", // Store the Cloudinary URL
              backgroundImageUrl: productData.backgroundImageUrl || "", // Add this line
            });

            // Set images if they exist
            if (productData.imageUrl) {
              setProductImage(productData.imageUrl);
            }
            if (productData.backgroundImageUrl) { // Update this condition
              setBackgroundImage(productData.backgroundImageUrl);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    };

    fetchProductData();
  }, [searchParams]);

  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

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

    const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset copied state after 2 seconds
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  // Add this function to scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
    {isLoading ? (
      <LoadingSpinner />
    ) : (
       <div className=" bg-white py-12 px-4 sm:px-6 lg:px-8">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleProductImageUpload}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={backgroundInputRef}
        onChange={handleBackgroundImageUpload}
        accept="image/*"
        className="hidden"
      />
      {!showQA ? (
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="fixed top-4 left-8 z-50 flex items-center gap-3">
            {selectedProduct.claimedListing && !selectedProduct.isTemporary ? (
              <div className="mr-2 mt-1">
                <Image
                  src={mallLogo}
                  alt="Logo"
                  width={32}
                  height={32}
                  className="object-contain rounded-xl bg-white"
                />
              </div>
            ) : (!selectedProduct.claimedListing && selectedProduct.isTemporary) ? (
              <Button
                variant="outline"
                className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-blue-500/20 border-none shadow-[0_2px_15px_-3px_rgba(81,89,255,0.2)] hover:shadow-[0_3px_20px_-3px_rgba(81,89,255,0.3)]"
                onClick={() => window.location.href = `/login?productId=${selectedProduct.id}&action=claim`}
              >
                Claim
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:shadow-blue-500/20 border-none shadow-[0_2px_15px_-3px_rgba(81,89,255,0.2)] hover:shadow-[0_3px_20px_-3px_rgba(81,89,255,0.3)]"
                onClick={() => window.location.href = '/login'}
              >
                Sign In
              </Button>
            )}
            <Link href="/">
              <button className="p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Main Content Container */}
          <div className="w-full border-0 shadow-none lg:max-w-4xl lg:mx-auto lg:mt-10 lg:flex lg:items-center lg:gap-12 lg:p-6 lg:border lg:border-gray-200 lg:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] lg:rounded-3xl">
            {/* Left Section - Image and Social Media */}
            <div className="lg:flex-1 lg:max-w-sm lg:flex lg:flex-col">
              {/* Image Section */}
              <div className="text-center relative min-h-[320px] lg:min-h-[280px] flex flex-col items-center justify-center">
                {/* Main Product Image */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="absolute w-72 h-64 group">
                    {/* Background Image */}
                    <div className="absolute inset-0 w-full h-64">
                    {selectedProduct.backgroundImageUrl ? (
            <>
              <Image
                src={selectedProduct.backgroundImageUrl}
                alt="background"
                className="w-full h-full object-cover rounded-full"
                fill
                sizes="100vw"
                priority
              />
              <button
                onClick={() => setShowFullImage(true)}
                className="absolute bottom-2 left-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors duration-200 flex items-center gap-2 scale-90"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                </svg>
              </button>
            </>
          ) : (
            <button
              onClick={() => backgroundInputRef.current?.click()}
              className="absolute bottom-2 left-2 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors duration-200 flex items-center gap-2 scale-90"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                <path d="M12 12v9"/>
                <path d="m16 16-4-4-4 4"/>
              </svg>
            </button>
          )}
                    </div>
                  </div>
                  <div className="mt-2">
                                          <div className="relative w-60 h-60 p-4 rounded-full border-2 border-gray-100/30 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-transparent ">
                                            <div className="absolute inset-0 p-8">
                                              <div className="w-full h-full relative">
                                                {selectedProduct.imageUrl ? (
                                                  <Image
                                                    src={selectedProduct.imageUrl}
                                                    alt={selectedProduct.name}
                                                    className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 50vw"
                                                    priority
                                                  />
                                                ) : (
                                                  <button
                                                    onClick={() => fileInputRef.current?.click()}
                                                    className="w-full h-full rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                                                  >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                                                      <path d="M12 12v9"/>
                                                      <path d="m16 16-4-4-4 4"/>
                                                    </svg>
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                </div>
              </div>
            </div>

            {/* Right Section - Content */}
            <div className="lg:flex-1 lg:flex lg:flex-col lg:items-center lg:justify-center lg:space-y-6">
              {/* Description and AI content */}
              <div className="relative w-full">
                {/* Product Info */}
                <div className="text-center lg:text-left rounded-2xl w-full px-2 mb-6 lg:pr-16">
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{selectedProduct.name}</h1>
                  <p className="text-lg text-gray-600 lg:max-w-[calc(100%-4rem)] mb-0">{selectedProduct.description}</p>
                </div>

                {/* Info Button - Mobile only */}
                <div className="flex justify-center lg:hidden mt-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQA(true);
                      scrollToTop();
                    }}
                    className="h-12 px-6 rounded-full border-2 border-emerald-500 text-emerald-500 bg-emerald-50/50 hover:bg-emerald-100 transition-all duration-200 group whitespace-nowrap"
                  >
                    <span className="flex items-center gap-3">
                      Product Info
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
                        <ChevronRight className="w-5 h-5 text-emerald-500" />
                      </div>
                    </span>
                  </Button>
                </div>
                
                {/* Second Info Button - Desktop only */}
                <div className="hidden h-full lg:flex lg:justify-end lg:absolute lg:top-0 lg:right-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowQA(true);
                      scrollToTop();
                    }}
                    className="h-12 px-4 rounded-full border-2 border-emerald-500 text-emerald-500 bg-emerald-50/50 hover:bg-emerald-100 transition-all duration-200 group whitespace-nowrap"
                  >
                    <span className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors duration-200">
                        <ChevronRight className="w-5 h-5 text-emerald-500" />
                      </div>
                    </span>
                  </Button>
                </div>
              </div>

              {/* Purchase Card */}
                            <div className="w-full my-8 lg:my-4">
                              <ProductCard
                                name={selectedProduct.name}
                                description={selectedProduct.description}
                                storeLocations={[
                                  { name: "Main Store", address: "123 Main St" },
                                  { name: "Downtown", address: "456 Market St" }
                                ]}
                              />
                            </div>

              {/* Connected Media */}
              {selectedProduct.socialAccounts && selectedProduct.socialAccounts.length > 0 && (
  <div className="flex justify-center scale-75 -mt-4">
    <ConnectMedia logoOnly={true} socialAccounts={selectedProduct.socialAccounts} />
  </div>
)}

              {/* Bottom Section - Only visible on mobile */}
              <div className="space-y-6 mt-6 lg:hidden">
                {/* QR Code and Website */}
                <div className="flex flex-col items-center space-y-6">
                  {/* QR Code Button */}
                  <div className="flex justify-center">
                  <Button
  variant="ghost"
  size="default"
  onClick={() => setIsOpen(true)}
  className="h-14 w-14 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 p-0 hover:shadow-md shadow-sm border-2 border-white transition-all group"
>
  <QrCode className="h-14 w-14 md:h-12 md:w-12 text-white group-hover:scale-110 transition-transform" />
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
                              value={`${typeof window !== 'undefined' ? window.location.origin : ''}${
                                selectedProduct.id === 1 
                                  ? `/view?data=${encodeURIComponent(JSON.stringify({
                                id: selectedProduct.id,
                                  name: selectedProduct.name,
                                  description: selectedProduct.description,
                                  socialAccounts: selectedProduct.socialAccounts,
                                  website: selectedProduct.website,
                                  // backImage: backgroundImage,
                                  // productImage: productImage,
                                    }))}`
                                  : `/view?data=${encodeURIComponent(JSON.stringify({
                                      id: selectedProduct.id,
                                        name: selectedProduct.name,
                                        description: selectedProduct.description,
                                        socialAccounts: selectedProduct.socialAccounts,
                                        website: selectedProduct.website,
                                        // backImage: backgroundImage,
                                        // productImage: productImage,
                                    }))}`
                              }`}

                              size={200}
                              level="M"
                              includeMargin={true}
                            />
                          </div>
                          
                          <div className="flex justify-center mt-1 gap-2">
                            <Button 
                              variant="outline" 
                              onClick={downloadQRCode}
                            >
                              Download
                            </Button>
                          </div>
                          <div className="flex justify-between mt-4">
                            <Button
                              variant="outline"
                              className="rounded-full"
                              onClick={() => setIsOpen(false)}
                            >
                              Close
                            </Button>
                            <Button variant="outline"
                              className="bg-cyan-500 hover:bg-cyan-600 text-white flex rounded-full items-center gap-2"
                              onClick={copyToClipboard}
                            >
                              <div className="bg-cyan-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
                                <Share2 className="w-4 h-4" />
                              </div>
                              {copied ? 'Copied!' : 'Share'}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Website URL */}
                <div className="flex justify-center w-full max-w-lg">
                  {selectedProduct.website !== "" && (
                    <a 
                      href={selectedProduct.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="
                px-6 py-3 
bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400
text-white
font-medium
rounded-full
shadow-[0_0_15px_rgba(59,130,246,0.5)]
hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
border border-white/20
transition-all duration-300 ease-out
transform hover:-translate-y-0.5
w-full sm:max-w-lg
backdrop-blur-[1px]
hover:backdrop-blur-[2px]
flex items-center gap-2
justify-center
animate-shimmer
              "
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite'
                      }}
                    >
                       <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-5 h-5"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
                      {selectedProduct.website}
                    </a>
                  )}
                </div>
                </div>
              </div>
            </div>
          </div>

          {/* Desktop QR Code and Website Section */}
          <div className="hidden lg:flex lg:flex-col lg:items-center lg:mt-8 lg:space-y-6">
            {/* QR Code Button */}
            <div className="flex justify-center">
            <Button
  variant="ghost"
  size="default"
  onClick={() => setIsOpen(true)}
  className="h-14 w-14 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 p-0 hover:shadow-md shadow-sm border-2 border-white transition-all group"
>
  <QrCode className="h-14 w-14 md:h-12 md:w-12 text-white group-hover:scale-110 transition-transform" />
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
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}${
                          selectedProduct.id === 1 
                            ? `/view?data=${encodeURIComponent(JSON.stringify({
                          id: selectedProduct.id,
                            name: selectedProduct.name,
                            description: selectedProduct.description,
                              }))}`
                            : `/view?data=${encodeURIComponent(JSON.stringify({
                                id: selectedProduct.id,
                                  name: selectedProduct.name,
                                  description: selectedProduct.description,
                              }))}`
                        }`}

                        size={200}
                        level="M"
                        includeMargin={true}
                      />
                    </div>
                    
                    <div className="flex justify-center mt-1 gap-2">
                      <Button 
                        variant="outline" 
                        onClick={downloadQRCode}
                      >
                        Download
                      </Button>
                    </div>
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() => setIsOpen(false)}
                      >
                        Close
                      </Button>
                      <Button variant="outline"
                        className="bg-cyan-500 hover:bg-cyan-600 text-white flex rounded-full items-center gap-2"
                        onClick={copyToClipboard}
                      >
                        <div className="bg-cyan-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
                          <Share2 className="w-4 h-4" />
                        </div>
                        {copied ? 'Copied!' : 'Share'}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Website URL */}
            <div className="flex justify-center w-full max-w-lg">
                  {selectedProduct.website !== "" && (
                    <a 
                      href={selectedProduct.website} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className=" cursor-pointer
                        px-6 py-3 
                        bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500
                        hover:from-cyan-400 hover:via-blue-400 hover:to-purple-400
                        text-white
                        font-medium
                        rounded-full
                        shadow-[0_0_15px_rgba(59,130,246,0.5)]
                        hover:shadow-[0_0_25px_rgba(59,130,246,0.6)]
                        border border-white/20
                        transition-all duration-300 ease-out
                        transform hover:-translate-y-0.5
                        w-full sm:max-w-lg
                        backdrop-blur-[1px]
                        hover:backdrop-blur-[2px]
                        flex items-center gap-2
                        justify-center
                        animate-shimmer
                      "
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 2s linear infinite'
                      }}
                    >
                       <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                className="w-5 h-5"
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
              </svg>
                      {selectedProduct.website}
                    </a>
                  )}
                </div>
            
          </div>

          {/* Fullscreen Image Modal */}
          <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden rounded-3xl">
            <div className="relative w-full h-[90vh]">
            {selectedProduct.backgroundImageUrl && (
                <Image
                  src={selectedProduct.backgroundImageUrl}
                  alt="Full size image"
                  className="object-contain rounded-3xl"
                  fill
                  sizes="90vw"
                  priority
                />
              )}
            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-white p-3 rounded-2xl transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <button
              onClick={() => backgroundInputRef.current?.click()}
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
              Change
            </button>
          </div>
            </DialogContent>
          </Dialog>

          <style jsx>{`
            @keyframes shimmer {
              0% {
                background-position: 0% 50%;
              }
               100% {
                background-position: 200% 50%;
              }
            }
          `}</style>

        </div>
      ) : (
        <ProductQA onBack={() => setShowQA(false)} />
      )}
    </div>
    )}
    </>
   
  );
}


// {/* Header - Image Section */}
// <div className="lg:flex-1 lg:max-w-sm">
// <div className="text-center relative min-h-[320px] flex flex-col items-center justify-center">
//   {/* Main Product Image */}
//   <div className="relative z-10 flex flex-col items-center">
//     <div className="absolute w-60 h-60 group">
//       {/* Background Image */}
//       <div className="absolute inset-0 w-full h-60">
//         {/* <Lock className="w-full h-full text-gray-600" /> */}
//         <button
//           onClick={() => setShowFullImage(true)}
//           className="absolute z-10 bg-black/50 hover:bg-black/70 text-white p-1.5 rounded-full transition-colors duration-200 flex items-center gap-2 scale-90"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//             <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
//           </svg>
//         </button>
//       </div>
//     </div>
//     <div className="mt-2">
//     <div className="relative w-60 h-60 rounded-full border-2 border-gray-100 bg-transparent ">
//         <div className="relative w-full h-full">
//           {/* Round box with locked icon */}
//           <div className="absolute inset-0 bg-gray-200 rounded-full flex items-center justify-center">
//             <Lock className="w-32 h-32 text-gray-600" />
//           </div>
          
//           {/* Round Sign Up button overlay */}
//           <a 
//             href="/" 
//             className="absolute inset-0 bg-cyan-500 bg-opacity-70 hover:bg-opacity-80 transition-opacity duration-300 rounded-full flex items-center justify-center"
//           >
//             <span className="text-white text-2xl font-bold tracking-wide">Sign Up</span>
//           </a>
//         </div>
//       </div>
//     </div>
//   </div>
// </div>
// </div>