'use client';

import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import KetoneLogo from '../Images/Ketonelogo.jpg';
import Image from 'next/image';

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

export function ProductQA({ onBack, selectedProduct }: { onBack: () => void, selectedProduct: Product }) {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setSelectedQuestion(selectedQuestion === index ? null : index);
  };

  const getProductQA = (product: Product) => {
    if (product.name === "W ORIGINAL") {
      return [
        
      ];
    } else {
      return [
        
        {
          question: "What is Ketone-IQ + Caffeine designed to improve?",
          answer: "This blend is designed to provide stable, long-lasting energy, reduce crashes, enhance focus, and maximize athletic performance."
        },
        {
          question: "What percentage of Americans are considered metabolically unhealthy?",
          answer: "88% of Americans are classified as metabolically unhealthy."
        },
        {
          question: "What role do ketones play in metabolism?",
          answer: "Ketones can help curb cravings and keep you on track by taming hunger pangs."
        },
        
        {
          question: "How does a strong metabolism benefit overall health?",
          answer: "A strong metabolism promotes better sleep, controls mood, manages weight, and improves energy levels."
        },
        {
          question: "What vitamins are included for an added boost?",
          answer: "The formula features Vitamin B6 (3mg) to support brain function and the immune system, along with Vitamin B12 (7.2mcg) in its bioactive form, Methylcobalamin, to support the nervous system."
        },
        {
          question: "What is the source of ketones in Ketone-IQ?",
          answer: "The ketones are derived from R-1,3-Butanediol, made through a sustainable fermentation process."
        },
        {
          question: "How much natural caffeine is included, and what is its source?",
          answer: "The formula includes 100mg of natural caffeine sourced from green tea, equivalent to one cup of coffee."
        },
        {
          question: "How does this product collaborate with Team Visma | Lease a Bike?",
          answer: "The partnership focuses on propelling cycling performance through advanced ketone nutrition, optimizing endurance and recovery with scientific innovation."
        },
        {
          question: "How much more efficient is Ketone-IQ in generating energy compared to glucose alone?",
          answer: "Ketone-IQ is 28% more efficient in generating energy than glucose alone."
        },
        {
          question: "What is the increase in mean power output after recovery with Ketone-IQ?",
          answer: "Athletes experienced a 15% increase in mean power output after recovery with Ketone-IQ."
        },
        {
          question: "How does Ketone-IQ improve athletes' endurance?",
          answer: "Ketone-IQ improves athletes’ endurance by 2% across major sports."
        },
        {
          question: "What achievements has Team Visma | Lease a Bike accomplished?",
          answer: "The team won the 2022–2023 Tour de France and all three Grand Tours in 2023 (Giro, Tour, Vuelta)."
        },
      ];
    }
  };

  const qaItems = getProductQA(selectedProduct);

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Logo Section */}
        <div className="flex justify-center -mt-8 mb-6">
          <div className="relative w-24 h-24">
            <Image
              src={KetoneLogo}
              alt="Logo"
              fill
              className="object-contain"
              priority
            />
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
