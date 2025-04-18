"use client"

import { DialogTrigger } from "@/components/ui/dialog"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { FIREBASE_AUTH, FIREBASE_DB } from "../../FirebaseConfig"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth"
import { doc, setDoc } from "firebase/firestore"
import { ChevronRight, Gift, User, Bookmark, MoveRight, Store, ArrowRight, Package, BarChart, QrCode, PodcastIcon, Tag, ShoppingBag, Minus, Plus, X, Heart, Trash2 } from 'lucide-react'
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Tabs, TabsContent } from "@/components/ui/tabs"

import { InfluencerDialog } from "./Components/InfluencerDialog"
import { ProductDetailDialog } from "./Components/ProductDetailDialog"

import { productData, influencers } from "./mockdata"

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
  const slideoutRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [cartCount, setCartCount] = useState(0)

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
  const [checkoutPending, setCheckoutPending] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("cart")

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

  // Handle scroll for sticky header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Initialize cart and wishlist from localStorage
  useEffect(() => {
    const loadCart = () => {
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
        setCartCount(parsedCart.reduce((total, item) => total + item.quantity, 0))
      }

      const savedWishlist = localStorage.getItem("wishlist")
      if (savedWishlist) {
        setWishlistItems(JSON.parse(savedWishlist))
      }
    }

    loadCart()

    // Listen for cart updates
    const handleCartUpdate = () => {
      loadCart()
    }

    window.addEventListener("cartUpdated", handleCartUpdate)
    window.addEventListener("wishlistUpdated", handleCartUpdate)

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate)
      window.removeEventListener("wishlistUpdated", handleCartUpdate)
    }
  }, [])

  // Handle click outside to close cart
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        cartOpen &&
        slideoutRef.current &&
        !slideoutRef.current.contains(event.target as Node) &&
        event.target === backdropRef.current
      ) {
        setCartOpen(false)
      }
    }

    if (cartOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      // Prevent body scrolling when cart is open
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.body.style.overflow = "auto"
    }
  }, [cartOpen])

  // Handle escape key to close cart
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && cartOpen) {
        setCartOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscKey)
    return () => {
      window.removeEventListener("keydown", handleEscKey)
    }
  }, [cartOpen])

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

  // Use useCallback to memoize these functions to prevent unnecessary re-renders
  const handleQuantityChange = useCallback((itemId: number | string, change: number) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.map((item) => {
        if (item.id === itemId) {
          const newQuantity = Math.max(1, item.quantity + change)
          return { ...item, quantity: newQuantity }
        }
        return item
      })

      localStorage.setItem("cart", JSON.stringify(updatedCart))
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0))
      window.dispatchEvent(new Event("cartUpdated"))
      return updatedCart
    })
  }, [])

  const handleRemoveFromCart = useCallback((itemId: number | string) => {
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((item) => item.id !== itemId)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0))
      window.dispatchEvent(new Event("cartUpdated"))

      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })

      return updatedCart
    })
  }, [])

  const moveToWishlist = useCallback((item: any) => {
    // Remove from cart
    setCartItems((prevItems) => {
      const updatedCart = prevItems.filter((cartItem) => cartItem.id !== item.id)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0))
      return updatedCart
    })

    // Add to wishlist
    setWishlistItems((prevItems) => {
      const wishlistItem = { ...item, quantity: 1 }
      const existingWishlist = prevItems || []
      const existingItemIndex = existingWishlist.findIndex((wishItem) => wishItem.id === item.id)

      let updatedWishlist
      if (existingItemIndex >= 0) {
        updatedWishlist = existingWishlist
      } else {
        updatedWishlist = [...existingWishlist, wishlistItem]
      }

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))

      toast({
        title: "Moved to Saved",
        description: `${item.name} has been moved to your saved items`,
      })

      window.dispatchEvent(new Event("cartUpdated"))
      window.dispatchEvent(new Event("wishlistUpdated"))

      return updatedWishlist
    })
  }, [])

  const moveToCart = useCallback((item: any) => {
    // Remove from wishlist
    setWishlistItems((prevItems) => {
      const updatedWishlist = prevItems.filter((wishItem) => wishItem.id !== item.id)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
      return updatedWishlist
    })

    // Add to cart
    setCartItems((prevItems) => {
      const cartItem = { ...item, quantity: 1 }
      const existingCart = prevItems || []
      const existingItemIndex = existingCart.findIndex((cartItem) => cartItem.id === item.id)

      let updatedCart
      if (existingItemIndex >= 0) {
        updatedCart = existingCart.map((cartItem, index) =>
          index === existingItemIndex ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem,
        )
      } else {
        updatedCart = [...existingCart, cartItem]
      }

      localStorage.setItem("cart", JSON.stringify(updatedCart))
      setCartCount(updatedCart.reduce((total, item) => total + item.quantity, 0))

      toast({
        title: "Added to cart",
        description: `${item.name} has been added to your cart`,
      })

      window.dispatchEvent(new Event("cartUpdated"))
      window.dispatchEvent(new Event("wishlistUpdated"))

      return updatedCart
    })
  }, [])

  const removeFromWishlist = useCallback((itemId: number | string) => {
    setWishlistItems((prevItems) => {
      const updatedWishlist = prevItems.filter((item) => item.id !== itemId)
      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))
      window.dispatchEvent(new Event("wishlistUpdated"))

      toast({
        title: "Item removed",
        description: "Item has been removed from your saved items",
      })

      return updatedWishlist
    })
  }, [])

  const isProductSaved = useCallback(
    (productId: number | string) => {
      return wishlistItems.some((item) => item.id === productId)
    },
    [wishlistItems],
  )

  const totalCartAmount = cartItems.reduce((total, item) => {
    const price = Number.parseFloat(String(item.price).replace("$", ""))
    return total + price * item.quantity
  }, 0)

  // Mock purchase options for products
  const getPurchaseOptions = (item: any) => {
    return [
      { store: "Official Website", price: item.price, inStock: true },
      {
        store: "Nearby Store",
        price: `$${(Number.parseFloat(String(item.price).replace("$", "")) * 1.05).toFixed(2)}`,
        inStock: true,
      },
    ]
  }

  const handleCheckout = () => {
    setCheckoutPending(true)
    // Simulate checkout process
    setTimeout(() => {
      toast({
        title: "Checkout initiated",
        description: "Your order is being processed",
      })
    }, 500)
  }

  // Add a function to check if a product is in the cart
  const isProductInCart = useCallback(
    (productId: number | string) => {
      return cartItems.some((item) => item.id === productId)
    },
    [cartItems],
  )

  // Function to add a similar item to cart
  const addSimilarItemToCart = (parentProduct, similarItem) => {
    // Create a unique ID for the similar item
    const similarItemId = `${parentProduct.id}_${similarItem.id || Math.random().toString(36).substr(2, 9)}`
    
    // Create the cart item with data from both the parent product and similar item
    const cartItem = {
      id: similarItemId,
      name: similarItem.name || parentProduct.name,
      brand: parentProduct.brand,
      category: parentProduct.category,
      price: similarItem.price || parentProduct.price,
      imageUrl: similarItem.imageUrl || parentProduct.imageUrl || "/placeholder.svg",
      quantity: 1,
      parentProductId: parentProduct.id,
      parentProductName: parentProduct.name,
      isSimilarItem: true,
      description: similarItem.description || "",
    }

    // Add to cart
    const existingCart = localStorage.getItem("cart")
    let cart = []
    if (existingCart) {
      cart = JSON.parse(existingCart)
      const existingItemIndex = cart.findIndex((item) => item.id === similarItemId)
      if (existingItemIndex >= 0) {
        cart[existingItemIndex].quantity += 1
      } else {
        cart.push(cartItem)
      }
    } else {
      cart = [cartItem]
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setCartItems(cart)
    setCartCount(cart.reduce((total, item) => total + item.quantity, 0))
    setCartOpen(true)
    window.dispatchEvent(new Event("cartUpdated"))

    toast({
      title: "Added to cart",
      description: `${similarItem.name || parentProduct.name} has been added to your cart.`,
    })
  }

  // Function to add a similar item to wishlist
  const addSimilarItemToWishlist = (parentProduct, similarItem) => {
    // Create a unique ID for the similar item
    const similarItemId = `${parentProduct.id}_${similarItem.id || Math.random().toString(36).substr(2, 9)}`
    
    // Create the wishlist item with data from both the parent product and similar item
    const wishlistItem = {
      id: similarItemId,
      name: similarItem.name || parentProduct.name,
      brand: parentProduct.brand,
      category: parentProduct.category,
      price: similarItem.price || parentProduct.price,
      imageUrl: similarItem.imageUrl || parentProduct.imageUrl || "/placeholder.svg",
      parentProductId: parentProduct.id,
      parentProductName: parentProduct.name,
      isSimilarItem: true,
      description: similarItem.description || "",
    }

    // Add to wishlist
    const existingWishlist = localStorage.getItem("wishlist")
    let wishlist = []
    if (existingWishlist) {
      wishlist = JSON.parse(existingWishlist)
      const existingItemIndex = wishlist.findIndex((item) => item.id === similarItemId)
      if (existingItemIndex < 0) {
        wishlist.push(wishlistItem)
      }
    } else {
      wishlist = [wishlistItem]
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist))
    setWishlistItems(wishlist)
    window.dispatchEvent(new Event("wishlistUpdated"))

    toast({
      title: "Added to saved items",
      description: `${similarItem.name || parentProduct.name} has been added to your saved items.`,
    })
  }

  // Check if a similar item is in the cart
  const isSimilarItemInCart = useCallback(
    (parentProductId: number | string, similarItemId: number | string) => {
      const similarId = `${parentProductId}_${similarItemId}`
      return cartItems.some((item) => item.id === similarId)
    },
    [cartItems],
  )

  // Check if a similar item is saved
  const isSimilarItemSaved = useCallback(
    (parentProductId: number | string, similarItemId: number | string) => {
      const similarId = `${parentProductId}_${similarItemId}`
      return wishlistItems.some((item) => item.id === similarId)
    },
    [wishlistItems],
  )

  return (
    <div className="min-h-screen bg-white relative">
      <Button
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingBag className="h-6 w-6 text-white" />
        {cartCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 border-0 text-white">{cartCount}</Badge>
        )}
      </Button>

      <header className="w-full bg-white pt-4">
        <div className="max-w-7xl mx-auto flex justify-center items-center px-4">
          <div className="flex items-center gap-6 justify-end w-full">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9 rounded-xl">
                  <AvatarImage src={LogoImage.src || "/placeholder.svg"} alt="" />
                </Avatar>
                <span className="text-xl font-semibold text-zinc-800">Mall ai</span>
              </div>
            </Link>
          </div>
        </div>
      </header>

      {/* Custom Cart Slide-out */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            ref={backdropRef}
            className="absolute inset-0 bg-black/50 transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          {/* Slide-out panel */}
          <div
            ref={slideoutRef}
            className="relative w-[90vw] sm:max-w-md bg-white h-full shadow-xl overflow-hidden transform transition-transform duration-300 ease-in-out rounded-l-3xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-full flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-4 pt-4">
                <div className="flex items-center justify-between">
                  <div></div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none inline-flex items-center justify-center"
                    onClick={() => setCartOpen(false)}
                  >
                    <X className="h-4 w-4 text-white" />
                  </Button>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Shopping Cart
                  {cartCount > 0 && (
                    <Badge className="ml-2 bg-emerald-100 text-emerald-800 font-normal">
                      {cartCount} {cartCount === 1 ? "item" : "items"}
                    </Badge>
                  )}
                </h2>
                <div></div>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="">
                <div className="text-center my-2 px-4">
                  {/* Redesigned toggle with morphic backgrounds */}
                  <div className="inline-flex items-center justify-center bg-gray-100 rounded-3xl px-1.5 py-1 w-[90%] shadow-inner">
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTab("cart")
                      }}
                      className={`relative flex-1 py-2 px-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                        activeTab === "cart"
                          ? "bg-white text-emerald-600 font-medium shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setActiveTab("cart")
                        }
                      }}
                    >
                      <div className="flex items-center justify-center">
                        Cart
                        {cartCount > 0 && (
                          <span
                            className={`ml-2 inline-flex items-center justify-center rounded-full w-5 h-5 text-xs font-medium ${
                              activeTab === "cart"
                                ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {cartCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveTab("saved")
                      }}
                      className={`relative flex-1 py-2 px-4 rounded-2xl cursor-pointer transition-all duration-200 ${
                        activeTab === "saved"
                          ? "bg-white text-emerald-600 font-medium shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          setActiveTab("saved")
                        }
                      }}
                    >
                      <div className="flex items-center justify-center">
                        Saves
                        {wishlistItems.length > 0 && (
                          <span
                            className={`ml-2 inline-flex items-center justify-center rounded-full w-5 h-5 text-xs font-medium ${
                              activeTab === "saved"
                                ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm"
                                : "bg-emerald-100 text-emerald-800"
                            }`}
                          >
                            {wishlistItems.length}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <TabsContent value="cart" className="flex-1 flex flex-col px-4">
                  <div className="mt-2"></div>
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                      <p className="text-gray-500 mb-6 max-w-xs">Looks like you haven't added any products.</p>
                    </div>
                  ) : (
                    <div className="space-y-4 flex-1 flex flex-col">
                      <div className="max-h-[40vh] overflow-y-auto pr-1 space-y-3 flex-1">
                        {cartItems.map((item) => (
                          <Card key={item.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex items-start p-3">
                                <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-3">
                                  <Image
                                    src={item.imageUrl || "/placeholder.svg?height=64&width=64"}
                                    alt={item.name}
                                    fill
                                    sizes="64px"
                                    className="object-cover"
                                  />
                                </div>
                                <div className="flex-1">
                                  <div className="flex justify-between">
                                    <div>
                                      <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                      <p className="text-gray-500 text-xs">{item.brand}</p>
                                      {/* {item.description && (
                                        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                          {item.description}
                                        </p>
                                      )} */}
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-sm">{item.price}</p>
                                    </div>
                                  </div>
                                  <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center border rounded-lg h-8">
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="h-8 w-8 rounded-l-lg p-0 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleQuantityChange(item.id, -1)
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            handleQuantityChange(item.id, -1)
                                          }
                                        }}
                                      >
                                        <Minus className="h-3 w-3" />
                                      </div>
                                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="h-8 w-8 rounded-r-lg p-0 flex items-center justify-center cursor-pointer hover:bg-gray-100"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleQuantityChange(item.id, 1)
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            handleQuantityChange(item.id, 1)
                                          }
                                        }}
                                      >
                                        <Plus className="h-3 w-3" />
                                      </div>
                                    </div>
                                    <div className="flex gap-1">
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-50 hover:text-red-500"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleRemoveFromCart(item.id)
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            handleRemoveFromCart(item.id)
                                          }
                                        }}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </div>
                                      <div
                                        role="button"
                                        tabIndex={0}
                                        className="h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-50 hover:text-blue-500"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          moveToWishlist(item)
                                        }}
                                        onKeyDown={(e) => {
                                          if (e.key === "Enter" || e.key === " ") {
                                            e.preventDefault()
                                            moveToWishlist(item)
                                          }
                                        }}
                                      >
                                        <Bookmark className="h-4 w-4" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="px-3 pb-3 pt-1 border-t mt-1">
                                <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                                  <Store className="h-3 w-3 mr-1" /> Purchase Options
                                </p>
                                <div className="space-y-1">
                                  {getPurchaseOptions(item).map((option, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-xs">
                                      <span className="text-gray-600">{option.store}</span>
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium">{option.price}</span>
                                        <Badge
                                          className={`text-[10px] px-1.5 py-0 ${
                                            option.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                          }`}
                                        >
                                          {option.inStock ? "In Stock" : "Out of Stock"}
                                        </Badge>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>

                      <div className="border-t pt-4 space-y-4 mt-auto">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Subtotal</span>
                          <span className="font-medium">${totalCartAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Shipping</span>
                          <span>Calculated at checkout</span>
                        </div>

                        {/* Checkout button */}
                        <div
                          className="w-[100%] mx-auto mt-3 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-base shadow-md hover:opacity-95 active:opacity-90 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCheckout()
                          }}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault()
                              handleCheckout()
                            }
                          }}
                        >
                          Proceed to Checkout
                        </div>

                        {checkoutPending && (
                          <div className="text-center text-sm text-amber-600 bg-amber-50 p-2 rounded-2xl">
                            Purchase Options are currently pending
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="saved" className="flex-1 flex flex-col px-4">
                  {wishlistItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <Heart className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">No saved items</h3>
                      <p className="text-gray-500 mb-6 max-w-xs">Items you save will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[65vh] overflow-y-auto pr-1">
                      {wishlistItems.map((item) => (
                        <Card key={item.id} className="overflow-hidden">
                          <CardContent className="p-0">
                            <div className="flex items-start p-3">
                              <div className="relative h-16 w-16 rounded-md overflow-hidden bg-gray-100 mr-3">
                                <Image
                                  src={item.imageUrl || "/placeholder.svg?height=64&width=64"}
                                  alt={item.name}
                                  fill
                                  sizes="64px"
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between">
                                  <div>
                                    <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                                    <p className="text-gray-500 text-xs">{item.brand}</p>
                                    {item.isSimilarItem && item.parentProductName && (
                                      <p className="text-xs text-blue-600">
                                        From: {item.parentProductName}
                                      </p>
                                    )}
                                    {item.description && (
                                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                        {item.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-sm">{item.price}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="h-8 text-xs border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-2xl px-3 py-1 flex items-center cursor-pointer"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      moveToCart(item)
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        moveToCart(item)
                                      }
                                    }}
                                  >
                                    Move to Cart
                                    <MoveRight className="h-3 w-3 ml-1" />
                                  </div>
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="h-8 w-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-red-50 hover:text-red-500"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removeFromWishlist(item.id)
                                    }}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" || e.key === " ") {
                                        e.preventDefault()
                                        removeFromWishlist(item.id)
                                      }
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Purchase Options */}
                            <div className="px-3 pb-3 pt-1 border-t mt-1">
                              <p className="text-xs font-medium text-gray-700 mb-2 flex items-center">
                                <Store className="h-3 w-3 mr-1" /> Purchase Options
                              </p>
                              <div className="space-y-1">
                                {getPurchaseOptions(item).map((option, idx) => (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <span className="text-gray-600">{option.store}</span>
                                    <div className="flex items-center gap-2">
                                      <span className="font-medium">{option.price}</span>
                                      <Badge
                                        className={`text-[10px] px-1.5 py-0 ${
                                          option.inStock ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {option.inStock ? "In Stock" : "Out of Stock"}
                                      </Badge>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}

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
            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 text-gray-900">Discover Amazing Products</h2>
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
              <ScrollBar orientation="horizontal" className="sm:hidden" />
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
                    const idA = String(a.id)
                    const idB = String(b.id)
                    return idB.localeCompare(idA)
                  })
                  .filter((product) => {
                    if (selectedCategory === "Prelims") return true
                    if (selectedCategory === "Snacks" && product.category.toLowerCase() === "candy") return true
                    if (selectedCategory === "Snacks" && product.category.toLowerCase() === "snacks") return true
                    if (selectedCategory === "Breakfast" && product.category.toLowerCase() === "breakfast") return true
                    if (
                      selectedCategory === "Personal Care" &&
                      (product.category.toLowerCase() === "personal Care" ||
                        product.category.toLowerCase() === "deodorant")
                    )
                      return true
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
                            {...(product.brand === "Black Rifle Coffee" ||
                            product.brand === "Alani Nu" ||
                            product.brand === "Kin Euphorics"
                              ? {
                                  width: 100,
                                  height: 100,
                                }
                              : {
                                  width: 160,
                                  height: 160,
                                })}
                            className={`cursor-pointer group-hover:scale-110 transition-transform duration-300 ${
                              product.brand === "Black Rifle Coffee" ||
                              product.brand === "Alani Nu" ||
                              product.brand === "Kin Euphorics"
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
                                /
                                {product.priceUnit ||
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
                                <ScrollArea className="h-[94vh] p-4 rounded-md">
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
                                                <div
                                                  className="border border-gray-100 rounded-xl px-3 pt-3 p-4 hover:border-blue-200 transition-colors group/card"
                                                  onMouseEnter={() => setHoveredSimilarProduct(item)}
                                                  onMouseLeave={() => setHoveredSimilarProduct(null)}
                                                >
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
                                                        {...(product.brand === "Black Rifle Coffee" ||
                                                        product.brand === "Kin Euphorics" ||
                                                        product.brand === "BestBreakFasts"
                                                          ? {
                                                              width: 200,
                                                              height: 200,
                                                            }
                                                          : {
                                                              layout: "fill",
                                                              objectFit: "cover",
                                                            })}
                                                        className={`transform scale-75 group-hover/card:scale-90 transition-transform duration-300 ease-in-out rounded-xl ${
                                                          product.brand === "Black Rifle Coffee" ||
                                                          product.brand === "Kin Euphorics" ||
                                                          product.brand === "BestBreakFasts"
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
                                                        className={`${
                                                          isSimilarItemInCart(product.id, item.id)
                                                            ? "bg-gray-500 text-white"
                                                            : "bg-gradient-to-r from-emerald-400 to-teal-500 text-white"
                                                        } px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-xs`}
                                                        onClick={(e) => {
                                                          e.stopPropagation()
                                                          addSimilarItemToCart(product, item)
                                                        }}
                                                      >
                                                        <div className="bg-white p-1 rounded-full">
                                                          <ShoppingBag
                                                            size={14}
                                                            className={
                                                              isSimilarItemInCart(product.id, item.id)
                                                                ? "text-gray-500"
                                                                : "text-emerald-500"
                                                            }
                                                          />
                                                        </div>
                                                        {isSimilarItemInCart(product.id, item.id) ? "Added" : "Add Cart"}
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
        onSaveItem={(product) => {
          if (!product) return

          // If this is a similar item from a parent product
          if (product.parentProductId) {
            addSimilarItemToWishlist(
              { id: product.parentProductId, name: product.parentProductName, brand: product.brand },
              product
            )
          } else {
            const wishlistItem = {
              id: product.id || Math.random().toString(36).substr(2, 9),
              name: product.name,
              brand: product.brand,
              price: product.price,
              imageUrl: product.imageUrl || "/placeholder.svg",
            }

            const existingWishlist = localStorage.getItem("wishlist")
            let wishlist = []
            if (existingWishlist) {
              wishlist = JSON.parse(existingWishlist)
              const existingItemIndex = wishlist.findIndex((item) => item.id === wishlistItem.id)
              if (existingItemIndex < 0) {
                wishlist.push(wishlistItem)
              }
            } else {
              wishlist = [wishlistItem]
            }

            localStorage.setItem("wishlist", JSON.stringify(wishlist))
            window.dispatchEvent(new Event("wishlistUpdated"))

            toast({
              title: "Added to wishlist",
              description: `${product.name} has been added to your wishlist.`,
              variant: "default",
            })
          }
        }}
      />
    </div>
  )
}
