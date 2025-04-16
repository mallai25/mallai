
'use client';

import { ProductGrid } from "./ProductGrid";
import { CartButton } from "./CartButton";
import { Toaster } from "sonner";

export function DiscoverProducts() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center sm:text-left space-y-4">
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              Discover Amazing Products
            </h2>
            <p className="max-w-2xl mx-auto sm:mx-0 text-xl text-gray-500">
              Explore popular brands and exclusive offers
            </p>
          </div>
          <div className="hidden sm:block">
            <CartButton />
          </div>
        </div>
        
        {/* Mobile cart button - fixed position */}
        <div className="fixed bottom-6 right-6 sm:hidden z-50">
          <div className="bg-white rounded-full shadow-lg p-2">
            <CartButton />
          </div>
        </div>
        
        <ProductGrid />
        
        {/* Toaster for notifications */}
        <Toaster richColors />
      </div>
    </section>
  );
}