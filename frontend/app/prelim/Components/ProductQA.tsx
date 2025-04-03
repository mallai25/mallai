'use client';

import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Image from 'next/image';


export function ProductQA({ onBack, selectedProduct }) {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setSelectedQuestion(selectedQuestion === index ? null : index);
  };

  const qaItems = [
  ];

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex justify-center -mt-8 mb-6">
          <div className="relative w-24 h-24">
            {selectedProduct && (
              <Image
              src={selectedProduct.brandImageUrl}
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
            )}
          </div>
        </div>

        <div className="flex items-center justify-between mb-10">
          <Button
            onClick={onBack}
            variant="ghost"
            className="flex rounded-xl items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Product
          </Button>
          <div className="w-[100px]"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
  {qaItems.map((item, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`border rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-sm ${
        selectedQuestion === index ? 'bg-gradient-to-r from-emerald-50 to-teal-50' : 'hover:bg-gray-50'
      }`}
      onClick={() => toggleQuestion(index)}
    >
      <div className="flex justify-between items-start gap-4">
        <h3 className="text-lg font-semibold text-gray-800">{item.question}</h3>
        <div
          className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
            selectedQuestion === index 
              ? 'bg-emerald-100 rotate-45' 
              : 'bg-violet-100'
          }`}
        >
          <Plus
            className={`w-5 h-5 transition-all duration-300 ${
              selectedQuestion === index 
                ? 'text-emerald-600' 
                : 'text-violet-500'
            }`}
          />
        </div>
      </div>
      <AnimatePresence>
        {selectedQuestion === index && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4"
          >
            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
              <p className="text-gray-600 text-base">{item.answer}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  ))}
</div>
      </div>
    </div>
  );
}
