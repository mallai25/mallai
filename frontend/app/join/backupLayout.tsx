"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ShoppingBag,
  Plus,
  Minus,
  Heart,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Bookmark,
  BookmarkCheck,
  Trash2,
  MoveRight,
  Store,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"

// Import mock data directly
import { productData, categories, influencers } from "./mockdata"

export default function Market() {
  const router = useRouter()
  const [cartOpen, setCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [cartCount, setCartCount] = useState(0)
  const [expandedProductIds, setExpandedProductIds] = useState<number[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("cart")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [checkoutPending, setCheckoutPending] = useState(false)
  const slideoutRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)

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

  const toggleProductExpansion = (productId: number) => {
    setExpandedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleCategoryChange = (category: string) => {
    setCategoryFilter(category)
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

  const filteredProducts = productData.filter((product) => {
    const matchesCategory = categoryFilter === "all" || product.category.toLowerCase() === categoryFilter.toLowerCase()
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  })

  const isProductSaved = useCallback(
    (productId: number) => {
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
        store: "Amazon",
        price: `$${(Number.parseFloat(item.price.replace("$", "")) * 1.05).toFixed(2)}`,
        inStock: true,
      },
      {
        store: "Target",
        price: `$${(Number.parseFloat(item.price.replace("$", "")) * 0.95).toFixed(2)}`,
        inStock: false,
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

  return (
    <div className="min-h-screen bg-white">
      {/* Fixed cart button */}
      <Button
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all duration-200"
        onClick={() => setCartOpen(true)}
      >
        <ShoppingBag className="h-6 w-6 text-white" />
        {cartCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 border-0 text-white">{cartCount}</Badge>
        )}
      </Button>

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
                    className="h-8 w-8 rounded-full"
                    onClick={() => setCartOpen(false)}
                  >
                    <X className="h-4 w-4" />
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
                      Cart
                      {cartCount > 0 && (
                        <span
                          className={`ml-1 inline-flex items-center justify-center rounded-full w-5 h-5 text-xs font-medium ${
                            activeTab === "cart"
                              ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-white shadow-sm"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {cartCount}
                        </span>
                      )}
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
                      Saved
                      {wishlistItems.length > 0 && (
                        <span
                          className={`ml-1 inline-flex items-center justify-center rounded-full w-5 h-5 text-xs font-medium ${
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

                <TabsContent value="cart" className="flex-1 flex flex-col px-4">
                  <div className="mt-2"></div>
                  {cartItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="bg-gray-100 rounded-full p-4 mb-4">
                        <ShoppingBag className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-1">Your cart is empty</h3>
                      <p className="text-gray-500 mb-6 max-w-xs">
                        Looks like you haven't added any products.
                      </p>
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
                          className="w-[100%] mx-auto mt-4 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium text-base shadow-md hover:opacity-95 active:opacity-90 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
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
                          <div className="text-center text-sm text-amber-600 bg-amber-50 p-2 rounded-md">
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
                      <p className="text-gray-500 mb-6 max-w-xs">
                        Items you save will appear here
                      </p>
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
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium text-sm">{item.price}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                  <div
                                    role="button"
                                    tabIndex={0}
                                    className="h-8 text-xs border border-emerald-500 text-emerald-600 hover:bg-emerald-50 rounded-md px-3 py-1 flex items-center cursor-pointer"
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
                                          option.inStock
                                            ? "bg-green-100 text-green-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {option.inStock ? "In Stock" : "Out of Stock"}
                                      </Badge>
                                    </div>
                                  </div>
                                    )
                                )}
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

      {/* Header */}
      <div className={`sticky top-0 bg-white z-30 transition-shadow duration-300 ${isScrolled ? "shadow-md" : ""}`}>
        <div className="container max-w-6xl mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="relative h-8 w-8">
                <Image
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100&auto=format&fit=crop"
                  alt="Logo"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <span className="text-xl font-semibold text-gray-900">Product Market</span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="relative w-full max-w-[200px] lg:max-w-[300px]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 overflow-x-auto pb-2 -mx-4 px-4">
            <div className="flex space-x-2 min-w-max">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={categoryFilter === category.id ? "default" : "outline"}
                  className={`rounded-full px-4 text-xs ${
                    categoryFilter === category.id
                      ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container max-w-6xl mx-auto px-4 py-6">
        {/* Influencer section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Creators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {influencers.map((influencer) => (
              <div
                key={influencer.id}
                className="relative overflow-hidden rounded-xl cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(`/${influencer.id}`)}
              >
                <div className="aspect-[4/5] relative">
                  <Image
                    src={influencer.image || "/placeholder.svg?height=400&width=300"}
                    alt={influencer.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-white font-semibold text-lg leading-tight">{influencer.name}</h3>
                  <p className="text-white/80 text-sm mt-1 line-clamp-1">{influencer.brand}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Products section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden h-full flex flex-col">
                <div
                  className="aspect-square relative cursor-pointer"
                  onClick={() => router.push(`/product?id=${product.id}`)}
                >
                  <Image
                    src={product.imageSrc || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()

                      // Toggle wishlist
                      if (isProductSaved(product.id)) {
                        const updatedWishlist = wishlistItems.filter((item) => item.id !== product.id)
                        setWishlistItems(updatedWishlist)
                        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))

                        toast({
                          title: "Removed from Saved",
                          description: `${product.name} has been removed from your saved items`,
                        })
                      } else {
                        const wishlistItem = {
                          id: product.id,
                          name: product.name,
                          brand: product.brand,
                          price: product.price,
                          imageUrl: product.imageSrc,
                          quantity: 1,
                        }

                        const updatedWishlist = [...wishlistItems, wishlistItem]
                        setWishlistItems(updatedWishlist)
                        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist))

                        toast({
                          title: "Added to Saved",
                          description: `${product.name} has been added to your saved items`,
                        })
                      }

                      window.dispatchEvent(new Event("wishlistUpdated"))
                    }}
                  >
                    {isProductSaved(product.id) ? (
                      <BookmarkCheck className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Bookmark className="h-5 w-5 text-gray-600" />
                    )}
                  </Button>
                </div>
                <CardContent className="flex flex-col flex-1 p-3">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                        <p className="text-gray-500 text-xs">{product.brand}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">{product.price}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs mt-1 line-clamp-2">{product.description}</p>
                  </div>

                  <div className="mt-3">
                    {product.similarProducts && product.similarProducts.length > 0 && (
                      <div className="mb-2">
                        <button
                          className="text-xs text-emerald-600 flex items-center gap-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleProductExpansion(product.id)
                          }}
                        >
                          {expandedProductIds.includes(product.id) ? (
                            <>
                              Hide variants <ChevronUp className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              Show variants <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>

                        {expandedProductIds.includes(product.id) && (
                          <div className="grid grid-cols-4 gap-1 mt-2">
                            {product.similarProducts.map((item) => (
                              <div
                                key={item.id}
                                className="aspect-square relative cursor-pointer rounded-md overflow-hidden border-2 hover:border-emerald-500 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Logic to show variant
                                }}
                              >
                                <Image
                                  src={item.imageUrl || "/placeholder.svg?height=48&width=48"}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 768px) 25vw, 10vw"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-emerald-400 to-teal-500 text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-xs"
                        onClick={(e) => {
                          e.stopPropagation()
                          const cartItem = {
                            id: product.id,
                            name: product.name,
                            brand: product.brand,
                            price: product.price,
                            imageUrl: product.imageSrc,
                            quantity: 1,
                          }
                          const existingCart = localStorage.getItem("cart")
                          let cart = []
                          if (existingCart) {
                            cart = JSON.parse(existingCart)
                            const existingItemIndex = cart.findIndex((cartItem) => cartItem.id === product.id)
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
                            description: `${product.name} has been added to your cart.`,
                          })
                        }}
                      >
                        <div className="bg-white p-1 rounded-full">
                          <ShoppingBag size={14} className="text-emerald-500" />
                        </div>
                        Add Cart
                      </motion.button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
