
"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FIREBASE_AUTH, FIREBASE_DB } from "../../../FirebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { ChevronRight, Gift, User, ArrowRight, Package, BarChart, QrCode, PodcastIcon, Tag, ShoppingBag, Minus, Plus, X, Heart, Trash2, ShoppingCart } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { InfluencerDialog } from "../Components/InfluencerDialog"
import { ProductDetailDialog } from "../Components/ProductDetailDialog"

import { productData, influencers } from "../mockdata"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs } from "firebase/firestore"

import LogoImage from "../login/Images/download.png"
import HeroImage from "../login/Images/cpg.jpg"

export default function JoinPage() {
  const router = useRouter()
  const { toast } = useToast()
  const carouselRefs = useRef({})
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [isLogin, setIsLogin] = useState(true)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [selectedCategory, setSelectedCategory] = useState("Prelims")

  const [showInfluencerDialog, setShowInfluencerDialog] = useState(false)
  const [selectedInfluencer, setSelectedInfluencer] = useState(null)
  const [showProductDialog, setShowProductDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [hoveredSimilarProduct, setHoveredSimilarProduct] = useState(null)

  const [currentProductPage, setCurrentProductPage] = useState(0)
  const PRODUCTS_PER_PAGE = 4

  const [firebaseProducts, setFirebaseProducts] = useState<any[]>([])
  const [firebaseInfluencers, setFirebaseInfluencers] = useState<any[]>([])
  const [loadingProducts, setLoadingProducts] = useState(true)
  
  // Cart related states
  const [cart, setCart] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const [cartTabOpen, setCartTabOpen] = useState("cart")

  useEffect(() => {
    const fetchFirebaseData = async () => {
      try {
        const productsCollection = collection(FIREBASE_DB, "listingsMade")
        const productsSnapshot = await getDocs(productsCollection)
        const productsList = productsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        const influencersCollection = collection(FIREBASE_DB, "influencers")
        const influencersSnapshot = await getDocs(influencersCollection)
        const influencersList = influencersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        setFirebaseProducts(productsList)
        setFirebaseInfluencers(influencersList)
      } catch (error) {
        console.error("Error fetching Firebase data:", error)
      } finally {
        setLoadingProducts(false)
      }
    }

    fetchFirebaseData()
  }, [])

  // Load cart and wishlist from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem('cart')
      const savedWishlist = localStorage.getItem('wishlist')

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCart(parsedCart)
        setCartCount(parsedCart.reduce((acc, item) => acc + item.quantity, 0))
        setCartTotal(parsedCart.reduce((acc, item) => {
          const price = parseFloat(item.price?.replace('$', '') || '0')
          return acc + (price * item.quantity)
        }, 0))
      }

      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist))
      }
    }

    loadCart()
    
    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }
    
    window.addEventListener('cartUpdated', handleCartUpdate)
    window.addEventListener('wishlistUpdated', handleCartUpdate)
    
    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate)
      window.removeEventListener('wishlistUpdated', handleCartUpdate)
    }
  }, [])

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + change)
        return { ...item, quantity: newQuantity }
      }
      return item
    })
    
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
    
    toast({
      title: "Cart updated",
      description: "Item quantity has been updated.",
      variant: "default"
    })
  }
  
  const removeFromCart = (id) => {
    const updatedCart = cart.filter(item => item.id !== id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new Event('cartUpdated'))
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart.",
      variant: "default"
    })
  }
  
  const moveToWishlist = (item) => {
    // Remove from cart
    const updatedCart = cart.filter(cartItem => cartItem.id !== item.id)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    
    // Add to wishlist
    const existingItem = wishlist.find(wishItem => wishItem.id === item.id)
    if (!existingItem) {
      const updatedWishlist = [...wishlist, item]
      setWishlist(updatedWishlist)
      localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    }
    
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new Event('wishlistUpdated'))
    
    toast({
      title: "Moved to wishlist",
      description: `${item.name} has been moved to your wishlist.`,
      variant: "default"
    })
  }
  
  const moveToCart = (item) => {
    // Remove from wishlist
    const updatedWishlist = wishlist.filter(wishItem => wishItem.id !== item.id)
    setWishlist(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    
    // Add to cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id)
    
    if (existingItemIndex >= 0) {
      const updatedCart = [...cart]
      updatedCart[existingItemIndex].quantity += 1
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    } else {
      const updatedCart = [...cart, {...item, quantity: 1}]
      setCart(updatedCart)
      localStorage.setItem('cart', JSON.stringify(updatedCart))
    }
    
    window.dispatchEvent(new Event('cartUpdated'))
    window.dispatchEvent(new Event('wishlistUpdated'))
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
      variant: "default"
    })
  }
  
  const removeFromWishlist = (id) => {
    const updatedWishlist = wishlist.filter(item => item.id !== id)
    setWishlist(updatedWishlist)
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist))
    window.dispatchEvent(new Event('wishlistUpdated'))
    
    toast({
      title: "Item removed",
      description: "Item has been removed from your wishlist.",
      variant: "default"
    })
  }

  const handleInfluencerClick = (influencer) => {
    const matchingInfluencer =
      firebaseInfluencers.find((inf) => inf.id === influencer.id) ||
      influencers.find((inf) => inf.name === influencer.name)
    setSelectedInfluencer(matchingInfluencer)
    setShowInfluencerDialog(true)
  }

  const handleProductQRClick = (product, similarProduct) => {
    setSelectedProduct({
      ...product,
      ...similarProduct,
      imageUrl: similarProduct.imageUrl || product.imageUrl,
      brand: product.brand,
      category: product.category,
      priceUnit: product.priceUnit,
    })
    setShowProductDialog(true)
  }

  const handleSignIn = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await signInWithEmailAndPassword(FIREBASE_AUTH, email, password)
      router.push("/homepage")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(FIREBASE_AUTH, email, password)
      const user = userCredential.user

      await updateProfile(user, {
        displayName: name,
      })

      const userDocRef = doc(FIREBASE_DB, "users", user.uid)
      await setDoc(userDocRef, {
        name: name,
        email: email,
      })

      router.push("/homepage")
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white relative">
      <header className="w-full bg-white pt-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center px-4">
          <div className="flex items-center gap-6 justify-end w-full">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9 rounded-xl">
                  <AvatarImage src={LogoImage.src} alt="" />
                </Avatar>
                <span className="text-xl font-semibold text-zinc-800">Mall ai</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Fixed Cart Button */}
      <div className="fixed right-4 bottom-4 z-50">
        <Sheet open={cartOpen} onOpenChange={setCartOpen}>
          <Button
                  className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
                  onClick={() => setCartOpen(true)}
                >
                  <ShoppingBag className="h-6 w-6 text-white" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 bg-red-500 border-0 text-white">{cartCount}</Badge>
                  )}
                </Button>
          
          <SheetContent className="w-full sm:w-[400px] p-0">
            <SheetHeader className="p-4 border-b">
              <SheetTitle className="text-xl font-bold">Your Shopping Bag</SheetTitle>
            </SheetHeader>
            
            <Tabs value={cartTabOpen} onValueChange={setCartTabOpen} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="cart" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                  Cart ({cartCount})
                </TabsTrigger>
                <TabsTrigger value="wishlist" className="data-[state=active]:bg-emerald-50 data-[state=active]:text-emerald-700">
                  Wishlist ({wishlist.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="cart" className="p-0 outline-none">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="bg-emerald-50 p-4 rounded-full mb-4">
                      <ShoppingCart className="h-10 w-10 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-gray-500 text-center mb-4">Start adding some products you love!</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setCartOpen(false)}
                      className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {cart.map((item) => (
                          <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image 
                                src={item.imageUrl || "/placeholder.svg"} 
                                alt={item.name} 
                                width={80} 
                                height={80} 
                                className="w-full h-full object-contain"
                              />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                  onClick={() => removeFromCart(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              
                              <p className="text-xs text-gray-500 mb-2">
                                {item.brand}
                              </p>
                              
                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2 border border-gray-200 rounded-full">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                                    onClick={() => updateQuantity(item.id, -1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                  </Button>
                                  <span className="text-sm font-medium">{item.quantity}</span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 text-gray-500 hover:text-gray-700"
                                    onClick={() => updateQuantity(item.id, 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </div>
                                
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 text-rose-400 hover:text-rose-600 hover:bg-rose-50"
                                    onClick={() => moveToWishlist(item)}
                                  >
                                    <Heart className="h-4 w-4" />
                                  </Button>
                                  <span className="font-medium">
                                    {item.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">${cartTotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between mb-4">
                        <span className="text-gray-600">Shipping</span>
                        <span className="font-medium">Free</span>
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Checkout (${cartTotal.toFixed(2)})
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="wishlist" className="p-0 outline-none">
                {wishlist.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8">
                    <div className="bg-rose-50 p-4 rounded-full mb-4">
                      <Heart className="h-10 w-10 text-rose-500" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-500 text-center mb-4">Save items you love for later!</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setCartOpen(false)}
                      className="border-rose-200 text-rose-600 hover:bg-rose-50"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[calc(100vh-200px)] p-4">
                    <div className="space-y-4">
                      {wishlist.map((item) => (
                        <div key={item.id} className="flex gap-3 border-b border-gray-100 pb-4">
                          <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image 
                              src={item.imageUrl || "/placeholder.svg"} 
                              alt={item.name} 
                              width={80} 
                              height={80} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                                onClick={() => removeFromWishlist(item.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <p className="text-xs text-gray-500 mb-2">
                              {item.brand}
                            </p>
                            
                            <div className="flex justify-between items-center">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-xs h-8 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                onClick={() => moveToCart(item)}
                              >
                                Move to Cart
                              </Button>
                              
                              <span className="font-medium">
                                {item.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </TabsContent>
            </Tabs>
          </SheetContent>
        </Sheet>
      </div>

      <section className="py-12 md:py-10 flex justify-center overflow-hidden">
        <div className="container px-4 mx-auto max-w-7xl">
          <div className="flex items-center">
            <div className="w-full space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-medium">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 10-1.414-1.414L11 10.586V7z"
                    clipRule="evenodd"
                  />
                </svg>
                Easy Tracking
              </div>
              <div className="bg-white p-6 rounded-3xl shadow-lg transition-all">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl md:text-5xl font-bold leading-tight tracking-tight"
                >
                  Stay Connected <span className="text-[#4147d5]">With Your</span> Favorite Brands
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-gray-600 text-base md:text-xl leading-relaxed mt-4"
                >
                  Participate in exclusive polls, rewards campaigns and unlock special giveaways.
                </motion.p>
              </div>

              <div className="hidden md:block py-3"></div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div className="hidden sm:block relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-white"></div>
                  <div className="relative">
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-2 rounded-full animate-pulse">
                          <PodcastIcon className="w-5 h-5 text-green-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Subscribe Brands</p>
                          <p className="text-xs text-gray-500">Follow up with brands</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden sm:block relative">
                  <div className="absolute -inset-4 opacity-20 blur-xl rounded-3xl bg-white"></div>
                  <div className="relative">
                    <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="bg-pink-100 p-2 rounded-full animate-pulse">
                          <QrCode className="w-5 h-5 text-pink-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Brand Polls</p>
                          <p className="text-xs text-gray-500">Vote on new items</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-col md:flex-row items-center justify-between gap-8">
                <div></div>

                <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
                  <div className="flex-1 min-w-[240px]">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-2 rounded-full animate-pulse">
                          <BarChart className="w-5 h-5 text-blue-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Track Activity</p>
                          <p className="text-xs text-gray-500">See participations</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[240px]">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full ring-2 ring-purple-100 animate-pulse">
                          <Gift className="w-5 h-5 text-purple-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Giveaways</p>
                          <p className="text-xs text-gray-500">Win prizes</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[240px]">
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full ring-2 ring-green-100 animate-pulse">
                          <Package className="w-5 h-5 text-green-600 animate-bounce" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">New Products</p>
                          <p className="text-xs text-gray-500">Latest releases</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <section className="md:hidden px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white rounded-2xl border border-gray-100">
                        <CardContent className="p-6 relative">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl inline-block shadow-md"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-7 w-7 text-blue-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                                  <circle cx="9" cy="7" r="4"></circle>
                                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                                </svg>
                              </motion.div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 text-gray-900">Subscribe Brands</h3>
                              <p className="text-gray-600 leading-relaxed">Follow your favorite brands.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white rounded-2xl border border-gray-100">
                        <CardContent className="p-6 relative">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl inline-block shadow-md"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-7 w-7 text-purple-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <polyline points="12 6 12 12 16 14"></polyline>
                                </svg>
                              </motion.div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 text-gray-900">Join Campaigns</h3>
                              <p className="text-gray-600 leading-relaxed">Participate in reward campaigns.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 bg-white rounded-2xl border border-gray-100">
                        <CardContent className="p-6 relative">
                          <div className="flex items-center gap-5">
                            <div className="flex-shrink-0">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl inline-block shadow-md"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-7 w-7 text-green-600"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <line x1="12" y1="20" x2="12" y2="10"></line>
                                  <line x1="18" y1="20" x2="18" y2="4"></line>
                                  <line x1="6" y1="20" x2="6" y2="16"></line>
                                </svg>
                              </motion.div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-semibold mb-2 text-gray-900">Vote in Polls</h3>
                              <p className="text-gray-600 leading-relaxed">Shape products with exclusive polls.</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>

      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-[900px] p-0 overflow-hidden rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
            <div className="hidden md:block relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 z-10" />
              <Image src={HeroImage || "/placeholder.svg"} alt="Login" fill className="object-cover" />
            </div>

            <div className="p-6 md:p-8 bg-white flex flex-col justify-center">
              <div className="max-w-sm mx-auto w-full">
                <div className="mb-8 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {isLogin ? "Welcome Back" : "Create Account"}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {isLogin
                      ? "Sign in to access your rewards and campaigns"
                      : "Join to track your participation in rewards campaigns"}
                  </p>
                </div>

                <form onSubmit={isLogin ? handleSignIn : handleSignUp} className="space-y-5">
                  {!isLogin && (
                    <div className="relative group">
                      <Input
                        type="text"
                        placeholder="Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        className="h-12 pl-12 w-full bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                      />
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                        <User className="w-4 h-4" />
                      </div>
                    </div>
                  )}

                  <div className="relative group">
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 pl-12 w-full bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                    </div>
                  </div>

                  <div className="relative group">
                    <Input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 pl-12 w-full bg-gray-50/50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-2xl font-medium transition-all duration-200"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
                      </div>
                    ) : isLogin ? (
                      "Sign In"
                    ) : (
                      "Create Account"
                    )}
                  </Button>

                  <div className="text-center mt-6">
                    <div className="text-center mt-6">
                      <p className="text-gray-600 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                          type="button"
                          onClick={() => setIsLogin(!isLogin)}
                          className="ml-2 text-blue-600 hover:text-blue-700 text-sm font-semibold hover:underline transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 rounded-3xl px-1"
                        >
                          {isLogin ? "Create one" : "Sign in"}
                          <span className="inline-block ml-1 transition-transform group-hover:translate-x-1">→</span>
                        </button>
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="w-full flex justify-center mt-12">
        <Button
          onClick={() => setShowLoginDialog(true)}
          className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-3xl px-6 py-4 text-lg shadow-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20 flex items-center"
        >
          Get Started
          <div className="bg-blue-400/50 text-white ml-2 flex justify-center items-center rounded-full p-1.5">
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>
      </div>

      <section className="py-16 bg-white mt-2 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 relative">
          <div className="hidden md:block absolute -top-18 -left-20 w-40 h-40 bg-blue-300 rounded-full opacity-5 animate-pulse"></div>
          <div
            className="hidden md:block absolute top-40 -right-20 w-64 h-64 bg-yellow-300 rounded-full opacity-5 animate-pulse"
            style={{ animationDelay: "3s" }}
          ></div>

          <div className="text-center w-full mx-auto mb-10 z-10">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-5 text-gray-900">Discover Amazing Products</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Connect with your favorite brands and discover products curated just for you.
            </p>
          </div>

          <div className="relative">
            <ScrollArea className="w-full">
              <div className="flex justify-start sm:justify-center px-4 sm:px-0 mb-4 overflow-x-auto">
                <div className="flex space-x-2 min-w-max scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                  {[
                    "Prelims",
                    "Beverage",
                    "Coffee",
                    "Snacks",
                    "Breakfast",
                    "Personal Care",
                    "Alcohol",
                    "Supplements",
                  ].map((category) => (
                    <motion.div key={category} className="flex-none first:ml-0" whileTap={{ scale: 0.95 }}>
                      <Button
                        variant={category === selectedCategory ? "default" : "outline"}
                        className={`whitespace-nowrap rounded-full px-4 sm:px-5 text-sm sm:text-base h-9 sm:h-10 ${
                          category === selectedCategory
                            ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md"
                            : "hover:bg-gray-100 text-gray-800 border-gray-200"
                        } transition-all duration-200`}
                        onClick={() => {
                          setSelectedCategory(category)
                          setCurrentProductPage(0)
                        }}
                      >
                        {category}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>
              <ScrollBar
                orientation="horizontal"
                className="sm:hidden"
              />
            </ScrollArea>
          </div>

          <div className="flex justify-center mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full px-2 sm:px-0 max-w-7xl">
              {loadingProducts ? (
                <div className="col-span-full flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                (firebaseProducts.length > 0 ? firebaseProducts : productData)
                .sort((a, b) => {
                  const idA = String(a.id);
                  const idB = String(b.id);
                  return idB.localeCompare(idA);
                })
                .filter((product) => {
                  if (selectedCategory === "Prelims") return true
                  if (selectedCategory === "Snacks" && product.category.toLowerCase() === "candy") return true
                  if (selectedCategory === "Snacks" && product.category.toLowerCase() === "snacks") return true
                  if (selectedCategory === "Breakfast" && product.category.toLowerCase() === "breakfast") return true
                  if (selectedCategory === "Personal Care" && 
                    (product.category.toLowerCase() === "personal Care" || 
                     product.category.toLowerCase() === "deodorant")) return true
                  return product.category.toLowerCase() === selectedCategory.toLowerCase()
                })
                .slice(currentProductPage * PRODUCTS_PER_PAGE, (currentProductPage + 1) * PRODUCTS_PER_PAGE)
                .map((product) => (
                  <div key={product.id} className="group w-full max-w-full sm:w-[280px] mx-auto">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center relative">
                        <Image
                          src={product.imageSrc || product.imageUrl || "/placeholder.svg"}
                          alt={product.name}
                          {...(product.brand === "Black Rifle Coffee" || product.brand === "Alani Nu" || product.brand === "Kin Euphorics" 
                            ? {
                                width: 100,
                                height: 100,
                              }
                            : {
                              width: 160,
                              height: 160,
                              }
                            )}
                          className={`cursor-pointer group-hover:scale-110 transition-transform duration-300 ${
                            product.brand === "Black Rifle Coffee" || product.brand === "Alani Nu" || product.brand === "Kin Euphorics" 
                              ? "object-cover" 
                              : "object-contain"
                          }`}
                        />
                        {product.influencer && (
                          <button
                            onClick={() => handleInfluencerClick(product.influencer)}
                            className="absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 shadow-md"
                          >
                            <Image
                              src={product.influencer.image || product.influencer.imageUrl || "/placeholder.svg"}
                              alt={product.influencer.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </button>
                        )}
                      </div>
                      <div className="py-2 px-4 w-full bg-white relative">
                        <div className="flex justify-end">
                          <div>
                            <h3 className="font-bold text-lg">{product.brand}</h3>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                          {product.brand === "Drink BRĒZ" || product.brand === "Kin Euphorics" 
                            ? "Non-Alcoholic" 
                            : product.category}
                        </p>
                        <div className="flex justify-between items-center mb-0.5">
                          <div className="flex items-center">
                            <span className="text-lg font-bold">{product.price}</span>
                            <span className="text-sm text-gray-500 ml-1">
                              /{product.priceUnit ||
                                (product.brand === "ItsCalledW"
                                  ? "/stick"
                                  : product.brand === "Ketone-IQ"
                                    ? "/serving"
                                    : product.category === "Beverage"
                                      ? "/pack"
                                      : "/bag")}
                            </span>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="rounded-full text-xs">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="w-[95vw] max-w-[950px] p-0 rounded-lg">
                              <ScrollArea className="h-[90vh] p-4 rounded-md">
                                <div className="mt-5 p-0 sm:p-1">
                                  <DialogHeader className="mb-4 sm:mb-6">
                                    <div className="sm:flex sm:items-center">
                                      <div className="sm:flex-auto">
                                        <DialogTitle className="text-lg sm:text-xl">
                                          {product.name} Overview
                                        </DialogTitle>
                                        <DialogDescription className="text-sm">
                                          Product details and variations
                                        </DialogDescription>
                                      </div>
                                      <div className="mt-4 sm:ml-16 sm:mt-0">
                                        <div className="bg-indigo-50 p-3 sm:p-3 rounded-full flex justify-between items-center border border-indigo-100">
                                          <h4 className="font-medium text-sm sm:text-base text-indigo-900 mr-8">
                                            Total
                                          </h4>
                                          <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full w-8 h-8">
                                            <p className="text-md sm:text-md font-bold text-indigo-700">
                                              {product.similarProducts?.length || 0}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogHeader>

                                  <div className="space-y-3">
                                    <div className="border border-gray-100 min-h-96 rounded-3xl px-4 py-2 mb-2 w-full bg-white">
                                      <div className="relative space-y-2">
                                        <button className="absolute right-0 top-0 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-full transition-colors flex items-center space-x-1">
                                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                          <span className="text-xs font-medium text-green-700">Live</span>
                                        </button>
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 pl-2">
                                          <h4 className="text-lg font-semibold">{product.category}</h4>
                                          <span className="mt-1 sm:mt-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {product.price} per {product.priceUnit}
                                          </span>
                                        </div>
                                      </div>

                                      <div className="p-2 mt-2 relative min-h-44">
                                        <button
                                          className="absolute -left-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                                          onClick={() => {
                                            const container = document.getElementById(
                                              `product-carousel-${product.id}`,
                                            )
                                            if (container) container.scrollLeft -= container.offsetWidth / 2
                                          }}
                                        >
                                          <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
                                        </button>

                                        <div
                                          id={`product-carousel-${product.id}`}
                                          className="flex overflow-x-auto sm:overflow-x-hidden scroll-smooth px-0 sm:px-0 gap-3 sm:gap-6 snap-x snap-mandatory sm:snap-none pb-4 sm:pb-0 -mx-2 sm:mx-0"
                                          ref={(el) => {
                                            if (el) carouselRefs.current[product.id] = el
                                          }}
                                        >
                                          {product.similarProducts?.map((item) => (
                                            <div
                                              key={item.id}
                                              className="flex-none w-[80%] sm:w-1/3 snap-center first:ml-2 sm:first:ml-0"
                                            >
                                              <div className="border border-gray-100 rounded-xl px-3 pt-3 p-4 hover:border-blue-200 transition-colors group/card"
                                                onMouseEnter={() => setHoveredSimilarProduct(item)}
                                                onMouseLeave={() => setHoveredSimilarProduct(null)}>
                                                <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                                                  <div className="absolute inset-0 duration-300 z-10"></div>
                                                  {hoveredSimilarProduct === item && (
                                                    <div className="absolute top-1 left-1 z-20 bg-emerald-100 text-emerald-700 font-bold text-xs px-2 py-1 rounded-full">
                                                      {item.price || product.price}
                                                    </div>
                                                  )}
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute top-1 right-1 z-20 h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 p-0 shadow-md border-2 border-white transition-all group"
                                                    onClick={() => handleProductQRClick(product, item)}
                                                  >
                                                    <QrCode className="h-5 w-5 text-white" />
                                                  </Button>
                                                  <div className="w-full h-full flex items-center justify-center">
                                                    <Image
                                                      src={item.imageUrl || "/placeholder.svg"}
                                                      alt={item.name}
                                                      {...(product.brand === "Black Rifle Coffee" || product.brand === "Kin Euphorics" || product.brand === "BestBreakFasts"
                                                        ? {
                                                            width: 200,
                                                            height: 200,
                                                          }
                                                        : {
                                                            layout: "fill",
                                                            objectFit: "cover",
                                                          }
                                                      )}
                                                      className={`transform scale-75 group-hover/card:scale-90 transition-transform duration-300 ease-in-out rounded-xl ${
                                                        product.brand === "Black Rifle Coffee" || product.brand === "Kin Euphorics" || product.brand === "BestBreakFasts"
                                                          ? "object-cover" 
                                                          : "object-contain"
                                                      }`}
                                                    />
                                                  </div>
                                                </div>
                                                <div className="space-y-3">
                                                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                      {item.name}
                                                    </span>
                                                  </div>
                                                  <p className="text-xs text-gray-600">{item.description}</p>
                                                    
                                                  <div className="flex justify-center">
                                                    <motion.button
                                                      whileHover={{ scale: 1.05 }}
                                                      whileTap={{ scale: 0.95 }}
                                                      className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-xs"
                                                      onClick={() => {
                                                        const cartItem = {
                                                          id: item.id,
                                                          name: item.name,
                                                          brand: product.brand,
                                                          price: item.price || product.price,
                                                          imageUrl: item.imageUrl || "/placeholder.svg",
                                                          quantity: 1
                                                        };
                                                        const existingCart = localStorage.getItem('cart');
                                                        let cart = [];
                                                        if (existingCart) {
                                                          cart = JSON.parse(existingCart);
                                                          const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
                                                          if (existingItemIndex >= 0) {
                                                            cart[existingItemIndex].quantity += 1;
                                                          } else {
                                                            cart.push(cartItem);
                                                          }
                                                        } else {
                                                          cart = [cartItem];
                                                        }
                                                        localStorage.setItem('cart', JSON.stringify(cart));
                                                        window.dispatchEvent(new Event('cartUpdated'));
                                                        setCartOpen(true); // Open the cart when adding an item
                                                        setCartTabOpen("cart"); // Switch to the cart tab
                                                        toast({
                                                          title: "Added to cart",
                                                          description: `${item.name} has been added to your cart.`,
                                                          variant: "default"
                                                        });
                                                      }}
                                                    >
                                                      <div className="bg-white p-1 rounded-full">
                                                        <ShoppingBag size={14} className="text-emerald-500" />
                                                      </div>
                                                      Add Cart
                                                    </motion.button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        <button
                                          className="absolute -right-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                                          onClick={() => {
                                            const container = carouselRefs.current[product.id]
                                            if (container) container.scrollLeft += container.offsetWidth / 2
                                          }}
                                        >
                                          <ChevronRight className="w-5 h-5 text-gray-700" />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </ScrollArea>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {Math.ceil(
            (firebaseProducts.length > 0 ? firebaseProducts : productData).filter((product) => {
              if (selectedCategory === "Prelims") return true
              return product.category.toLowerCase() === selectedCategory.toLowerCase()
            }).length / PRODUCTS_PER_PAGE,
          ) > 1 && (
            <div className="flex justify-center mt-8 space-x-1">
              {Array.from({
                length: Math.ceil(
                  (firebaseProducts.length > 0 ? firebaseProducts : productData).filter((product) => {
                    if (selectedCategory === "Prelims") return true
                    return product.category.toLowerCase() === selectedCategory.toLowerCase()
                  }).length / PRODUCTS_PER_PAGE,
                ),
              }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentProductPage(idx)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    idx === currentProductPage ? "bg-blue-600 w-4" : "bg-gray-300 hover:bg-blue-400"
                  }`}
                />
              ))}
            </div>
          )}

          <section className="py-16 mt-12 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto px-2 md:px-4">
              <div className="w-full rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl p-8 border border-emerald-100 relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-emerald-200/20"></div>
                <div className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-teal-200/20"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto">
                  <div className="flex flex-col items-center text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-full mb-4 shadow-lg">
                      <Tag className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-4 bg-gradient-to-r from-emerald-700 to-teal-700 bg-clip-text text-transparent">
                      CPG Brand Product Management
                    </h3>
                    <p className="text-slate-700 text-base md:text-lg max-w-3xl mb-6">
                      Brands can upload product details for their SKUs under Prelims as pre-data.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
                      <div className="bg-white p-3 rounded-3xl shadow-md hover:shadow-lg transition-all border border-emerald-100 flex items-start justify-around">
                        <div className="flex-shrink-0 bg-emerald-100 p-3 rounded-3xl">
                          <Tag className="h-4 w-4 text-emerald-600" />
                        </div>
                        <div className="w-full flex items-center h-full justify-center">
                          <p className="text-sm text-gray-600 leading-relaxed">Upload product details</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-3xl shadow-md hover:shadow-lg transition-all border border-emerald-100 flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-purple-100 p-3 rounded-3xl">
                          <BarChart className="h-4 w-4 text-purple-600" />
                        </div>
                        <div className="w-full flex items-center h-full justify-center">
                          <p className="text-sm text-gray-600 leading-relaxed">Track product performance</p>
                        </div>
                      </div>
                      
                      <div className="bg-white p-3 rounded-3xl shadow-md hover:shadow-lg transition-all border border-emerald-100 flex items-start space-x-4">
                        <div className="flex-shrink-0 bg-blue-100 p-3 rounded-3xl">
                          <QrCode className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="w-full flex items-center h-full justify-center">
                          <p className="text-sm text-gray-600 leading-relaxed">Product label QR codes</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <Link href="/manage">
                      <Button className="rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 flex items-center gap-2 px-8 py-6 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300">
                        Go to Manage Page
                        <ArrowRight className="h-5 w-5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready to Join the Community?</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
            Create your free account today and start tracking your favorite campaigns.
          </p>
          <Button
            onClick={() => setShowLoginDialog(true)}
            className="bg-gradient-to-r from-[#5159ff] to-[#4147d5] hover:from-[#4147d5] hover:to-[#5159ff] text-white rounded-3xl shadow-lg h-12 px-8 text-lg font-medium"
          >
            Create Account
          </Button>
        </div>
      </section>

      <InfluencerDialog
        influencer={selectedInfluencer}
        product={selectedProduct} 
        open={showInfluencerDialog}
        onOpenChange={setShowInfluencerDialog}
      />

      <ProductDetailDialog 
        product={selectedProduct} 
        open={showProductDialog} 
        onOpenChange={setShowProductDialog}
        // onSaveItem={(product) => {
        //   if (!product) return;
          
        //   const wishlistItem = {
        //     id: product.id || Math.random().toString(36).substr(2, 9),
        //     name: product.name,
        //     brand: product.brand,
        //     price: product.price,
        //     imageUrl: product.imageUrl || "/placeholder.svg",
        //   };
          
        //   const existingWishlist = localStorage.getItem('wishlist');
        //   let wishlist = [];
        //   if (existingWishlist) {
        //     wishlist = JSON.parse(existingWishlist);
        //     const existingItemIndex = wishlist.findIndex(item => item.id === wishlistItem.id);
        //     if (existingItemIndex < 0) {
        //       wishlist.push(wishlistItem);
        //     }
        //   } else {
        //     wishlist = [wishlistItem];
        //   }
          
        //   localStorage.setItem('wishlist', JSON.stringify(wishlist));
        //   window.dispatchEvent(new Event('wishlistUpdated'));
          
        //   toast({
        //     title: "Added to wishlist",
        //     description: `${product.name} has been added to your wishlist.`,
        //     variant: "default"
        //   });
        // }}
      />
    </div>
  )
}