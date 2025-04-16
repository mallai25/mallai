
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';
import { CartSlider } from './CartSlider';
import { motion, AnimatePresence } from 'framer-motion';

interface CartButtonProps {
  fixed?: boolean;
}

export function CartButton({ fixed = false }: CartButtonProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [animateButton, setAnimateButton] = useState(false);
  
  // Update cart count whenever localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem('cart');
      if (cart) {
        const items = JSON.parse(cart);
        setCartCount(items.length);
      } else {
        setCartCount(0);
      }
    };
    
    updateCartCount(); // Initial count
    
    // Listen for storage events (when localStorage changes)
    window.addEventListener('storage', updateCartCount);
    
    // Custom event for when we update cart in the same window
    const handleCartUpdate = () => {
      updateCartCount();
      // Animate button when cart is updated
      setAnimateButton(true);
      setTimeout(() => setAnimateButton(false), 300);
      // Open cart slider when item is added
      setIsCartOpen(true);
    };
    
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    // Check for updates every 500ms as a fallback
    const interval = setInterval(updateCartCount, 500);
    
    return () => {
      window.removeEventListener('storage', updateCartCount);
      window.removeEventListener('cartUpdated', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);
  
  const buttonClasses = fixed 
    ? "fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full shadow-lg bg-white flex items-center justify-center hover:bg-emerald-50"
    : "relative rounded-full hover:bg-emerald-50 text-gray-700 hover:text-emerald-600";
  
  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        animate={animateButton ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
        className={fixed ? "fixed right-6 bottom-6 z-50" : ""}
      >
        <Button
          variant="ghost"
          size={fixed ? "default" : "icon"}
          onClick={() => setIsCartOpen(true)}
          className={buttonClasses}
        >
          <ShoppingBag size={fixed ? 24 : 22} className={fixed ? "text-emerald-600" : ""} />
          <AnimatePresence>
            {cartCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className={`absolute ${fixed ? '-top-2 -right-2' : '-top-1 -right-1'} h-5 w-5 flex items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-medium`}
              >
                {cartCount}
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>
      
      <CartSlider
        open={isCartOpen}
        onOpenChange={setIsCartOpen}
      />
    </>
  );
}