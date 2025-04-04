'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Voting } from "./Components/Voting";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react'

import LogoImage from '../../components/Images/download.png';
import JoyRide from './images/Joyride.png';
import { ProductQA } from './Components/ProductQA';
import { Rewards } from './Components/Rewards';
import { ChevronLeft, ChevronRight, ArrowLeft, QrCode, Share2 } from "lucide-react";
import ImageJoy from '@/components/Images/rfront.png';
import BlueImage from '@/components/Images/blue.png';
import GreenImage from '@/components/Images/green.png';
import YellowImage from '@/components/Images/yellow.png';
import FunImage from './images/JoyMain.jpg'
// import FunImage from './images/FunMain.jpg';
import { ConnectMedia } from './Components/MediaAccount';
import { ProductCard } from '@/components/product-card';

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
    <Suspense fallback={<div>...</div>}>
      <ProductContent />
    </Suspense>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const [selectedProduct, setSelectedProduct] = useState({
    id: 1,
    name: "Sour Strawberry Strips",
    category: "JoyRide Candy Strips",
    description: "A punch of sour, a burst of berry",
    imageSrc: ImageJoy,
    gtin: "844911008768",
    brand: "JoyRide Candy Co.", 
    weight: "32g (1.13 oz)",
    calories: 120,
    sugar: 4,
    netCarbs: 9,
  });

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(data));
        setSelectedProduct(prev => ({
          ...prev,
          ...decodedData
        }));
      } catch (error) {
        console.error('Error parsing QR code data:', error);
      }
    }
  }, [searchParams]);

  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showQA, setShowQA] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  const products = [
    {
      id: 1,
      name: "Sour Strawberry Strips",
      category: "JoyRide Candy Strips",
      description: "A punch of sour, a burst of berry",
      imageSrc: ImageJoy,
      gtin: "844911008768",
      brand: "JoyRide Candy Co.", 
      weight: "32g (1.13 oz)",
      calories: 120,
      sugar: 4,
      netCarbs: 9,
      },
    {
      id: 2,
      name: "Blue Raspberry Strips",
      category: "JoyRide Candy Strips",
      description: "Sweet and tangy blue raspberry flavor with the perfect balance of sour.",
      imageSrc: BlueImage,
      hoverImageSrc: BlueImage,
      gtin: "0123456789125",
      brand: "JoyRide Candy Co.",
      weight: "32g (1.13 oz)",
      calories: 120,
      sugar: 4,
      netCarbs: 9,
      },
    {
      id: 3,
      name: "Yellow Lemon Strips",
      category: "JoyRide Candy Strips",
      description: "Zesty lemon flavor that'll make your taste buds dance.",
      imageSrc: YellowImage,
      hoverImageSrc: YellowImage,
      gtin: "0123456789124",
      brand: "JoyRide Candy Co.",
      weight: "32g (1.13 oz)",
      calories: 120,
      sugar: 4,
      netCarbs: 9,
      },
    {
      id: 4,
      name: "Green Apple Strips",
      category: "JoyRide Candy Strips",
      description: "Crisp green apple flavor with a sour kick.",
      imageSrc: GreenImage,
      hoverImageSrc: GreenImage,
      gtin: "0123456789126",
      brand: "JoyRide Candy Co.",
      weight: "32g (1.13 oz)",
      calories: 120,
      sugar: 4,
      netCarbs: 9,
      },
  ];

    // Add loading timer effect
    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
  
      return () => clearTimeout(timer);
    }, []);

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

  return (
    <>
    {isLoading ? (
      <LoadingSpinner />
    ) : (
      <div className="bg-white py-12 px-4 sm:px-6 lg:px-8">
      {!showQA ? (
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <div className="fixed top-4 left-8 z-50 flex items-center gap-2">
            <div className="mr-2 mt-1">
              <Image
                src={LogoImage}
                alt="Logo"
                width={32}
                height={32}
                className="object-contain rounded-xl bg-white"
              />
            </div>
            <Link href="/join">
              <button className="p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </Link>
          </div>

          <div className="absolute top-2 right-4 w-24 h-16">
              <Image
                src={JoyRide}
                alt="Logo"
                className="object-contain"
                fill
              />
            </div>

          {/* Main Content Container */}
          <div className="w-full border-0 shadow-none lg:max-w-5xl lg:mx-auto lg:mt-10 lg:flex lg:items-center lg:gap-12 lg:p-6 lg:border lg:border-gray-200 lg:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] lg:rounded-3xl">
            {/* Left Section - Image and Social Media */}
            <div className="lg:flex-1 lg:max-w-sm lg:flex lg:flex-col">
              {/* Image Section */}
              <div className="text-center relative min-h-[320px] lg:min-h-[280px] flex flex-col items-center justify-center">
                <div className="relative z-10 flex flex-col items-center">
                  
                      <div className="absolute w-72 h-64 group">
                        <div className="absolute inset-0 w-full h-64">
                          <Image
                            src={FunImage}
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
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="relative w-60 h-60 p-4 rounded-full border-2 border-gray-100/30 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-transparent ">
                          <div className="absolute inset-0 p-8">
                            <div className="w-full h-full relative">
                              <Image
                                src={selectedProduct.imageSrc}
                                alt={selectedProduct.name}
                                className="object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                </div>
              </div>
            </div>

            {/* Right Section - Content */}
            <div className="lg:flex-1 lg:flex lg:flex-col lg:items-center lg:justify-center">
              
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
                    onClick={() => setShowQA(true)}
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
                    onClick={() => setShowQA(true)}
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

              {/* Connected Media - Hidden on mobile */}
              <div className="hidden lg:flex lg:justify-start scale-75 -mt-4">
                <ConnectMedia logoOnly={true} />
              </div>
            </div>
          </div>

          {/* Similar Products */}
          <ScrollArea className="w-full whitespace-nowrap rounded-xl pb-3 lg:mt-10">
            <div className="flex justify-center">
              <div className="flex gap-3">
                {products.filter(product => selectedProduct && product.id !== selectedProduct.id).map((product) => (
                  <Card 
                    key={product.id}
                    className="w-[200px] shrink-0 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => {
                      setSelectedProduct(product);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                  >
                    <div className="relative aspect-[4/3] pt-2">
                      <Image
                        src={product.imageSrc}
                        alt={product.name}
                        className="object-cover rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, 200px"
                      />
                    </div>
                    <div className="p-3">
                      <h3 className="font-semibold text-base mb-0.5 line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
             {/* Fullscreen Image Modal */}
          <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
          <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden rounded-3xl">
          <div className="relative w-full h-[90vh]">
            <Image
              src={FunImage}
              alt="Full size image"
              className="object-contain rounded-3xl"
              fill
              sizes="90vw"
              priority
            />
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
              className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-black p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            >
              Ryan Trahan
            </button>
          </div>
          </DialogContent>
        </Dialog>

          {/* Rewards Section */}
          <div className="w-full border-0 shadow-none lg:mx-auto lg:mt-10 lg:flex lg:items-center lg:justify-center lg:gap-12 lg:p-6 lg:border lg:border-gray-200 lg:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] lg:rounded-3xl">
          <div className="mt-2 mb-6">
            <Rewards />
            </div>
          </div>

          {/* Comparison Polls */}
          <div className="mt-8">
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex w-max space-x-4 p-4">
                <Voting />
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Connected Media */}
          <div className="mt-4 lg:hidden">
  <div className="flex justify-center scale-75 -mt-4">
    <ConnectMedia logoOnly={true} />
  </div>
</div>

          {/* QR code */}
          <div className="flex justify-center mt-4 sm:mt-4">
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
              ? `/product?data=${encodeURIComponent(JSON.stringify({
            id: selectedProduct.id,
                }))}`
              : `/product?data=${encodeURIComponent(JSON.stringify({
                  id: selectedProduct.id,
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
          <div className="flex justify-center items-center mt-6 mb-8">
            <a 
              href="https://www.joyridesweets.com/" 
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
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10z"/>
              </svg>
              joyridesweets.com
            </a>
          </div>

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