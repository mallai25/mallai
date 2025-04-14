"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

interface ProductDetailProps {
  product: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProductDetailDialog({ product, open, onOpenChange }: ProductDetailProps) {
  if (!product) return null

  const getProductRoute = () => {
    // Handle default brands
    switch (product.brand) {
      case "JOYRIDE":
        return "/joyride"
      case "NUTCASE":
        return "/Nutcase"
      case "KETONE-IQ":
        return "/ketone"
      case "ItsCalledW":
        return "/itscalledw"
      default:
        // For other products, use their ID for the route
        return "#"
      // ? `/prelim?data=${encodeURIComponent(JSON.stringify({ id: product.id }))}` : "/";
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] rounded-2xl sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>Product Details</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-6 p-4">
          <div className="w-full md:w-1/2">
            <div className="relative">
              <Card>
                <div className="relative h-[300px] rounded-xl overflow-hidden">
                  <Image
                    src={product.imageUrl || product.imageSrc || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className={`w-full h-full ${product.brand === "Final Boss Sour" || product.brand === "Tone" || product.brand === "Goodles" || product.brand === "PAPATUI" ? "object-cover" : "object-contain"}`}
                  />
                </div>
              </Card>
              {product.gtin && (
                <div className="absolute bottom-[-12px] left-0 right-0 flex justify-center">
                  <div className="py-1 px-4 rounded-2xl border border-gray-200 bg-white text-center">
                    <span className="text-gray-600">{product.gtin}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-500">Brand</span>
                <p className="font-medium">{product.brand}</p>
              </div>

              {product.weight && (
                <div>
                  <span className="text-sm text-gray-500">Weight</span>
                  <p className="font-medium">{product.weight}</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              {product.price && (
                <div className="bg-emerald-100 text-emerald-700 font-bold text-sm px-3 py-1.5 rounded-full">
                  {product.price}
                </div>
              )}
              <Link href={getProductRoute()} passHref>
                <Button className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-3xl px-6 py-2 shadow-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 flex items-center">
                  Visit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
