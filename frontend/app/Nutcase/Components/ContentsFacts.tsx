import { useState } from 'react';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  description: string;
  imageSrc: any;
  gtin: string;
  brand: string;
  weight: string;

}

interface ContentFactsProps {
  selectedProduct: Product;
}

export function ContentsFacts({ selectedProduct }: ContentFactsProps) {
  const [showContentModal, setShowContentModal] = useState(false);

  return (
    <>
      <div className="mt-8 bg-white flex overflow-hidden justify-center">
        <ScrollArea className="border shadow-sm rounded-xl w-full sm:max-w-lg">
          <div className="p-6">
            <div className="space-y-6">
            <div className="flex justify-center">
                            <Button 
                              variant="outline" 
                              className="
                                px-8 
                                py-2.5 
                                rounded-full 
                                shadow-[0_1px_2px_rgba(0,0,0,0.05)]
                                hover:shadow-[0_2px_4px_rgba(0,0,0,0.05)]
                                transition-all 
                                duration-200 
                                border-2 
                                border-emerald-500/50
                                text-emerald-600 
                                bg-gradient-to-r 
                                from-emerald-50/50 
                                to-emerald-100/50
                                hover:from-emerald-50 
                                hover:to-emerald-100
                                hover:border-emerald-400
                                hover:text-emerald-500
                                font-medium
                                text-sm
                              "
                              onClick={() => setShowContentModal(true)}
                            >
                              More Details
                            </Button>
                          </div>

              {/* Product Info */}
              <div className="flex items-start space-x-4">
                <div className="flex-1 max-w-[160px]">
                  <h3 className="text-sm font-medium text-gray-500">Brand</h3>
                  <p className="mt-1 text-sm text-gray-900">{selectedProduct.brand}</p>
                </div>
                <div className="flex-1 max-w-[140px]">
                  <h3 className="text-sm font-medium text-gray-500">Item</h3>
                  <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                  Drinks
                  </span>
                </div>
              </div>
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Modal content remains the same */}
      <Dialog open={showContentModal} onOpenChange={setShowContentModal}>
        <DialogContent className="sm:max-w-1xl max-h-[90vh] flex flex-col overflow-y-auto pr-8 -mr-4 
        space-y-2 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-track]:bg-gray-100 hover:[&::-webkit-scrollbar-thumb]:bg-gray-300 transition-colors">
          <DialogHeader className="flex-none">
            <DialogTitle className="text-2xl font-bold text-center mb-2">
               Ingredients
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              {selectedProduct.name}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 flex-1">
            <div className="space-y-3">
              {[
                "Filtered Water",
"Cashews",
"Agave syrup",
"Dates",
"Cocoa Processed with Alkali",
"Natural Flavor",
"Acacia Gum",
"Himalayan Salt"
              ].map((ingredient, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 cursor-pointer rounded-lg w-full hover:bg-gray-100 transition-colors"
                >
                  <p className="text-sm text-gray-700 text-center font-medium">{ingredient}</p>
                </div>
              ))}

            </div>
          </div>

          <div className="w-full mt-4">
                <p className="text-sm text-gray-700 font-medium">Included: 180 Calories, 5g Protein, 680mg Potassium and Caffeine free.</p>
              </div>
        </DialogContent>
      </Dialog>
    </>
  );
} 