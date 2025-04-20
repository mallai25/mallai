"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { XCircle, ShoppingBag, AlertTriangle, RefreshCw, Home, HelpCircle } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CancelPage() {
  const router = useRouter()

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
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <motion.div className="w-full max-w-6xl" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Cancel Status */}
          <Card className="overflow-hidden shadow-xl border-0 rounded-2xl h-fit">
            <div className="bg-gradient-to-r from-red-500 to-pink-500 h-24 flex items-center justify-center">
              <div className="bg-white rounded-full p-4 shadow-lg">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
            </div>
            <CardHeader className="text-center pt-6 pb-2">
              <CardTitle className="text-2xl font-bold text-gray-800">Payment Cancelled</CardTitle>
              <p className="text-gray-600 mt-3">Your payment was not completed</p>
            </CardHeader>
            <CardContent className="space-y-6 px-6">
              <motion.div
                variants={itemVariants}
                className="bg-amber-50 rounded-xl p-4 border border-amber-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-amber-100 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  </div>
                  <h3 className="font-medium text-amber-800">Order Status</h3>
                </div>
                <p className="text-gray-600">
                  Your order has been cancelled and no payment has been processed. Your items are still in your cart.
                </p>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 px-6 pb-6">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 w-full"
              >
                <Link href="/join">
                  <ShoppingBag className="mr-2 h-4 w-4" /> Return to Shopping
                </Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Right Column - What Happened */}
          <Card className="overflow-hidden shadow-xl border-0 rounded-2xl h-fit">
            <CardContent className="space-y-6 px-6">
              <motion.div variants={itemVariants} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <p className="text-gray-600 mb-4">
                  When a payment is cancelled, it means the transaction was not completed. This could happen for several
                  reasons:
                </p>
                <ul className="space-y-3 text-gray-600 ml-4">
                  <li className="flex items-start">
                    <div className="bg-red-100 p-1 rounded-full mr-2 mt-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                    </div>
                    <span>You chose to cancel the payment process</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 p-1 rounded-full mr-2 mt-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                    </div>
                    <span>There was an issue with the payment method</span>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-red-100 p-1 rounded-full mr-2 mt-1">
                      <XCircle className="h-3 w-3 text-red-500" />
                    </div>
                    <span>The session timed out during the payment process</span>
                  </li>
                </ul>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <RefreshCw className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-blue-800">What's Next?</h3>
                </div>
                <ul className="space-y-2 text-gray-600 ml-4 list-disc">
                  <li>No charges have been made to your payment method</li>
                  <li>Your cart items have been saved for later</li>
                  <li>You can try again or contact support if you need assistance</li>
                </ul>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
