

'use client';

import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingBag, 
  Heart, 
  Plus, 
  Minus, 
  Trash2, 
  X,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';

export interface CartItem {
  id: string;
  name: string;
  brand: string;
  price?: string;
  imageUrl: string;
  quantity: number;
}

export interface CartProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSlider({ open, onOpenChange }: CartProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlistItems, setWishlistItems] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState("cart");

  // Load cart and wishlist from localStorage on component mount
  useEffect(() => {
    const loadItems = () => {
      const savedCart = localStorage.getItem('cart');
      const savedWishlist = localStorage.getItem('wishlist');
      
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist));
      }
    };
    
    loadItems();
    
    // Listen for storage events and custom cartUpdated event
    window.addEventListener('storage', loadItems);
    window.addEventListener('cartUpdated', loadItems);
    
    return () => {
      window.removeEventListener('storage', loadItems);
      window.removeEventListener('cartUpdated', loadItems);
    };
  }, []);

  // Save cart and wishlist to localStorage when they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event('cartUpdated'));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlistItems));
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event('storage'));
  }, [wishlistItems]);

  const updateItemQuantity = (id: string, change: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
    
    toast.success(change > 0 ? "Quantity increased" : "Quantity decreased");
  };

  const removeFromCart = (id: string) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from cart`);
    }
  };

  const moveToWishlist = (id: string) => {
    const itemToMove = cartItems.find(item => item.id === id);
    if (itemToMove) {
      setWishlistItems(prev => {
        // Check if item already exists in wishlist
        if (!prev.some(item => item.id === id)) {
          toast.success(`${itemToMove.name} moved to saved items`);
          return [...prev, { ...itemToMove, quantity: 1 }];
        }
        return prev;
      });
      removeFromCart(id);
    }
  };

  const moveToCart = (id: string) => {
    const itemToMove = wishlistItems.find(item => item.id === id);
    if (itemToMove) {
      setCartItems(prev => {
        // Check if item already exists in cart
        const existingItem = prev.find(item => item.id === id);
        if (existingItem) {
          toast.success(`Added another ${itemToMove.name} to cart`);
          return prev.map(item => 
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          );
        }
        toast.success(`${itemToMove.name} added to cart`);
        return [...prev, { ...itemToMove, quantity: 1 }];
      });
      removeFromWishlist(id);
    }
  };

  const removeFromWishlist = (id: string) => {
    const itemToRemove = wishlistItems.find(item => item.id === id);
    setWishlistItems(prevItems => prevItems.filter(item => item.id !== id));
    
    if (itemToRemove) {
      toast.success(`${itemToRemove.name} removed from saved items`);
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const priceValue = item.price ? parseFloat(item.price.replace(/[^0-9.]/g, '')) : 0;
      return total + (priceValue * item.quantity);
    }, 0).toFixed(2);
  };

  const EmptyState = ({ type }: { type: 'cart' | 'wishlist' }) => (
    <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
      {type === 'cart' ? (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-50 p-6 rounded-full">
            <ShoppingBag className="w-16 h-16 text-gray-300" />
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-gray-50 p-6 rounded-full">
            <Heart className="w-16 h-16 text-gray-300" />
          </div>
        </motion.div>
      )}
      <h3 className="text-lg font-medium text-gray-600">
        Your {type === 'cart' ? 'cart' : 'saved items'} is empty
      </h3>
      <p className="text-sm text-gray-500 max-w-xs">
        {type === 'cart' 
          ? "Add some items to your cart to continue shopping" 
          : "Save items for later by clicking the heart icon on products"}
      </p>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md w-full p-0 border-l shadow-xl bg-white">
        <div className="flex flex-col h-full">
          <SheetHeader className="px-6 py-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-xl font-semibold">Your Items</SheetTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onOpenChange(false)}
                className="rounded-full hover:bg-gray-100"
              >
                <X size={18} />
              </Button>
            </div>
          </SheetHeader>

          <Tabs 
            defaultValue="cart" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList className="w-full grid grid-cols-2 border-b">
              <TabsTrigger 
                value="cart" 
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none"
              >
                <ShoppingBag size={16} />
                <span>Cart ({cartItems.length})</span>
              </TabsTrigger>
              <TabsTrigger 
                value="wishlist" 
                className="flex items-center gap-2 data-[state=active]:border-b-2 data-[state=active]:border-emerald-500 rounded-none"
              >
                <Heart size={16} />
                <span>Saved ({wishlistItems.length})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cart" className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto px-6 py-4">
                {cartItems.length === 0 ? (
                  <EmptyState type="cart" />
                ) : (
                  <ul className="space-y-4">
                    <AnimatePresence>
                      {cartItems.map((item) => (
                        <motion.li 
                          key={item.id}
                          layout
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.2 }}
                          className="flex gap-4 p-3 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-emerald-100 transition-all"
                        >
                          <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                            <Image
                              src={item.imageUrl}
                              alt={item.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                              <p className="text-gray-500 text-xs">{item.brand}</p>
                              {item.price && (
                                <p className="text-emerald-600 font-semibold mt-1">{item.price}</p>
                              )}
                            </div>
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center border rounded-full overflow-hidden shadow-sm bg-white">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full hover:bg-gray-100"
                                  onClick={() => updateItemQuantity(item.id, -1)}
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="w-8 text-center text-sm">{item.quantity}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-7 w-7 rounded-full hover:bg-gray-100"
                                  onClick={() => updateItemQuantity(item.id, 1)}
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-600"
                                    onClick={() => removeFromCart(item.id)}
                                  >
                                    <Trash2 size={14} />
                                  </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full hover:bg-pink-50 hover:text-pink-600"
                                    onClick={() => moveToWishlist(item.id)}
                                  >
                                    <Heart size={14} />
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                )}
              </div>

              {cartItems.length > 0 && (
                <div className="border-t p-6 space-y-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total</span>
                    <span className="font-bold text-lg">${calculateTotal()}</span>
                  </div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-md hover:shadow-lg transition-all"
                    >
                      Checkout
                    </Button>
                  </motion.div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="wishlist" className="flex-1 overflow-y-auto px-6 py-4">
              {wishlistItems.length === 0 ? (
                <EmptyState type="wishlist" />
              ) : (
                <ul className="space-y-4">
                  <AnimatePresence>
                    {wishlistItems.map((item) => (
                      <motion.li 
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-4 p-3 rounded-lg border border-gray-100 bg-white shadow-sm hover:shadow-md hover:border-pink-100 transition-all"
                      >
                        <div className="w-20 h-20 relative rounded-md overflow-hidden bg-gray-50 flex-shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900 text-sm">{item.name}</h3>
                          <p className="text-gray-500 text-xs">{item.brand}</p>
                          {item.price && (
                            <p className="text-emerald-600 font-semibold mt-1">{item.price}</p>
                          )}
                          <div className="flex justify-between mt-3">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-8 text-xs rounded-full border-emerald-200 text-emerald-600 hover:bg-emerald-50 shadow-sm"
                                onClick={() => moveToCart(item.id)}
                              >
                                <ShoppingBag size={12} className="mr-1" />
                                Add to Cart
                              </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 rounded-full hover:bg-red-50 hover:text-red-600"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </motion.div>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}
