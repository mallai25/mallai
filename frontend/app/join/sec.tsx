
'use client';

import { useState } from 'react';
import { DiscoverProducts } from "./Components/DiscoverProducts";
import Image from 'next/image';
import { PodcastIcon, QrCode, BarChart, Gift, Package } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white pb-16">
      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-blue-50 opacity-70"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-50 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-100 rounded-full opacity-50 blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
                  Discover and Connect with Your Favorite Brands
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl">
                  Join brand communities, participate in exclusive polls, and earn rewards from the products you love.
                </p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-green-400 sm:block hidden"></div>
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

                <div className="relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-pink-400 sm:block hidden"></div>
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

              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
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
            </div>
            
            {/* Animated Images */}
            <div className="relative h-[400px] hidden lg:block">
              <div className="absolute top-0 right-0 w-64 h-64 animate-float-slow">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/app/home/Images/Rewards.jpg" 
                    alt="Rewards Program" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-semibold">Loyalty Rewards</h3>
                      <p className="text-sm opacity-90">Earn points with every purchase</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-20 left-0 w-56 h-56 animate-float-medium">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/app/home/Images/polls.jpg" 
                    alt="Brand Polls" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-semibold">Brand Polls</h3>
                      <p className="text-sm opacity-90">Vote on upcoming products</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 right-20 w-60 h-60 animate-float-fast">
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
                  <Image 
                    src="/app/home/Images/influence.jpg" 
                    alt="Brand Influence" 
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                    <div className="p-4 text-white">
                      <h3 className="text-lg font-semibold">Brand Influence</h3>
                      <p className="text-sm opacity-90">Shape the future of products</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Three Feature Boxes */}
      <section className="px-4 sm:px-6 lg:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-4 p-3 bg-blue-100 rounded-2xl inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Connect with Brands</h3>
                  <p className="text-gray-600 mb-4">Follow your favorite brands and get notified about new products and campaigns.</p>
                  <div className="w-10 h-1 bg-blue-500 rounded-full transform transition-all duration-300 group-hover:w-20"></div>
                </div>
              </CardContent>
            </Card>
            
            {/* Box 2 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-4 p-3 bg-purple-100 rounded-2xl inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Join Campaigns</h3>
                  <p className="text-gray-600 mb-4">Participate in limited-time reward campaigns and earn points for prizes.</p>
                  <div className="w-10 h-1 bg-purple-500 rounded-full transform transition-all duration-300 group-hover:w-20"></div>
                </div>
              </CardContent>
            </Card>
            
            {/* Box 3 */}
            <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <CardContent className="p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10">
                  <div className="mb-4 p-3 bg-green-100 rounded-2xl inline-block">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="20" x2="12" y2="10"></line>
                      <line x1="18" y1="20" x2="18" y2="4"></line>
                      <line x1="6" y1="20" x2="6" y2="16"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Vote in Polls</h3>
                  <p className="text-gray-600 mb-4">Shape the future of your favorite products by voting in exclusive brand polls.</p>
                  <div className="w-10 h-1 bg-green-500 rounded-full transform transition-all duration-300 group-hover:w-20"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <DiscoverProducts />
    </div>
  );
}