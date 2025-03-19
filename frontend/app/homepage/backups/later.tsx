'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Bell, CheckCircle, Clock, Home, Info, PenSquare, Settings, ShoppingBag, Star, Store, User, UserCircle, UserPlus, Users } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

// Brand Logos
import KetoneLogo from "../ketone/Images/Ketonelogo.jpg";
import NutcaseLogo from "../Nutcase/Images/NutcaseLogo.png";
import JoyrideLogo from "../joyride/images/Joyride.png";
import WLogo from "../itscalledw/Images/Wlogo.jpg";

// Product Images
import KetonePeach from "../ketone/Images/ketonePeach.png";
import KetoneBottle from "../ketone/Images/KBottle.png";
import NutcaseVanilla from "../Nutcase/Images/Vanilla.png";
import WYellow from "../itscalledw/Images/YellowW.png";
import JoyrideProduct from "../joyride/images/JoyMain.jpg";

// Campaign Images
import NinjaSkins from '../Nutcase/Components/Thumbnails/NinjaSkins.jpeg';
import JakeGloves from '../itscalledw/Components/Thumbnails/JakeGloves.jpg';
import RyanAir from '../joyride/Components/Thumbnails/RyanAir.jpeg';

export default function RewardsPage() {
  const [activeSidebar, setActiveSidebar] = useState("Rewards");

  const brandLogos = [
    { name: "Ketone", logo: KetoneLogo },
    { name: "Nutcase", logo: NutcaseLogo },
    { name: "W", logo: WLogo },
    { name: "Joyride", logo: JoyrideLogo },
  ];

  const rewardCampaigns = [
    {
      id: 1,
      brand: "Ketone-IQ",
      brandLogo: KetoneLogo,
      title: "Summer Refresh Challenge",
      description: "Collect 5 purchase stamps and unlock exclusive rewards",
      progress: 3,
      total: 5,
      endDate: "July 30, 2023",
      image: KetonePeach,
      rewards: ["$5 Store Credit", "Free Product", "Exclusive Access"]
    },
    {
      id: 2,
      brand: "Nutcase",
      brandLogo: NutcaseLogo,
      title: "Win Ninja's Gaming Setup",
      description: "Upload receipts and win Fortnite skins and gaming gear",
      progress: 2,
      total: 6,
      endDate: "August 15, 2023",
      image: NutcaseVanilla,
      campaignImage: NinjaSkins,
      rewards: ["Fortnite Skins", "Gaming Chair", "Headphones"]
    },
    {
      id: 3,
      brand: "W",
      brandLogo: WLogo,
      title: "Jake Paul Boxing Experience",
      description: "Get a chance to win signed boxing gloves and merch",
      progress: 1,
      total: 4,
      endDate: "September 5, 2023",
      image: WYellow,
      campaignImage: JakeGloves,
      rewards: ["Signed Gloves", "Merchandise", "VIP Access"]
    },
    {
      id: 4,
      brand: "Joyride",
      brandLogo: JoyrideLogo,
      title: "Adventure Package Giveaway",
      description: "Share your Joyride experiences to win travel packages",
      progress: 0,
      total: 5,
      endDate: "October 10, 2023",
      image: JoyrideProduct,
      campaignImage: RyanAir,
      rewards: ["Travel Voucher", "Adventure Gear", "Hotel Credits"]
    }
  ];

  const subscribedBrands = [
    {
      id: 1,
      name: "Ketone-IQ",
      logo: KetoneLogo,
      products: [
        { id: 1, name: "Peach Shot", image: KetonePeach },
        { id: 2, name: "Multi-Serve Bottle", image: KetoneBottle }
      ]
    },
    {
      id: 2,
      name: "Nutcase Milk",
      logo: NutcaseLogo,
      products: [
        { id: 1, name: "Vanilla Protein", image: NutcaseVanilla }
      ]
    },
    {
      id: 3,
      name: "It's Called W",
      logo: WLogo,
      products: [
        { id: 1, name: "Yellow Can", image: WYellow }
      ]
    },
    {
      id: 4,
      name: "Joyride",
      logo: JoyrideLogo,
      products: [
        { id: 1, name: "Original Blend", image: JoyrideProduct }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:block w-64 border-r border-gray-200 bg-white shadow-sm">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800">Rewards</h2>
          <p className="text-sm text-gray-500 mt-1">Track your reward campaigns</p>
        </div>
        
        <nav className="mt-2">
          <div className="px-4 py-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Menu</p>
            <ul className="space-y-1">
              {[
                { name: "Home", icon: Home },
                { name: "Rewards", icon: Star },
                { name: "Brands", icon: Store },
                { name: "Profile", icon: User }
              ].map((item) => (
                <li key={item.name}>
                  <button
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                      activeSidebar === item.name 
                        ? "bg-blue-50 text-blue-600 font-medium" 
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                    onClick={() => setActiveSidebar(item.name)}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="px-4 py-3 mt-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Subscribed Brands</p>
            <ul className="space-y-1">
              {subscribedBrands.map((brand) => (
                <li key={brand.id}>
                  <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100">
                    <div className="relative h-6 w-6 rounded-full overflow-hidden bg-white shadow-sm border border-gray-100">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-cover"
                        sizes="24px"
                      />
                    </div>
                    <span className="truncate">{brand.name}</span>
                  </button>
                </li>
              ))}
              <li>
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-blue-600 hover:bg-blue-50">
                  <UserPlus className="h-5 w-5" />
                  <span>Add more brands</span>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Mobile top nav */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-10">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl font-bold">Rewards</h1>
          <button className="p-2 rounded-full bg-gray-100">
            <User className="h-5 w-5" />
          </button>
        </div>
        <div className="flex border-t border-gray-100">
          {[
            { name: "Home", icon: Home },
            { name: "Rewards", icon: Star },
            { name: "Brands", icon: Store },
            { name: "Profile", icon: UserCircle }
          ].map((item) => (
            <button
              key={item.name}
              className={`flex-1 flex flex-col items-center py-2 ${
                activeSidebar === item.name 
                  ? "text-blue-600" 
                  : "text-gray-500"
              }`}
              onClick={() => setActiveSidebar(item.name)}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:p-8 p-4 md:pt-8 pt-24 pb-20">
        <div className="max-w-6xl mx-auto">
          {activeSidebar === "Rewards" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Active Campaigns</h2>
                <Button variant="outline" className="hidden sm:flex">
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {rewardCampaigns.map((campaign) => (
                  <RewardCard key={campaign.id} campaign={campaign} />
                ))}
              </div>
              
              <div className="mt-12">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">Completed Campaigns</h2>
                </div>
                
                <Card>
                  <CardContent className="p-8 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                      <Star className="h-8 w-8 text-blue-500" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">No completed campaigns yet</h3>
                    <p className="text-gray-500 max-w-md mb-6">
                      Start participating in brand reward campaigns to earn prizes and discounts
                    </p>
                    <Button>
                      Explore Campaigns
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
          
          {activeSidebar === "Brands" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Favorite Brands</h2>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">All Brands</TabsTrigger>
                  <TabsTrigger value="subscribed">Subscribed</TabsTrigger>
                  <TabsTrigger value="campaigns">With Campaigns</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {brandLogos.map((brand) => (
                      <BrandCard key={brand.name} brand={brand} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="subscribed" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {brandLogos.slice(0, 3).map((brand) => (
                      <BrandCard key={brand.name} brand={brand} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="campaigns" className="mt-0">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {brandLogos.slice(0, 2).map((brand) => (
                      <BrandCard key={brand.name} brand={brand} />
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
              
              {/* Product Categories - DO NOT CHANGE as per requirements */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Product Categories</h3>
                <div className="flex space-x-4 overflow-x-auto pb-4">
                  {["Beverages", "Snacks", "Supplements", "Apparel", "Electronics"].map((category) => (
                    <Button key={category} variant="outline" className="whitespace-nowrap">
                      {category}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Featured Products</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { name: "Energy Drink", image: KetonePeach, description: "Boost your energy with this refreshing drink." },
                    { name: "Protein Bar", image: NutcaseVanilla, description: "A healthy and delicious snack." },
                    { name: "Vitamin C Supplement", image: KetoneBottle, description: "Support your immune system." },
                    { name: "Gaming Headset", image: WYellow, description: "Immerse yourself in the game." },
                    { name: "Running Shoes", image: JoyrideProduct, description: "Comfortable and durable for your workouts." },
                    { name: "Smart Watch", image: KetonePeach, description: "Track your fitness and stay connected." },
                  ].map((product) => (
                    <Card key={product.name} className="bg-white shadow-md rounded-lg overflow-hidden">
                      <div className="aspect-w-4 aspect-h-3">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={500}
                          height={375}
                          className="object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <CardTitle className="text-lg font-semibold">{product.name}</CardTitle>
                        <CardDescription className="text-sm text-gray-500">{product.description}</CardDescription>
                        <Button className="mt-4 w-full">View Product</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {activeSidebar === "Profile" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800">Your Profile</h2>
              
              <Card>
                <CardContent className="p-8">
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
                    <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                      <UserCircle className="h-16 w-16 text-blue-500" />
                    </div>
                    
                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <div>
                        <h3 className="text-xl font-bold">Jane Smith</h3>
                        <p className="text-gray-500">jane.smith@example.com</p>
                      </div>
                      
                      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                        <div className="px-4 py-2 bg-gray-100 rounded-lg">
                          <p className="text-xs text-gray-500">Campaigns Joined</p>
                          <p className="text-xl font-bold">4</p>
                        </div>
                        <div className="px-4 py-2 bg-gray-100 rounded-lg">
                          <p className="text-xs text-gray-500">Completed</p>
                          <p className="text-xl font-bold">1</p>
                        </div>
                        <div className="px-4 py-2 bg-gray-100 rounded-lg">
                          <p className="text-xs text-gray-500">Rewards</p>
                          <p className="text-xl font-bold">3</p>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Button variant="outline" size="sm">
                          <PenSquare className="mr-2 h-4 w-4" />
                          Edit Profile
                        </Button>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RewardCard({ campaign }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300">
      <div className="relative h-40 bg-gradient-to-r from-blue-500 to-indigo-600">
        {campaign.campaignImage ? (
          <Image
            src={campaign.campaignImage}
            alt={campaign.title}
            fill
            className="object-cover opacity-70"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-6">
            <Image
              src={campaign.image}
              alt={campaign.title}
              width={100}
              height={140}
              className="object-contain h-28"
            />
          </div>
        )}
        
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/90 px-2 py-1 rounded-full">
          <div className="relative w-5 h-5 rounded-full overflow-hidden">
            <Image
              src={campaign.brandLogo}
              alt={campaign.brand}
              fill
              className="object-cover"
              sizes="20px"
            />
          </div>
          <span className="text-xs font-medium">{campaign.brand}</span>
        </div>
      </div>
      
      <CardContent className="p-5">
        <h3 className="font-bold text-lg mb-1">{campaign.title}</h3>
        <p className="text-sm text-gray-600 mb-3">{campaign.description}</p>
        
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">{campaign.progress} of {campaign.total} collected</span>
            <span className="text-xs font-medium text-amber-600">{Math.round((campaign.progress/campaign.total) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-1.5 rounded-full" 
              style={{ width: `${(campaign.progress/campaign.total) * 100}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>Ends {campaign.endDate}</span>
          </div>
          <Button size="sm" variant="outline" className="text-xs h-8">View Details</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function BrandCard({ brand }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer group">
      <div className="aspect-square relative bg-gray-50 flex items-center justify-center p-6">
        <Image
          src={brand.logo}
          alt={brand.name}
          width={80}
          height={80}
          className="object-contain group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 text-center border-t">
        <h3 className="font-medium text-sm">{brand.name}</h3>
      </div>
    </Card>
  );
}