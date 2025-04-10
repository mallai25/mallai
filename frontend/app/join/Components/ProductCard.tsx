
'use client';

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QrCode, Eye } from "lucide-react";
import { InfluencerDialog } from "./InfluencerDialog";
import { ProductDetailDialog } from "./ProductDetailDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductCardProps {
  product: any;
}

export function ProductCard({ product }: ProductCardProps) {
  const [showInfluencerDialog, setShowInfluencerDialog] = useState(false);
  const [showProductDialog, setShowProductDialog] = useState(false);
  const [showQRDialog, setShowQRDialog] = useState(false);
  const [selectedDetailProduct, setSelectedDetailProduct] = useState(null);

  const handleInfluencerClick = () => {
    setShowInfluencerDialog(true);
  };

  const handleViewDetails = () => {
    setShowProductDialog(true);
  };

  const handleQRClick = () => {
    setShowQRDialog(true);
  };

  const handleSimilarProductClick = (similarProduct) => {
    setSelectedDetailProduct(similarProduct);
  };

  return (
    <>
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg group">
        <div className="relative aspect-square">
          <Image
            src={product.imageSrc}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.influencer && (
            <button
              onClick={handleInfluencerClick}
              className="absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 shadow-md"
            >
              <Image
                src={product.influencer.image}
                alt={product.influencer.name}
                fill
                className="object-cover"
              />
            </button>
          )}
        </div>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.brand}</p>
              </div>
              <div className="flex items-baseline">
                <span className="font-bold text-lg">{product.price}</span>
                <span className="text-xs text-gray-500 ml-0.5">/per bag</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">{product.description}</p>
            <div className="flex justify-between items-center pt-2">
              <Button 
                size="sm"
                onClick={handleQRClick}
                className="h-8 w-8 rounded-full bg-blue-500 hover:bg-blue-600 p-0"
              >
                <QrCode className="h-4 w-4 text-white" />
              </Button>
              <Button
                onClick={handleViewDetails}
                className="bg-emerald-500 hover:bg-emerald-600 text-white"
              >
                View Details
                <Eye className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Influencer Dialog */}
      <InfluencerDialog 
        influencer={product.influencer}
        open={showInfluencerDialog}
        onOpenChange={setShowInfluencerDialog}
      />

      {/* Product Detail Dialog for QR Code Click */}
      <ProductDetailDialog
        product={product}
        open={showQRDialog}
        onOpenChange={setShowQRDialog}
      />

      {/* Similar Product Detail Dialog */}
      <ProductDetailDialog
        product={selectedDetailProduct}
        open={!!selectedDetailProduct}
        onOpenChange={() => setSelectedDetailProduct(null)}
      />

      {/* View Details Dialog - Products Overview */}
      <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
        <DialogContent className="w-[95vw] max-w-[950px] p-0 rounded-lg">
          <ScrollArea className="h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] p-4 rounded-md">
            <div className="mt-5 p-0 sm:p-1">
              <DialogHeader className="mb-4 sm:mb-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <DialogTitle className="text-lg sm:text-xl">Active Products Overview</DialogTitle>
                    <p className="text-sm text-gray-500">
                      Overview of {product.brand} products
                    </p>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0">
                    <div className="bg-indigo-50 p-3 sm:p-3 rounded-full flex justify-between items-center border border-indigo-100">
                      <h4 className="font-medium text-sm sm:text-base text-indigo-900 mr-8">Total</h4>
                      <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full w-8 h-8">
                        <p className="text-md sm:text-md font-bold text-indigo-700">{product.similarProducts?.length || 1}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-3">
                <Card className="border border-gray-100 min-h-96 rounded-3xl px-4 py-2 mb-2 w-full">
                  <div className="relative space-y-2">
                    <button className="absolute right-0 top-0 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-full transition-colors flex items-center space-x-1">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span className="text-xs font-medium text-green-700">Live</span>
                    </button>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pl-2">
                      <h4 className="text-lg font-semibold">{product.category}</h4>                          
                      <span className="mt-1 sm:mt-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        {product.weight}
                      </span>
                    </div>
                  </div>

                  <div className="p-2 mt-2 relative min-h-44">
                    <button 
                      className="absolute -left-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                      onClick={() => {
                        const container = document.getElementById('product-carousel');
                        if (container) container.scrollLeft -= container.offsetWidth / 2;
                      }}
                    >
                      <ChevronLeft className="w-5 h-5 text-gray-700" />
                    </button>

                    <div 
                      id="product-carousel"
                      className="flex overflow-x-auto sm:overflow-x-hidden scroll-smooth px-0 sm:px-0 gap-3 sm:gap-6 snap-x snap-mandatory sm:snap-none pb-4 sm:pb-0 -mx-2 sm:mx-0"
                    >
                      {product.similarProducts ? (
                        product.similarProducts.map((item) => (
                          <div key={item.id} className="flex-none w-[80%] sm:w-1/3 snap-center first:ml-2 sm:first:ml-0">
                            <div className="border border-gray-100 rounded-xl p-3 hover:border-blue-200 transition-colors group/card">
                              <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer" onClick={() => handleSimilarProductClick(item)}>
                                <div className="absolute inset-0 duration-300 z-10"></div>
                                <Image
                                  src={item.imageUrl}
                                  alt={item.name}
                                  fill
                                  className="transform scale-75 group-hover/card:scale-90 transition-transform duration-300 ease-in-out object-contain"
                                />
                              </div>
                              <div className="space-y-1">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                    {item.name}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-600">{item.description}</p>
                                <div className="flex justify-end mt-3">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 p-0 hover:shadow-lg shadow-md border-2 border-white transition-all group"
                                    onClick={() => handleSimilarProductClick(item)}
                                  >
                                    <QrCode className="h-4 w-4 text-white group-hover:scale-110 transition-transform" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="flex-none w-[80%] sm:w-1/3 snap-center first:ml-2 sm:first:ml-0">
                          <div className="border border-gray-100 rounded-xl p-3 hover:border-blue-200 transition-colors group/card">
                            <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                              <div className="absolute inset-0 duration-300 z-10"></div>
                              <Image
                                src={product.imageSrc}
                                alt={product.name}
                                fill
                                className="transform scale-75 group-hover/card:scale-90 transition-transform duration-300 ease-in-out object-contain"
                              />
                            </div>
                            <div className="space-y-1">
                              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                  {product.name}
                                </span>
                              </div>
                              <p className="text-xs text-gray-600">{product.description}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <button 
                      className="absolute -right-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                      onClick={() => {
                        const container = document.getElementById('product-carousel');
                        if (container) container.scrollLeft += container.offsetWidth / 2;
                      }}
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                  </div>
                </Card>
              </div>
            </div>
            <ScrollBar orientation="vertical" className="bg-gray-100 w-2" />
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
