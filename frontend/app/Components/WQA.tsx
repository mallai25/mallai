'use client';

import { useState } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import Wlogo from './Images/Wlogo.jpg';
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
        {
          question: "What makes W Antiperspirant Deodorant effective?",
          answer: "W's 24/7 sweat protection keeps pit stains at bay, while long-lasting scents ensure you smell great morning, noon, and night."
        },
        {
          question: "What ingredients are used in W ORIGINAL DEODORANT?",
          answer: "Our sticks are infused with Magnesium and Vitamin D to promote healthy underarm skin. And we did it all without parabens, harsh sulfates, or artificial colors."
        },
        {
          question: "What does the W Original scent smell like?",
          answer: "The W Original scent smells like a lemon tree, a crisp green apple, and some fresh mint got together and said 'let's get it.'"
        },
        {
          question: "Is W ORIGINAL DEODORANT suitable for all skin types?",
          answer: "Yes, it's good for all skin types but expertly formulated for men willing to break a sweat."
        },
        {
          question: "Does W ORIGINAL DEODORANT contain any harmful chemicals?",
          answer: "No, it does not contain parabens, harsh sulfates, or artificial colors."
        },
      ];
    } else if (product.name === "WAVE BREAKER") {
      return [
        {
          question: "What makes W Antiperspirant Deodorant effective?",
          answer: "W's 24/7 sweat protection keeps pit stains at bay, while long-lasting scents ensure you smell great morning, noon, and night."
        },
        {
          question: "What ingredients are used in WAVE BREAKER?",
          answer: "Our sticks are infused with Magnesium and Vitamin D to promote healthy underarm skin. And we did it all without parabens, harsh sulfates, or artificial colors."
        },
        {
          question: "What does the Wave Breaker scent smell like?",
          answer: "The Wave Breaker scent smells like coconut water, island vanilla beans, and a pacific ocean breeze. By the way, 'breeze' just means 'a wind that you really like.'"
        },
        {
          question: "Is WAVE BREAKER suitable for all skin types?",
          answer: "Yes, it's good for all skin types but expertly formulated for men willing to break a sweat."
        },
        {
          question: "Does WAVE BREAKER contain any harmful chemicals?",
          answer: "No, it does not contain parabens, harsh sulfates, or artificial colors."
        },
      ];
    } else if (product.name === "DEEP WOODS") {
      return [
        {
          question: "What makes DEEP WOODS deodorant special?",
          answer: "Your armpits could smell like, well…armpits, or they could smell like a crisp mountain breeze passing over the tree line with notes of earthy richness and a hint of sandalwood."
        },
        {
          question: "What inspired the DEEP WOODS scent?",
          answer: "Inspired by a journey far off into the forest, getting pretty lost, sitting alone on a rock wondering if life would go on, getting found by a search and rescue party, and returning to the office like nothing happened."
        },
        {
          question: "What does the DEEP WOODS scent smell like?",
          answer: "The DEEP WOODS scent smells like a crisp mountain breeze with notes of earthy richness and a hint of sandalwood."
        },
        {
          question: "Is DEEP WOODS suitable for all skin types?",
          answer: "Yes, it's good for all skin types but expertly formulated for men willing to break a sweat."
        },
        {
          question: "Does DEEP WOODS contain any harmful chemicals?",
          answer: "No, it does not contain parabens, harsh sulfates, or artificial colors."
        },
      ];
    } else if (product.name === "FRESH ICE") {
      return [
        {
          question: "What makes FRESH ICE deodorant special?",
          answer: "The Fresh Ice scent smells like cool coastal waters. East Coast. West Coast. Gulf Coast. Lakes have coasts too, you know? But those are called shores. River coasts are called banks."
        },
        {
          question: "What does the FRESH ICE scent smell like?",
          answer: "It smells like cool coastal waters, ensuring you smell fresh and invigorating."
        },
        {
          question: "Is FRESH ICE suitable for all skin types?",
          answer: "Yes, it's good for all skin types but expertly formulated for men willing to break a sweat."
        },
        {
          question: "Does FRESH ICE contain any harmful chemicals?",
          answer: "No, it does not contain parabens, harsh sulfates, or artificial colors."
        },
        {
          question: "What ingredients are used in FRESH ICE?",
          answer: "Our sticks are infused with Magnesium and Vitamin D to promote healthy underarm skin."
        },
      ];
    } else {
      return [
        
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
              src={Wlogo}
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
