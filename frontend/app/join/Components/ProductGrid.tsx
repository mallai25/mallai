
'use client';

import { useState, useEffect } from "react";
import { ProductCard } from "./ProductCard";
import { categories, productData } from "../mockdata";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export function ProductGrid() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState(productData);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(productData);
    } else {
      const filtered = productData.filter(product => {
        return product.category.toLowerCase().includes(selectedCategory.toLowerCase());
      });
      setFilteredProducts(filtered);
    }
  }, [selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Category Tabs */}
      <div className="w-full">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                className={`
                  rounded-full px-4 py-2 transition-all duration-300
                  ${selectedCategory === category.id 
                    ? 'bg-emerald-500 text-white shadow-md' 
                    : 'hover:bg-emerald-50 hover:text-emerald-700'}
                `}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-8">
            <h3 className="text-lg font-medium text-gray-700">No products found in this category</h3>
            <p className="text-gray-500">Try selecting a different category</p>
          </div>
        )}
      </div>
    </div>
  );
}
