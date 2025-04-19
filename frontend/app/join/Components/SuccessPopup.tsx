"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle } from "lucide-react"
import Image from "next/image"

interface SuccessPopupProps {
  open: boolean
  onClose: () => void
  orderDetails: any
}

export function SuccessPopup({ open, onClose, orderDetails }: SuccessPopupProps) {
  if (!orderDetails) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-6 rounded-2xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600 mb-6">
            Thank you for your purchase. A confirmation email has been sent to {orderDetails.customerEmail}.
          </p>

          <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-medium">{orderDetails.orderId.substring(0, 12)}...</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{new Date(orderDetails.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total:</span>
                <span className="font-medium">${orderDetails.total.toFixed(2)}</span>
              </div>
            </div>

            {orderDetails.items && orderDetails.items.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-medium text-gray-900 mb-2">Items</h3>
                <div className="space-y-3">
                  {orderDetails.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center">
                      <div className="relative h-10 w-10 rounded overflow-hidden bg-gray-100 mr-3">
                        <Image
                          src={item.imageUrl || "/placeholder.svg?height=40&width=40"}
                          alt={item.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.name}</p>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>Qty: {item.quantity}</span>
                          <span>{item.price}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button onClick={onClose} className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-3">
            Continue Shopping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
