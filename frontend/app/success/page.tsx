"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { FIREBASE_DB } from "../../FirebaseConfig"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, ShoppingBag, ArrowLeft, Package, Truck, Clock, Home, CreditCard } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [orderDetails, setOrderDetails] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const sessionId = searchParams.get("session_id")
        const orderId = searchParams.get("order_id")

        if (!orderId) {
          setError("Order ID not found")
          setLoading(false)
          return
        }

        // Get order details from Firebase
        const orderRef = doc(FIREBASE_DB, "orders", orderId)
        const orderSnap = await getDoc(orderRef)

        if (orderSnap.exists()) {
          const orderData = orderSnap.data()

          // Update order status to completed
          await updateDoc(orderRef, {
            status: "completed",
            completedAt: new Date().toISOString(),
            paymentSessionId: sessionId,
          })

          // Clear the cart after successful payment
          localStorage.removeItem("cart")
          window.dispatchEvent(new Event("cartUpdated"))

          setOrderDetails(orderData)
        } else {
          setError("Order not found")
        }
      } catch (error) {
        console.error("Error fetching order details:", error)
        setError("Failed to fetch order details")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto"></div>
          <p className="mt-6 text-gray-600 font-medium">Processing your order...</p>
          <p className="text-gray-500 text-sm mt-2">This will only take a moment</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4">
        <Card className="w-full max-w-md shadow-2xl border-0 rounded-2xl">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto bg-red-100 p-4 rounded-full w-20 h-20 flex items-center justify-center mb-4 shadow-md">
              <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <CardTitle className="text-2xl text-red-600">Error Processing Order</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-6">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <Button
              onClick={() => router.push("/join")}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full px-8 py-6 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 text-base"
            >
              <Home className="h-5 w-5" /> Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

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
    <div className="min-h-screen bg-white py-12 px-4">
      <motion.div className="max-w-6xl mx-auto" initial="hidden" animate="visible" variants={containerVariants}>
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Order Status and Summary */}
          <Card className="overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border-0 rounded-2xl h-fit">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-28 flex items-center justify-center">
              <div className="bg-white rounded-full p-5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.2)]">
                <CheckCircle className="h-12 w-12 text-emerald-500" />
              </div>
            </div>
            <CardHeader className="text-center pt-6 pb-2">
              <CardTitle className="text-3xl font-bold text-gray-800">Order Successful!</CardTitle>
              <p className="text-gray-600 mt-2">Thank you for your purchase</p>
            </CardHeader>
            <CardContent className="space-y-6 px-6 sm:px-8">
              <motion.div
                variants={itemVariants}
                className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 shadow-[0_4px_12px_rgba(0,0,0,0.05)]"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-emerald-100 p-2.5 rounded-full shadow-sm">
                    <Clock className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-medium text-emerald-800 text-lg">Order Status</h3>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-gray-600">Current Status</span>
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 px-3 py-1 shadow-sm">
                    Completed
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Order Date</span>
                  <span className="font-medium">{formatDate(orderDetails?.createdAt || new Date())}</span>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="border-t border-gray-200 pt-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-purple-100 p-2.5 rounded-full shadow-sm">
                    <Truck className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-lg">Shipping Information</h3>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100">
                  <p className="text-gray-600">Your order will be processed and shipped within 1-2 business days.</p>
                  <p className="text-gray-600 mt-3">
                    You will receive a shipping confirmation email with tracking information once your order ships.
                  </p>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="border-t border-gray-200 pt-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2.5 rounded-full shadow-sm">
                    <CreditCard className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-800 text-lg">Payment Information</h3>
                </div>
                <div className="bg-white p-5 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Payment Method</span>
                    <span className="font-medium">Credit Card</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment Status</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-3 py-1 shadow-sm">Paid</Badge>
                  </div>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="text-center text-gray-500 text-sm mt-4 pt-4 border-t border-gray-200"
              >
                <p>Order ID: {searchParams.get("order_id")}</p>
                <p className="mt-1">Need help? Contact our support team.</p>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 px-6 sm:px-8 pb-8">
              <Button
                asChild
                className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-full px-8 py-6 shadow-[0_10px_25px_-5px_rgba(16,185,129,0.3)] hover:shadow-[0_20px_25px_-5px_rgba(16,185,129,0.4)] transition-all duration-300 w-full sm:w-auto text-base font-medium"
              >
                <Link href="/join">
                  <ShoppingBag className="mr-2 h-5 w-5" /> Continue Shopping
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/join")}
                className="rounded-full border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition-all duration-300 w-full sm:w-auto py-6 text-base font-medium shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="mr-2 h-5 w-5" /> Return to Home
              </Button>
            </CardFooter>
          </Card>

          {/* Right Column - Order Summary */}
          <Card className="overflow-hidden shadow-[0_20px_60px_-15px_rgba(0,0,0,0.15)] border-0 rounded-2xl h-fit">
            <CardHeader className="pb-2 pt-6 px-6 sm:px-8">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-2.5 rounded-full shadow-sm">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                </div>
                <CardTitle className="text-xl text-gray-800">Order Summary</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 px-6 sm:px-8">
              <motion.div variants={itemVariants} className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {orderDetails?.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)] transition-all duration-300"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 h-16 w-16 rounded-lg flex items-center justify-center shadow-sm">
                        {item.imageUrl ? (
                          <img
                            src={item.imageUrl || "/placeholder.svg"}
                            alt={item.name}
                            className="h-12 w-12 object-contain"
                          />
                        ) : (
                          <Package className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-base">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.brand} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-base">
                        ${(Number.parseFloat(String(item.price).replace("$", "")) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={itemVariants} className="border-t border-gray-200 pt-5">
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${orderDetails?.total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">${(orderDetails?.total * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center py-4 border-t border-gray-200 mt-2">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-emerald-600">
                    ${(orderDetails?.total + orderDetails?.total * 0.08).toFixed(2)}
                  </span>
                </div>
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="bg-gray-50 p-5 rounded-xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-emerald-100 p-2 rounded-full mt-0.5">
                    <CheckCircle className="h-4 w-4 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800 mb-1">Order Confirmation</h4>
                    <p className="text-sm text-gray-600">
                      A confirmation email has been sent to your email address. Please check your inbox.
                    </p>
                  </div>
                </div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
