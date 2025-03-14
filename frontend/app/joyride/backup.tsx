'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Voting } from "./Components/Voting";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Link from 'next/link';
import LogoImage from '../../components/Images/download.png';
import JoyRide from './images/Joyride.png';
import { ProductQA } from './Components/ProductQA';
import { Rewards } from './Components/Rewards';
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import ImageJoy from '@/components/Images/rfront.png';
import ImageJoyBack from '@/components/Images/rback.png';
import BlueImage from '@/components/Images/blue.png';
import GreenImage from '@/components/Images/green.png';
import YellowImage from '@/components/Images/yellow.png';
import { ConnectMedia } from './Components/MediaAccount';
import { ProductCard } from '@/components/product-card';
import FunImage from './images/JoyMain.jpg'

export default function ProductDisplay() {
  const [selectedProduct, setSelectedProduct] = useState({
    id: 1,
    name: "Sour Strawberry Strips",
    catergory: "JoyRide Candy Strips",
    description: "A punch of sour, a burst of berry",
    imageSrc: ImageJoy,
    hoverImageSrc: ImageJoyBack,
    gtin: "0123456789123",
    brand: "JoyRide Candy Co.", 
    weight: "32g (1.13 oz)",
    calories: 120,
    sugar: 4,
    netCarbs: 9,
  });

  const [showNutritionModal, setShowNutritionModal] = useState(false);
  const [showQA, setShowQA] = useState(false);

  const products = [
    {
      id: 2,
      name: "Blue Raspberry Strips",
      catergory: "JoyRide Candy Strips",
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
      id: 2,
      name: "Yellow Lemon Strips",
      catergory: "JoyRide Candy Strips",
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
      id: 3,
      name: "Green Apple Strips",
      catergory: "JoyRide Candy Strips",
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
    {
      id: 4,
      name: "Sour Strawberry Strips",
      catergory: "JoyRide Candy Strips",
      description: "A punch of sour, a burst of berry",
      imageSrc: ImageJoy,
      hoverImageSrc: ImageJoyBack,
      gtin: "0123456789123",
      brand: "JoyRide Candy Co.", 
      weight: "32g (1.13 oz)",
      calories: 120,
      sugar: 4,
      netCarbs: 9,
    },
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {!showQA ? (
        <div className="max-w-7xl mx-auto space-y-8">
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
            <Link href="/">
              <button className="p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow bg-white">
                <ChevronLeft className="w-4 h-4" />
              </button>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center relative min-h-[400px] flex flex-col items-center justify-center">
            <div className="absolute -top-20 right-0 w-24 h-16">
              <Image
                src={JoyRide}
                alt="Logo"
                className="object-contain"
                fill
              />
            </div>

            {/* Center Image */}
            <div className="relative w-64 h-64 p-4 rounded-full border-4 border-gray-200 shadow-lg">
              <div className="absolute inset-0 p-8">
                <div className="w-full h-full relative">
                  <Image
                    src={selectedProduct.imageSrc}
                    alt={selectedProduct.name}
                    className="object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Info Button - Absolute positioned on desktop, relative on mobile */}
            <div className="md:absolute md:left-[calc(50%+180px)] md:top-1/2 md:-translate-y-1/2 mt-6 md:mt-0">
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

            <div className="mt-6">
              <h1 className="text-3xl font-bold text-gray-900 text-center mb-3">{selectedProduct.name}</h1>
              <p className="text-lg text-gray-600 text-center max-w-2xl mb-0">{selectedProduct.description}</p>
            </div>
          </div>

          {/* Product Purchase Card */}
          <div className="w-full flex justify-center my-4">
            <ProductCard
              name={selectedProduct.name}
              description={selectedProduct.description}
              storeLocations={[
                { name: "Main Store", address: "123 Main St" },
                { name: "Downtown", address: "456 Market St" }
              ]}
            />
          </div>

          {/* Similar Products */}
          <ScrollArea className="w-full whitespace-nowrap rounded-xl">
            <div className="flex justify-center">
              <div className="flex gap-3">
                {products.map((product) => (
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

          {/* Product Details and Nutrition Facts Box */}
          <div className=" mt-8 bg-white flex overflow-hidden justify-center">
            <ScrollArea className="border shadow-sm rounded-xl w-full sm:max-w-lg">
              <div className="p-6">
                <div className="flex flex-row space-x-6">
                  {/* Nutrition Facts */}
                  <div className="flex-1">
                    <h2 className="text-lg font-medium text-gray-900 mb-4 text-center">Nutrition Facts</h2>
                    <div className="space-y-6">
                      {/* Calories Pie Chart */}
                      <div className="relative w-32 h-32 mx-auto">
                        <svg className="w-full h-full" viewBox="0 0 100 100">
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#e2e8f0"
                            strokeWidth="10"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="10"
                            strokeDasharray={`${(selectedProduct.calories / 200) * 283} 283`}
                            transform="rotate(-90 50 50)"
                            className="transition-all duration-1000 ease-out"
                          />
                          <text
                            x="50"
                            y="45"
                            textAnchor="middle"
                            className="text-2xl font-bold"
                            fill="#10b981"
                          >
                            {selectedProduct.calories}
                          </text>
                          <text
                            x="50"
                            y="65"
                            textAnchor="middle"
                            className="text-xs"
                            fill="#64748b"
                          >
                            calories
                          </text>
                        </svg>
                      </div>

                      {/* Nutrition Stats */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-xl p-3 text-center">
                          <p className="text-sm font-medium text-blue-600 mb-1">Sugar</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedProduct.sugar}g</p>
                          <p className="text-xs text-gray-500">per serving</p>
                        </div>
                        <div className="bg-purple-50 rounded-xl p-3 text-center">
                          <p className="text-sm font-medium text-purple-600 mb-1">Net Carbs</p>
                          <p className="text-lg font-semibold text-gray-900">{selectedProduct.netCarbs}g</p>
                          <p className="text-xs text-gray-500">per serving</p>
                        </div>
                        <div className="bg-emerald-50 rounded-xl p-3 text-center col-span-2">
                          <p className="text-sm font-medium text-emerald-600 mb-1">Fiber</p>
                          <p className="text-lg font-semibold text-gray-900">8g</p>
                          <p className="text-xs text-gray-500">29% daily value</p>
                        </div>
                      </div>

                      <div className="flex justify-center mt-6">
                  <Button 
                    variant="outline" 
                    className="
                      px-8 
                      py-2.5 
                      rounded-full 
                      shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                      hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                      transition-all 
                      duration-200 
                      border-2 
                      border-emerald-500/50
                      text-emerald-600 
                      bg-gradient-to-r 
                      from-emerald-50/50 
                      to-emerald-100/50
                      hover:from-emerald-50 
                      hover:to-emerald-100
                      hover:border-emerald-400
                      hover:text-emerald-500
                      font-medium
                      text-sm
                    "
                    onClick={() => setShowNutritionModal(true)}
                  >
                    More Details
                  </Button>
                </div>

                      <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.brand}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Category</h3>
                        <p className="mt-1 text-sm text-gray-900">{selectedProduct.catergory}</p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Weight</h3>
                        <span className="mt-1 sm:mt-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                32g (1.13 oz)
                         </span>
                      </div>
                    </div>
                    </div>
                  </div>
              </div>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>

          {/* Nutrition Modal */}
          <Dialog open={showNutritionModal} onOpenChange={setShowNutritionModal}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col
            overflow-y-auto pr-10 -mr-6 space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
              <DialogHeader className="flex-none">
                <DialogTitle className="text-2xl font-bold text-center mb-2">
                  Nutrition Facts
                </DialogTitle>
                <DialogDescription className="text-center text-gray-600">
                  {selectedProduct.name}
                </DialogDescription>
              </DialogHeader>

              <div className="mt-6 flex-1">
                {/* Serving Size Info */}
                <div className="border-b border-gray-200 pb-4">
                  <h3 className="text-lg font-semibold mb-2">Serving Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-sm text-gray-600">Serving Size</p>
                      <p className="text-lg font-medium">{selectedProduct.weight}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-sm text-gray-600">Servings </p>
                      <p className="text-lg font-medium">1 Packet</p>
                    </div>
                  </div>
                </div>

                {/* Main Nutrients */}
                <div className="space-y-6 mt-2">
                  <h3 className="text-lg font-semibold">Amount Per Serving</h3>
                  
                  {/* Calories Section */}
                  <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                        <span className="text-emerald-600 font-semibold">{selectedProduct.calories}</span>
                      </div>
                      <div>
                        <p className="font-medium">Calories</p>
                        <p className="text-sm text-gray-600">2% Daily Value*</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">From Fat</p>
                      <p className="font-medium">0g</p>
                    </div>
                  </div>

                  {/* Nutrients Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Fat</span>
                        <span>0g</span>
                      </div>
                      <div className="flex justify-between items-center pl-4 text-gray-600">
                        <span>Saturated Fat</span>
                        <span>0g</span>
                      </div>
                      <div className="flex justify-between items-center pl-4 text-gray-600">
                        <span>Trans Fat</span>
                        <span>0g</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total Carbs</span>
                        <span>{selectedProduct.netCarbs}g</span>
                      </div>
                      <div className="flex justify-between items-center pl-4 text-gray-600">
                        <span>Dietary Fiber</span>
                        <span>8g</span>
                      </div>
                      <div className="flex justify-between items-center pl-4 text-gray-600">
                        <span>Total Sugar</span>
                        <span>{selectedProduct.sugar}g</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-gray-50 p-4 rounded-xl mt-4 space-y-2">
                  <h4 className="font-medium">Key Benefits</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Low in sugar ({selectedProduct.sugar}g per serving)</li>
                    <li>• Good source of fiber (29% daily value)</li>
                    <li>• No artificial sweeteners or preservatives</li>
                    <li>• Made with natural, plant-based ingredients</li>
                  </ul>
                </div>

                <div className="text-xs text-gray-500 pt-4">
                  Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
                </div>
              </div>

              
            </DialogContent>
          </Dialog>

          {/* Rewards Section */}
          <div className="mt-8 mb-8">
            <Rewards />
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
          <div className="mt-12">
            <div className="flex justify-center scale-75 -mt-4">
              <ConnectMedia logoOnly={true} />
            </div>
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
                backdrop-blur-sm
                hover:backdrop-blur-lg
                flex items-center gap-2
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
  );
}
