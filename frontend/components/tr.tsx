'use client';

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, Gift, Award, MessageSquare, BarChart, Globe } from 'lucide-react'
import { motion } from "framer-motion"
import { useState, useRef } from 'react'

export function AdaptHero() {
  const [email, setEmail] = useState('')
  const [buttonText, setButtonText] = useState("Join list")
  const [emailError, setEmailError] = useState<string>('')
  const [showThankYouPopup, setShowThankYouPopup] = useState(false)
  const waitlistRef = useRef<HTMLDivElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    setButtonText("You're on the list!")
    setShowThankYouPopup(true)
  }

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative w-full overflow-hidden">
        <div className="px-4 pt-20 md:px-6 xl:px-8 relative z-10">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Engage Your Audience
                  </h1>
                  <p className="max-w-[600px] text-zinc-500 md:text-xl dark:text-zinc-400">
                    Create powerful campaigns, connect with your audience, and drive results with our platform.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    Get Started
                  </Button>
                  <Button variant="outline">Learn More</Button>
                </div>
              </div>
              <div className="flex justify-center lg:justify-end">
                <div className="w-full max-w-[500px] overflow-hidden rounded-xl">
                  <Image
                    src="/hero-image.jpg"
                    alt="Hero"
                    width={500}
                    height={500}
                    className="object-cover w-full aspect-square"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-12 md:px-6 xl:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Build a Community</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Create and nurture a vibrant community around your brand.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Grow Engagement</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Increase engagement and interaction with your audience.
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 p-4 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-blue-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold">Drive Sales</h3>
              <p className="text-zinc-500 dark:text-zinc-400">
                Convert engagement into sales and business growth.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* New Rewards Campaign Tracking Box */}
      <div className="px-4 py-12 md:px-6 xl:px-8 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="mx-auto max-w-6xl">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Track Your Rewards & Campaigns</h2>
                <p className="text-zinc-600 mb-6">
                  Create a free account to keep track of rewards campaigns from consumer packaged goods brands, 
                  influencer giveaways, and exclusive polls.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Gift className="w-5 h-5 text-blue-600" />
                    </div>
                    <span>Access exclusive rewards campaigns</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <Award className="w-5 h-5 text-purple-600" />
                    </div>
                    <span>Participate in influencer giveaways</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <MessageSquare className="w-5 h-5 text-green-600" />
                    </div>
                    <span>Vote in product polls and surveys</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-amber-100 p-2 rounded-full">
                      <BarChart className="w-5 h-5 text-amber-600" />
                    </div>
                    <span>All your activities in one dashboard</span>
                  </div>
                </div>
                <div className="mt-8">
                  <Link href="/join">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-6 h-auto font-medium text-base">
                      Create Free Account
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 md:p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 translate-y-1/2 blur-xl"></div>
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <h3 className="text-2xl font-bold mb-6">Your Benefits</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Easy access to all your favorite brand campaigns</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Track your participation and increase your chances of winning</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Search activities from your favorite CPG brands</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="bg-white/20 p-1 rounded-full mt-0.5">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span>Be the first to know about exclusive product launches</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Join Mailing List */}
      <div ref={waitlistRef} className="flex items-center justify-center py-16 px-5">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
  )
}