
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';
import { ChevronLeft, ChevronRight, QrCode, Share2, ShoppingBag, MapPin, Award, Gift, ExternalLink } from "lucide-react";

// Import real images
import LogoImage from '../login/Images/download.png';
import PoppiLogo from '../login/Images/download.png';
import PoppiStrawberry from '../login/Images/download.png';
import PoppiOrange from '../login/Images/download.png';
import PoppiCherry from '../login/Images/download.png';
import PoppiGrape from '../login/Images/download.png';
import PoppiBackground from '../login/Images/download.png';

export default function ProductDisplay() {
  return (
    <Suspense fallback={<div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>}>
      <ProductContent />
    </Suspense>
  );
}

function ProductContent() {
  const searchParams = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState({
    id: 1,
    name: "Strawberry Lemon",
    category: "Prebiotic Soda",
    description: "The perfect balance of sweet strawberry and tart lemon, with gut-healthy prebiotics and apple cider vinegar.",
    imageSrc: PoppiStrawberry,
    gtin: "850005801221",
    brand: "Poppi", 
    weight: "12 fl oz (355 ml)",
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

  const [showQA, setShowQA] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  const products = [
    {
      id: 1,
      name: "Strawberry Lemon",
      category: "Prebiotic Soda",
      description: "The perfect balance of sweet strawberry and tart lemon, with gut-healthy prebiotics and apple cider vinegar.",
      imageSrc: PoppiStrawberry,
      gtin: "850005801221",
      brand: "Poppi", 
      weight: "12 fl oz (355 ml)",
    },
    {
      id: 2,
      name: "Orange",
      category: "Prebiotic Soda",
      description: "Bright and citrusy orange flavor that's refreshing and functional with prebiotics for gut health.",
      imageSrc: PoppiOrange,
      gtin: "850005801238",
      brand: "Poppi",
      weight: "12 fl oz (355 ml)",
    },
    {
      id: 3,
      name: "Cherry Cola",
      category: "Prebiotic Soda",
      description: "The classic cola taste with a cherry twist, reimagined with prebiotics and less sugar.",
      imageSrc: PoppiCherry,
      gtin: "850005801245",
      brand: "Poppi",
      weight: "12 fl oz (355 ml)",
    },
    {
      id: 4,
      name: "Grape",
      category: "Prebiotic Soda",
      description: "Sweet grape flavor that brings nostalgic soda taste with modern functional benefits.",
      imageSrc: PoppiGrape,
      gtin: "850005801252",
      brand: "Poppi",
      weight: "12 fl oz (355 ml)",
    },
  ];

  useEffect(() => {
    setUrl(window.location.href);
  }, []);

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
    const img = new window.Image();

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

    img.src = url;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
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
              src={PoppiLogo}
              alt="Poppi Logo"
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
                        src={PoppiBackground}
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
                    <div className="relative w-60 h-60 p-4 rounded-full border-2 border-gray-100/30 shadow-[0_2px_8px_rgba(0,0,0,0.06)] bg-transparent">
                      <div className="absolute inset-0 p-8">
                        <div className="w-full h-full relative">
                          <Image
                            src={selectedProduct.imageSrc}
                            alt={selectedProduct.name}
                            className="object-contain cursor-pointer hover:scale-105 transition-transform duration-300"
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
                    className="h-12 px-6 rounded-full border-2 border-pink-500 text-pink-500 bg-pink-50/50 hover:bg-pink-100 transition-all duration-200 group whitespace-nowrap"
                  >
                    <span className="flex items-center gap-3">
                      Product Info
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-200">
                        <ChevronRight className="w-5 h-5 text-pink-500" />
                      </div>
                    </span>
                  </Button>
                </div>
                
                {/* Second Info Button - Desktop only */}
                <div className="hidden h-full lg:flex lg:justify-end lg:absolute lg:top-0 lg:right-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowQA(true)}
                    className="h-12 px-4 rounded-full border-2 border-pink-500 text-pink-500 bg-pink-50/50 hover:bg-pink-100 transition-all duration-200 group whitespace-nowrap"
                  >
                    <span className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center group-hover:bg-pink-200 transition-colors duration-200">
                        <ChevronRight className="w-5 h-5 text-pink-500" />
                      </div>
                    </span>
                  </Button>
                </div>
              </div>

              {/* Purchase Card */}
              <div className="w-full my-8 lg:my-4">
                <Card className="overflow-hidden border border-gray-200 shadow-sm rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">Purchase Options</h3>
                      <span className="text-sm font-medium px-2.5 py-0.5 bg-green-100 text-green-800 rounded-full">In Stock</span>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">Single Can</span>
                        <span className="font-medium">$2.49</span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-600 text-sm">4-Pack</span>
                        <span className="font-medium">$9.99</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">12-Pack</span>
                        <span className="font-medium">$29.99</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button className="w-full h-12 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-sm rounded-xl flex items-center justify-center gap-2">
                        <ShoppingBag className="h-5 w-5" />
                        Buy Now
                      </Button>
                      
                      <div className="pt-3 border-t border-gray-200">
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                          <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                          Available at:
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <div className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full">Target</div>
                          <div className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full">Whole Foods</div>
                          <div className="text-xs px-3 py-1 bg-gray-100 text-gray-800 rounded-full">Walmart</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Connected Media - Hidden on mobile */}
              <div className="hidden lg:flex lg:justify-start scale-75 -mt-4">
                <div className="flex items-center gap-3">
                  <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                  <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                    </svg>
                  </a>
                </div>
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
                        className="object-contain rounded-t-lg p-4"
                        width={200}
                        height={150}
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

          {/* Nutrition Facts */}
          <div className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden max-w-lg mx-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-center mb-4">Nutrition Facts</h2>
              <div className="border-t-2 border-b-8 border-black py-2">
                <div className="text-sm">Serving size 1 can (355ml)</div>
              </div>
              <div className="border-b border-black py-2">
                <div className="font-bold">Calories 20</div>
              </div>
              <div className="border-b border-black py-1">
                <div className="text-right text-sm font-bold">% Daily Value*</div>
              </div>
              <div className="border-b border-black py-2 flex justify-between">
                <div><strong>Total Fat</strong> 0g</div>
                <div className="font-bold">0%</div>
              </div>
              <div className="border-b border-black py-2 flex justify-between">
                <div><strong>Sodium</strong> 10mg</div>
                <div className="font-bold">0%</div>
              </div>
              <div className="border-b border-black py-2 flex justify-between">
                <div><strong>Total Carbohydrate</strong> 4g</div>
                <div className="font-bold">1%</div>
              </div>
              <div className="border-b border-black py-2 pl-4 flex justify-between">
                <div>Dietary Fiber 0g</div>
                <div className="font-bold">0%</div>
              </div>
              <div className="border-b border-black py-2 pl-4 flex justify-between">
                <div>Total Sugars 3g</div>
                <div></div>
              </div>
              <div className="border-b border-black py-2 flex justify-between">
                <div><strong>Protein</strong> 0g</div>
                <div></div>
              </div>
              <div className="py-2 text-sm">
                * The % Daily Value tells you how much a nutrient in a serving of food contributes to a daily diet. 2,000 calories a day is used for general nutrition advice.
              </div>
            </div>
          </div>

          {/* Rewards Section */}
          <div className="w-full border-0 shadow-none lg:mx-auto lg:mt-10 lg:flex lg:items-center lg:justify-center lg:gap-12 lg:p-6 lg:border lg:border-gray-200 lg:shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] lg:rounded-3xl">
            <div className="mt-6 mb-8 w-full">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Earn Rewards with Poppi</h2>
                <p className="text-gray-600 max-w-2xl mx-auto">Collect points with every purchase and unlock exclusive benefits and discounts.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border-2 border-pink-100">
                  <div className="h-2 bg-gradient-to-r from-pink-400 to-orange-400"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <Award className="h-12 w-12 text-pink-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">Poppi Platinum</h3>
                    <p className="text-sm text-gray-600 text-center">Buy 10 packs and get one free at participating retailers</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-pink-500 to-orange-500 h-2.5 rounded-full w-3/4"></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-600">
                        <span>75 points</span>
                        <span>100 points</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border-2 border-pink-100">
                  <div className="h-2 bg-gradient-to-r from-pink-400 to-orange-400"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <Gift className="h-12 w-12 text-pink-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">Exclusive Merch</h3>
                    <p className="text-sm text-gray-600 text-center">Unlock exclusive Poppi merchandise with your rewards points</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-pink-500 to-orange-500 h-2.5 rounded-full w-1/2"></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-600">
                        <span>50 points</span>
                        <span>100 points</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border-2 border-pink-100">
                  <div className="h-2 bg-gradient-to-r from-pink-400 to-orange-400"></div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center mb-4">
                      <ShoppingBag className="h-12 w-12 text-pink-500" />
                    </div>
                    <h3 className="text-lg font-semibold text-center mb-2">Early Access</h3>
                    <p className="text-sm text-gray-600 text-center">Be the first to try new Poppi flavors before they hit stores</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-gradient-to-r from-pink-500 to-orange-500 h-2.5 rounded-full w-1/4"></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-600">
                        <span>25 points</span>
                        <span>100 points</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Connected Media - Mobile only */}
          <div className="mt-4 lg:hidden">
            <div className="flex justify-center scale-75 -mt-4">
              <div className="flex items-center gap-3">
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>
                <a href="#" className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* QR code */}
          <div className="flex justify-center mt-4 sm:mt-4">
            <Button
              variant="ghost"
              size="default"
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 md:h-12 md:w-12 rounded-full bg-gradient-to-br from-pink-400 to-orange-500 p-0 hover:shadow-md shadow-sm border-2 border-white transition-all group"
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
                          ? `/poppi?data=${encodeURIComponent(JSON.stringify({
                        id: selectedProduct.id,
                            }))}`
                          : `/poppi?data=${encodeURIComponent(JSON.stringify({
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
                      className="bg-pink-500 hover:bg-pink-600 text-white flex rounded-full items-center gap-2"
                      onClick={copyToClipboard}
                    >
                      <div className="bg-pink-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
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
              href="https://drinkpoppi.com/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="
                px-6 py-3 
                bg-gradient-to-r from-pink-500 via-orange-400 to-pink-500
                hover:from-pink-600 hover:via-orange-500 hover:to-pink-600
                text-white
                font-medium
                rounded-full
                shadow-[0_0_15px_rgba(236,72,153,0.5)]
                hover:shadow-[0_0_25px_rgba(236,72,153,0.6)]
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
              drinkpoppi.com
            </a>
          </div>

          {/* Fullscreen Image Modal */}
          <Dialog open={showFullImage} onOpenChange={setShowFullImage}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 overflow-hidden rounded-3xl">
              <div className="relative w-full h-[90vh]">
                <Image
                  src={PoppiBackground}
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
                  Poppi Team
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
        <div className="fixed inset-0 z-50 bg-white overflow-y-auto">
          {/* Mock ProductQA Component - in a real implementation you'd create a proper component */}
          <div className="max-w-4xl mx-auto px-4 py-12">
            <div className="flex items-center mb-8">
              <Button
                variant="ghost"
                onClick={() => setShowQA(false)}
                className="mr-2"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold">Product Information</h1>
            </div>
            
            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">About {selectedProduct.name}</h2>
                  <p className="text-gray-700 mb-4">
                    Poppi is a prebiotic soda that combines the classic taste you love with functional benefits. 
                    With only 25 calories and 5g of sugar per can, it's designed to support a healthy gut and 
                    keep your immune system thriving.
                  </p>
                  <p className="text-gray-700">
                    Each can contains Apple Cider Vinegar (ACV) which is known for its digestion and 
                    immunity benefits, along with natural ingredients and prebiotic fiber.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Key Benefits</h2>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">Supports digestive health with prebiotics</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">Only 25 calories per can</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">Contains apple cider vinegar (ACV)</span>
                    </li>
                    <li className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center mt-0.5">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="ml-3 text-gray-700">No artificial ingredients or preservatives</span>
                    </li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                  <p className="text-gray-700 mb-2">
                    Filtered carbonated water, organic cane sugar, strawberry juice concentrate, 
                    lemon juice concentrate, apple cider vinegar, natural flavors, stevia leaf extract.
                  </p>
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Brand Story</h2>
                  <p className="text-gray-700 mb-4">
                    Poppi was created by husband and wife team Stephen and Allison Ellsworth. 
                    Allison had been making her own ACV tonics at home to help with her health issues 
                    when they decided to take the recipe to a local farmers market in Dallas.
                  </p>
                  <p className="text-gray-700">
                    After selling out consistently, they appeared on Shark Tank where they secured a deal, 
                    rebranded to Poppi, and expanded nationwide. The brand is now available in major 
                    retailers across the country.
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <Button
                  onClick={() => setShowQA(false)}
                  className="h-12 px-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Back to Product
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
