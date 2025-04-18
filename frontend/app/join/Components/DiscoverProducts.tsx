
'use client';

import { ProductGrid } from "./ProductGrid";

export function DiscoverProducts() {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Discover Amazing Products
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-500">
            Explore popular brands and exclusive offers
          </p>
        </div>
        
        <ProductGrid />
      </div>
    </section>
  );
}
