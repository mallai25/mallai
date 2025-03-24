"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { ChevronDown, ChevronUp, Plus, Store, Package, Users, PenIcon, Eye, ChevronRight, X, Gift, ChevronLeft, QrCode, Loader2, Upload, Play } from "lucide-react"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useRef, useEffect } from "react"
import Image from 'next/image';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore"
import { getAuth } from "firebase/auth"
import axios from 'axios'
import { toast } from "sonner" // Add this import
import { ProductDetailDialog } from "./Components/ProductDetailDialog";
import { joyrideProducts } from "./mockdata";


// Campaign Thumbnail
import JoyPack from './images/JoyPack.jpg'
import RyanAir from './images/RyanAir.jpeg'


interface RecentPurchase {
  id: string;
  user: {
    name: string;
    avatar: string;
    location: string;
  };
  product: string;
  time: string;
  amount: string;
}

interface FirebaseRewardData {
  userId: string;
  rewardWinners: RewardWinner[];
  totalPoints: number;
  activeCampaigns: number;
  createdAt: Date;
  updatedAt: Date;
}

interface RewardWinner {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  location: string;
  points: number;
  achievements?: number;
  email?: string;
  uploadCount?: number;
  rank?: number;
  stamps?: Array<{
    date: string;
    stamped: boolean;
  }>;
  purchaseHistory?: Array<{
    product: string;
    date: string;
  }>;
  receipts?: Array<{
    id: string;
    image: string;
    date: string;
    amount: string;
  }>;
}

const RewardThen: RewardWinner[] = [
  {
    id: "1",
    name: "John Smith",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    joinDate: "2024-02-07",
    location: "New York",
    points: 1250,
    email: "john.smith@example.com",
    uploadCount: 3,
    rank: 1,
    stamps: [
      { date: '2024-02-07', stamped: true },
      { date: '2024-02-06', stamped: true },
      { date: '2024-02-05', stamped: true },
      { date: '', stamped: false },
      { date: '', stamped: false },
      { date: '', stamped: false }
    ],
    purchaseHistory: [
      { product: "Sour Strawberry Strips", date: "2024-02-07 14:30" },
      { product: "Yellow Lemon Strips", date: "2024-02-06 11:20" },
      { product: "Blue Raspberry Strips", date: "2024-02-05 09:45" }
    ],
    receipts: [
      { id: "r1", image: "/images/receipts/receipt1.jpg", date: "2024-02-07", amount: "$45.99" },
      { id: "r2", image: "/images/receipts/receipt2.jpg", date: "2024-02-06", amount: "$32.50" },
      { id: "r3", image: "/images/receipts/receipt3.jpg", date: "2024-02-05", amount: "$28.75" }
    ]
  },
  {
    id: "2",
    name: "Emma Wilson",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    joinDate: "2024-02-06",
    location: "Los Angeles",
    points: 980,
    email: "emma.wilson@example.com",
    uploadCount: 2,
    rank: 2,
    stamps: [
      { date: '2024-02-07', stamped: true },
      { date: '2024-02-06', stamped: true },
      { date: '', stamped: false },
      { date: '', stamped: false },
      { date: '', stamped: false },
      { date: '', stamped: false }
    ],
    purchaseHistory: [
      { product: "Green Apple Strips", date: "2024-02-06 16:15" },
      { product: "Blue Raspberry Strips", date: "2024-02-05 13:40" }
    ],
    receipts: [
      { id: "r4", image: "/images/receipts/receipt4.jpg", date: "2024-02-06", amount: "$55.99" },
      { id: "r5", image: "/images/receipts/receipt5.jpg", date: "2024-02-05", amount: "$129.99" }
    ]
  },
  {
    id: "3",
    name: "Michael Chen",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    joinDate: "2024-02-05",
    location: "San Francisco",
    points: 850,
    email: "michael.chen@example.com",
    uploadCount: 1,
    rank: 3,
    stamps: [
      { date: '2024-02-07', stamped: true },
      { date: '', stamped: false },
      { date: '', stamped: false },
      { date: '', stamped: false },
      { date: '', stamped: false },
      { date: '', stamped: false }
    ],
    purchaseHistory: [
      { product: "Green Apple Strips", date: "2024-02-05 10:25" }
    
    ],
    receipts: [
      { id: "r6", image: "/images/receipts/receipt6.jpg", date: "2024-02-05", amount: "$42.99" }
    ]
  }
]

interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image?: string;
}

interface Campaign {
  id: string;
  name: string;
  listingDate: string;
  endDate: string;
  status: string;
  creator: string;
  creatorRole: string;
  rewards: Reward[];
  description: string;
  image?: any;
}

interface FirebaseCampaign extends Campaign {
  userId: string;
  createdAt: Date;
}

interface ParticipantReceipt {
  id: string;
  name: string;
  avatar: string;
  joinDate: string;
  location: string;
  email: string;
  receiptImage: string;
  uploadCount: number;
  stamps: {
    date: string;
    stamped: boolean;
  }[];
}

const activeCampaigns: Campaign[] = [
  {
    id: "c1",
    name: "Win a Box of JoyRide",
    listingDate: "2024-02-01",
    endDate: "2024-03-01",
    status: "active",
    creator: "Ryan Trahan",
    creatorRole: "Organizer",
    description: "Get a whole Pack of JoyRide Flavours delivered to you",
    image: JoyPack,
    rewards: []
  },
  {
    id: "c2",
    name: "Be in a Ryan Trahan Vlog!",
    listingDate: "2024-02-15",
    endDate: "2024-03-15",
    status: "active",
    creator: "Tea Emporium",
    creatorRole: "Sponsor",
    description: "Top participants will be featured in a vlog alongside Ryan",
    image: RyanAir,
    rewards: []
  }
]

const activeProducts = [
  { id: 1, name: "Chocolate Bar", status: "In Stock", inventory: 150 },
  { id: 2, name: "Gummy Bears", status: "Low Stock", inventory: 50 },
  { id: 3, name: "Lollipops", status: "In Stock", inventory: 200 },
  { id: 4, name: "Tropical Delight", status: "Out of Stock", inventory: 0 }
]

const initialStoreLocations = [
  { id: 1, name: "Sweet Spot Central", address: "123 Main St, New York, NY", type: "Flagship" },
  { id: 2, name: "Treats & More", address: "789 Oak Ave, Chicago, IL", type: "Flagship" },
  { id: 3, name: "Sugar Rush", address: "321 Pine St, Miami, FL", type: "Retail Partner" }
];

interface CampaignMedia {
  videoUrl: string;
  thumbnailUrl: string;
}

interface AnalyticsTabProps {
  userProducts: any[]
}

export function AnalyticsTab( AnalyticsTabProps) {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string>('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadInterface, setShowUploadInterface] = useState(false);
  const [isThumbnailOnly, setIsThumbnailOnly] = useState(false);
  
  const [products, setProducts] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const [openPoll, setOpenPoll] = useState<string | null>(null);
  const [storeLocations, setStoreLocations] = useState(initialStoreLocations);
  const [newStore, setNewStore] = useState({
    name: "",
    address: "",
    type: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [editingStore, setEditingStore] = useState(null);
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchase[]>([]);
  const [rewardWinners, setRewardWinners] = useState<RewardWinner[]>([
    
  ]);
  const [allSubmissions, setAllSubmissions] = useState<number>(0);
  const [todaySubmissions, setTodaySubmissions] = useState<number>(0);
  const [selectedParticipant, setSelectedParticipant] = useState<ParticipantReceipt | null>(null);
  const [currentParticipantsPage, setCurrentParticipantsPage] = useState(0);
  const [currentCampaignsPage, setCurrentCampaignsPage] = useState(0);
  const [currentTopPartIndex, setCurrentTopPartIndex] = useState(0);
  const [isTopPartAutoPlaying, setIsTopPartAutoPlaying] = useState(true);
  const [topParticipants, setTopParticipants] = useState<RewardWinner[]>([]);
  const topPartAutoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const PARTICIPANTS_PER_PAGE = 3;
  const CAMPAIGNS_PER_PAGE = 2;

  const [showProductDialog, setShowProductDialog] = useState(false)
  
  const auth = getAuth();
  const user = auth.currentUser;

  const fetchUserData = async () => {
    if (!user?.uid) return;
    
    try {
      setIsLoading(true)
      const userRef = doc(FIREBASE_DB, "users", user.uid)
      const userSnap = await getDoc(userRef)
      
      if (userSnap.exists()) {
        const userData = userSnap.data()
        if (userData.products) {
          setProducts(userData.products)
        }
        if (userData.stores) {
          setStoreLocations(userData.stores)
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   fetchUserData()
  // }, [user?.uid])

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, 
        formData
      );
      if (response.data.success) {
        return response.data.data.secure_url;
      }
      return null;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const uploadToCloudinary = async (file: File, type: 'video' | 'image') => {
    if (type === 'image') {
      return uploadImage(file);
    }
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload-video`, 
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
            setUploadProgress(progress);
          }
        }
      );
  
      if (response.data.success) {
        return response.data.data.secure_url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error(`Error uploading video:`, error);
      throw error;
    }
  };

  const handleMediaSubmit = async () => {
    if (!user?.uid || !videoFile) return;
    
    setIsUploading(true);
    try {
      // Upload video
      const videoUrl = await uploadToCloudinary(videoFile, 'video');
      
      // Upload thumbnail if exists
      let thumbnailUrl = null;
      if (thumbnailFile) {
        thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'image');
      }
  
      const userRef = doc(FIREBASE_DB, "users", user.uid);
      await updateDoc(userRef, {
        campaignMedia: {
          videoUrl,
          thumbnailUrl,
          updatedAt: new Date()
        }
      });
  
      toast.success('Media uploaded successfully!');
      
      // Update preview states
      setVideoPreview(videoUrl);
      if (thumbnailUrl) {
        setThumbnailPreview(thumbnailUrl);
      }
      
    } catch (error) {
      console.error('Error uploading media:', error);
      toast.error('Failed to upload media');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Clear file selections after successful upload
      setVideoFile(null);
      setThumbnailFile(null);
    }
  };

  const handleThumbnailOnlyUpdate = async () => {
    if (!user?.uid || !thumbnailFile) return;
    
    setIsUploading(true);
    try {
      const thumbnailUrl = await uploadToCloudinary(thumbnailFile, 'image');
      
      const userRef = doc(FIREBASE_DB, "users", user.uid);
      await updateDoc(userRef, {
        'campaignMedia.thumbnailUrl': thumbnailUrl,
        'campaignMedia.updatedAt': new Date()
      });

      toast.success('Thumbnail updated successfully!');
      setThumbnailPreview(thumbnailUrl);
      
    } catch (error) {
      console.error('Error updating thumbnail:', error);
      toast.error('Failed to update thumbnail');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setThumbnailFile(null);
      setIsThumbnailOnly(false);
    }
  };

  useEffect(() => {
    const fetchCampaignMedia = async () => {
      if (!user?.uid) return;
      
      try {
        const userRef = doc(FIREBASE_DB, "users", user.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          const userData = userSnap.data();
          if (userData.campaignMedia) {
            setVideoPreview(userData.campaignMedia.videoUrl);
            setThumbnailPreview(userData.campaignMedia.thumbnailUrl);
          }
        }
      } catch (error) {
        console.error('Error fetching campaign media:', error);
      }
    };

    fetchCampaignMedia();
  }, [user?.uid]);

  const handleAddStore = async () => {
    if (!user?.uid || !newStore.name || !newStore.address || !newStore.type) return;

    const storeToAdd = {
      id: Date.now(),
      ...newStore
    }

    try {
      const userRef = doc(FIREBASE_DB, "users", user.uid)
      await updateDoc(userRef, {
        stores: arrayUnion(storeToAdd)
      })
      
      setStoreLocations(prev => [...prev, storeToAdd])
      setNewStore({ name: "", address: "", type: "" })
    } catch (error) {
      console.error("Error adding store:", error)
    }
  }

  const handleProductQRClick = (product) => {
    setSelectedProduct(product)
    setShowProductDialog(true)
  }


  // const handleDeleteStore = async (storeId) => {
  //   if (!user?.uid) return;

  //   try {
  //     const storeToDelete = storeLocations.find(store => store.id === storeId)
  //     if (!storeToDelete) return;

  //     const userRef = doc(FIREBASE_DB, "users", user.uid)
  //     await updateDoc(userRef, {
  //       stores: arrayRemove(storeToDelete)
  //     })
      
  //     setStoreLocations(prev => prev.filter(store => store.id !== storeId))
  //   } catch (error) {
  //     console.error("Error deleting store:", error)
  //   }
  // }

  // const handleEditStore = async (store) => {
  //   if (!user?.uid) return;
    
  //   try {
  //     const userRef = doc(FIREBASE_DB, "users", user.uid);
  //     const updatedStores = storeLocations.map(s => 
  //       s.id === store.id ? store : s
  //     );
      
  //     await updateDoc(userRef, {
  //       stores: updatedStores
  //     });
      
  //     setStoreLocations(updatedStores);
  //     setEditingStore(null);
  //   } catch (error) {
  //     console.error("Error updating store:", error);
  //   }
  // };

  // const startAutoPlay = () => {
  //   if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  //   autoPlayRef.current = setInterval(() => {
  //     setCurrentIndex((prev) => 
  //       prev === recentPurchases.length - 1 ? 0 : prev + 1
  //     );
  //   }, 3000);
  // };

  // useEffect(() => {
  //   if (isAutoPlaying) {
  //     startAutoPlay();
  //   }
  //   return () => {
  //     if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  //   };
  // }, [isAutoPlaying]);

  // const startTopPartAutoPlay = () => {
  //   if (topPartAutoPlayRef.current) clearInterval(topPartAutoPlayRef.current);
  //   topPartAutoPlayRef.current = setInterval(() => {
  //       setCurrentTopPartIndex((prev) => 
  //       prev === topParticipants.length - 1 ? 0 : prev + 1
  //       );
  //   }, 3000);
  // };

  // useEffect(() => {
  //   if (isTopPartAutoPlaying) {
  //     startTopPartAutoPlay();
  //   }
  //   return () => {
  //     if (topPartAutoPlayRef.current) clearInterval(topPartAutoPlayRef.current);
  //   };
  // }, [isTopPartAutoPlaying]);

  // const handleSlideChange = (index: number) => {
  //   setCurrentIndex(index);
  //   setIsAutoPlaying(false);
  //   if (autoPlayRef.current) clearInterval(autoPlayRef.current);
  // };

  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  const handleTopPartMouseEnter = () => setIsTopPartAutoPlaying(false);
  const handleTopPartMouseLeave = () => setIsTopPartAutoPlaying(true);

  const renderActiveProductsDialog = () => (
    <>
      <Dialog>
        <DialogTrigger id="products-dialog-trigger" asChild>
          <span className="hidden">Open Products</span>
        </DialogTrigger>
        <DialogContent className="w-[95vw] max-w-[950px] p-0 rounded-lg">
          <ScrollArea className="h-[84vh] p-4 rounded-md">
            <div className="mt-5 p-0 sm:p-1">
              <DialogHeader className="mb-4 sm:mb-6">
                <div className="sm:flex sm:items-center">
                  <div className="sm:flex-auto">
                    <DialogTitle className="text-lg sm:text-xl">Active Products Overview</DialogTitle>
                    <DialogDescription className="text-sm">
                      Overview of our active products  
                    </DialogDescription>
                  </div>
                  <div className="mt-4 sm:ml-16 sm:mt-0">
                    <div className="bg-indigo-50 p-3 sm:p-3 rounded-full flex justify-between items-center border border-indigo-100">
                      <h4 className="font-medium text-sm sm:text-base text-indigo-900 mr-8">Total</h4>
                      <div className="inline-flex items-center justify-center bg-indigo-100 rounded-full w-8 h-8">
                        <p className="text-md sm:text-md font-bold text-indigo-700">4</p>
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
                                                          <h4 className="text-lg font-semibold">Candy Strips</h4>
                                                          <span className="mt-1 sm:mt-0 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                            32g (1.13 oz)
                                                          </span>
                                                        </div>
                                                      </div>
              
                                                      <div className="p-2 mt-2 relative min-h-44">
                                                      <button 
                            className="absolute -left-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                            onClick={() => {
                              const container = document.getElementById('product-candy');
                              if (container) container.scrollLeft -= container.offsetWidth / 2;
                            }}
                          >
                            <ChevronLeft className="w-5 h-5 text-gray-700" />
                          </button>
              
                                                        <div
                            id="product-candy"
                            className="flex overflow-x-auto sm:overflow-x-hidden scroll-smooth px-0 sm:px-0 gap-3 sm:gap-6 snap-x snap-mandatory sm:snap-none pb-4 sm:pb-0 -mx-2 sm:mx-0"
                                                        >
                                                          {joyrideProducts?.map((item: any) => (
                                                            <div
                                                              key={item.id}
                                                              className="flex-none w-[80%] sm:w-1/3 snap-center first:ml-2 sm:first:ml-0"
                                                            >
                                                              <div className="border border-gray-100 rounded-xl p-3 hover:border-blue-200 transition-colors group/card">
                                                                <div className="relative aspect-square rounded-lg overflow-hidden cursor-pointer">
                                                                  <div className="absolute inset-0 duration-300 z-10"></div>
                                                                  <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="absolute top-1 right-1 z-20 h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-500 p-0 shadow-md border-2 border-white transition-all group"
                                                                    onClick={() => handleProductQRClick(item)}
                                                                  >
                                                                    <QrCode className="h-5 w-5 text-white" />
                                                                  </Button>
                                                                  <div className="w-full h-full flex items-center justify-center">
                                                                    <Image
                                                                      src={item.imageUrl || "/placeholder.svg"}
                                                                      alt={item.name}
                                                                      layout="fill"
                                                                      objectFit="cover"
                                                                      className="object-contain transform scale-75 group-hover/card:scale-90 transition-transform duration-300 ease-in-out"
                                                                    />
                                                                  </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                  <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                                                                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                                      {item.name}
                                                                    </span>
                                                                  </div>
                                                                  <p className="text-xs text-gray-600">{item.description}</p>
                                                                </div>
                                                              </div>
                                                            </div>
                                                          ))}
                                                        </div>
              
                                                        <button 
                            className="absolute -right-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                            onClick={() => {
                              const container = document.getElementById('product-candy');
                              if (container) container.scrollLeft += container.offsetWidth / 2;
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

      <ProductDetailDialog 
        product={selectedProduct}
        open={showProductDialog}
        onOpenChange={setShowProductDialog} />
    </>
  )

  const renderActiveProductsCard = () => (
    <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Active Products</CardTitle>
        <Package className="h-4 w-4 text-indigo-200" />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">4</div>
        <p className="text-xs text-indigo-200">Products in circulation</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm rounded-xl"
          onClick={() => document.getElementById('products-dialog-trigger').click()}
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          View Details
        </Button>
      </CardContent>
    </Card>
  )

  const getStoreStats = () => {
    const flagshipCount = storeLocations.filter(store => store.type === 'Flagship').length
    const retailPartnerCount = storeLocations.filter(store => store.type === 'Retail Partner').length
    const total = storeLocations.length

    return { flagshipCount, retailPartnerCount, total }
  }

  const storeStats = getStoreStats()

  const renderStoreLocationsCard = () => (
    <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white shadow-lg rounded-3xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Store Locations</CardTitle>
        <Store className="h-4 w-4 text-blue-200" />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold">{storeStats.total}</div>
        <p className="text-xs text-blue-200">Locations worldwide</p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm rounded-xl"
          onClick={() => document.getElementById('stores-dialog-trigger').click()}
        >
          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
          View Locations
        </Button>
      </CardContent>
    </Card>
  )

  const renderStoreNetworkStats = () => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      <div className="bg-blue-50 p-3 sm:p-4 rounded-xl">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm sm:text-base text-blue-900">Total</h4>
        </div>
        <p className="text-xl sm:text-2xl font-bold text-blue-700">{storeStats.total}</p>
      </div>
      <div className="bg-cyan-50 p-3 sm:p-4 rounded-xl">
        <h4 className="font-medium text-sm sm:text-base text-cyan-900">Flagships</h4>
        <p className="text-xl sm:text-2xl font-bold text-cyan-700">{storeStats.flagshipCount}</p>
      </div>
      <div className="bg-sky-50 p-3 sm:p-4 rounded-xl">
        <h4 className="font-medium text-sm sm:text-base text-sky-900">Retail Partners</h4>
        <p className="text-xl sm:text-2xl font-bold text-sky-700">{storeStats.retailPartnerCount}</p>
      </div>
    </div>
  )

  const renderStoreForm = () => (
    <Card className="p-6 rounded-2xl">
      <h3 className="font-medium text-lg mb-4">Store Location</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Input 
          placeholder="Store Name"
          value={newStore.name}
          onChange={(e) => setNewStore({...newStore, name: e.target.value})}
          className="w-full"
        />
        <Input 
          placeholder="Store Address"
          value={newStore.address}
          onChange={(e) => setNewStore({...newStore, address: e.target.value})}
          className="w-full"
        />
        <div className="w-full">
          <Select 
            value={newStore.type}
            onValueChange={(value) => setNewStore({...newStore, type: value})}
          >
            <SelectTrigger>
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Flagship">Flagship</SelectItem>
              <SelectItem value="Retail Partner">Retail Partner</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button 
          onClick={handleAddStore} 
          className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white rounded-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Store
        </Button>
      </div>
    </Card>
  );

  const renderStoreCard = (store, index) => (
    <Card 
      key={`${store.id}-${index}`} 
      className="p-4 bg-white">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-medium text-base">{store.name}</h3>
              <p className="text-sm text-gray-500 mt-2">{store.address}</p>
            </div>
          </div>
          <div className="flex justify-between items-center mt-auto">
            <span className={`px-3 py-1 rounded-full text-sm ${
              store.type === 'Flagship' 
                ? 'bg-indigo-100 text-indigo-800' 
                : 'bg-emerald-100 text-emerald-800'
            }`}>
              {store.type}
            </span>
            <Button 
              variant="ghost" 
              size="sm"
            >
              <PenIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
    </Card>
  );

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(FIREBASE_DB, "users", user.uid);
        
        // Fetch purchases
        const purchasesQuery = query(
          collection(FIREBASE_DB, 'purchases'),
          where('userId', '==', user.uid),
          orderBy('date', 'desc'),
          limit(5)
        );
        const purchasesSnap = await getDocs(purchasesQuery);
        const purchasesData = purchasesSnap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as RecentPurchase));
        setRecentPurchases(purchasesData);

        // Fetch rewards data and sort by points
        const rewardsQuery = query(
          collection(FIREBASE_DB, 'rewards'),
          orderBy('totalPoints', 'desc'),
          limit(10)
        );
        const rewardsSnap = await getDocs(rewardsQuery);
        const allRewardWinners: RewardWinner[] = [];
        
        rewardsSnap.docs.forEach(doc => {
          const data = doc.data() as FirebaseRewardData;
          allRewardWinners.push(...data.rewardWinners);
        });

        // Sort reward winners by points and take top 3
        const sortedWinners = allRewardWinners
          .sort((a, b) => (b.points || 0) - (a.points || 0))
          .slice(0, 3)
          .map((winner, index) => ({
            ...winner,
            rank: index + 1
          }));

        setTopParticipants(sortedWinners);
        setRewardWinners(allRewardWinners);

        // Update campaigns fetch to match HistoryTab
        try {
          const campaignsQuery = query(
          collection(FIREBASE_DB, 'campaigns'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
          );
          
          const campaignsSnap = await getDocs(campaignsQuery);
          const campaignsData = campaignsSnap.docs.map(doc => ({
          ...(doc.data() as FirebaseCampaign),
          id: doc.id,
          }));
          
        } catch (error: any) {
          if (error.code === 'failed-precondition') {
          // Fallback to simple query without ordering
          const campaignsSnap = await getDocs(
            query(
            collection(FIREBASE_DB, 'campaigns'),
            where('userId', '==', user.uid)
            )
          );
          
          const campaignsData = campaignsSnap.docs.map(doc => ({
            ...(doc.data() as FirebaseCampaign),
            id: doc.id,
          }));
          
          (campaignsData);
          } else {
          throw error;
          }
        }

        // Fetch submissions
        const submissionsQuery = query(
          collection(FIREBASE_DB, 'submissions'),
          where('userId', '==', user.uid)
        );
        const submissionsSnap = await getDocs(submissionsQuery);
        const allSubs = submissionsSnap.docs.length;
        setAllSubmissions(allSubs);

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todaySubs = submissionsSnap.docs.filter(doc => {
          const submissionDate = doc.data().date.toDate();
          return submissionDate >= today;
        }).length;
        setTodaySubmissions(todaySubs);

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchAnalyticsData();
  }, [user?.uid]);

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  const renderMediaUploadInterface = () => (
    <div className="space-y-4 pt-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Video Media</label>
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept="video/*"
              onChange={handleVideoUpload}
              className="hidden"
              id="campaign-video"
            />
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() => document.getElementById('campaign-video')?.click()}
            >
              <Upload className="w-4 h-4 mr-2" />
              Select Video
            </Button>
          </div>
        </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Video Thumbnail</label>
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            className="hidden"
            id="thumbnail-image"
          />
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={() => document.getElementById('thumbnail-image')?.click()}
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Thumbnail
          </Button>
        </div>
      </div>

      {thumbnailFile && videoPreview && !videoFile && (
        <Button
          className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-full"
          onClick={handleThumbnailOnlyUpdate}
          disabled={isUploading}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Updating Thumbnail...
            </>
          ) : (
            'Update Thumbnail'
          )}
        </Button>
      )}
    </div>
  );

  const handlePlay = () => {
    // Add your play functionality here
  };

  return (
    <div className="flex-1 p-0 sm:p-1 space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {renderActiveProductsCard()}
        {renderStoreLocationsCard()}
        <Card className="bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-lg rounded-3xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Campaign Participants</CardTitle>
            <Users className="h-4 w-4 text-pink-200" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">3,892</div>
            <p className="text-xs text-pink-200">Submissions</p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="w-full mt-4 bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm rounded-xl"
              onClick={() => document.getElementById('participants-dialog-trigger').click()}
            >
              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              View Participants
            </Button>
          </CardContent>
        </Card>

        <Dialog>
          <DialogTrigger id="stores-dialog-trigger" asChild>
            <span className="hidden">Open Stores</span>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[830px] p-0 rounded-lg">
            <ScrollArea className="flex-1 h-[90vh] overflow-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] p-4 rounded-md">
              <div className="p-0 sm:p-1">
                <DialogHeader className="mb-4 sm:mb-6">
                  <DialogTitle className="text-lg sm:text-xl">Store Network</DialogTitle>
                  <DialogDescription>
                    Distribution network and store management
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 sm:space-y-6">
                  {renderStoreNetworkStats()}
                  {renderStoreForm()}

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...storeLocations].map((store, index) => renderStoreCard(store, index))}
                  </div>
                </div>
              </div>
              <ScrollBar orientation="vertical" className="bg-gray-100 w-2" />
            </ScrollArea>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger id="participants-dialog-trigger" asChild>
            <span className="hidden">Open Participants</span>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-[1000px] p-0 rounded-lg">
            <ScrollArea className="h-[90vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] p-4 rounded-md">
              <div className="p-0 sm:p-1">
                <DialogHeader className="mb-4 sm:mb-6">
                  <DialogTitle className="text-lg sm:text-xl">Campaign Overview</DialogTitle>
                  <DialogDescription>
                    Track campaign progress and participant engagement
                  </DialogDescription>
                </DialogHeader>

                <div className="flex justify-end gap-3 sm:gap-4 mb-8">
                  <div className="bg-cyan-50 p-3 sm:p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl font-bold text-cyan-700">3,892</p>
                      <h4 className="font-medium text-sm sm:text-base text-cyan-900">Submissions</h4>
                    </div>
                  </div>
                  <div className="bg-rose-50 p-3 sm:p-4 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <p className="text-xl sm:text-2xl font-bold text-rose-700">122</p>
                      <h4 className="font-medium text-sm sm:text-base text-rose-900">Active Today</h4>
                    </div>
                  </div>
                </div>

                <Card className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 mt-4">
                  {/* Active Rewards Section */}
                    <div className="space-y-3">
                    <h3 className="text-xl font-semibold mb-4">Active Campaigns</h3>
                    <Card className="bg-white p-4">
                      <ScrollArea className="pr-2">
                      <div className="space-y-4">
                      {!activeCampaigns || activeCampaigns.length === 0 ? (
                        <div className="space-y-4">
                        {[1, 2].map((i) => (
                          <div key={i} className="group relative border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-start justify-between animate-pulse">
                            <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </div>
                            <div className="w-16 h-16 ml-4 rounded-lg bg-gray-200"></div>
                          </div>
                          </div>
                        ))}
                        </div>
                      ) : (
                        activeCampaigns
                          .slice(
                          currentCampaignsPage * CAMPAIGNS_PER_PAGE,
                          (currentCampaignsPage + 1) * CAMPAIGNS_PER_PAGE
                          )
                          .map((campaign, index) => (
                          <div key={index} className="group relative border-b last:border-0 pb-4 last:pb-0">
                            <div className="flex items-start justify-between">
                            <div className="flex-1 pr-6">
                              <h4 className="font-medium cursor-pointer text-xl group-hover:text-blue-600 transition-colors">
                              {campaign.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-2 line-clamp-2">
                              {campaign.description}
                              </p>
                              <div className="flex items-center space-x-4 mt-3 text-xs text-gray-600">
                              <span><span className="font-semibold">Started: </span> {campaign.listingDate}</span>
                              <span><span className="font-semibold text-yellow-500">Ends: </span> {campaign.endDate}</span>
                              </div>
                            </div>
                            <div className="w-32 h-24 ml-4 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                              <div className="relative w-full h-full cursor-pointer">
                                <Image
                                src={campaign.image} 
                                alt={campaign.name} 
                                layout="fill"
                                objectFit="cover"
                                className="object-cover w-full h-full rounded-xl"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-100 rounded-xl"></div>

                              </div>
                             
                            </div>
                                </div>
                              </div>
                            )))}
                        </div>
                        <div className="flex justify-center mt-4 space-x-1">
                          {Array.from({ length: Math.ceil(activeCampaigns.length / CAMPAIGNS_PER_PAGE) }).map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setCurrentCampaignsPage(idx)}
                              className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentCampaignsPage ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-blue-400'
                              }`}
                            />
                          ))}
                        </div>
                        <ScrollBar />
                        </ScrollArea>
                        </Card>
                    </div>
                    {/* Active Participants Section */}
                    <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">Active Participants</h3>
                      
                    </div>
                    <div className="space-y-4">
                      {RewardThen.map((winner, index) => (
                        <div key={index} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                              <AvatarImage src={winner.avatar} />
                              <AvatarFallback>{winner.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{winner.name}</p>
                              <div className="text-sm text-gray-500 space-y-1">
                                <p>{winner.email}</p>
                                <div className="flex items-center space-x-2">
                                  <span>{winner.joinDate}</span>
                                  <span>• </span>
                                  <span className="text-yellow-500">{winner.location}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-600 rounded-full px-4 py-1"
                            onClick={() => setSelectedParticipant({
                              id: winner.id,
                              name: winner.name,
                              avatar: winner.avatar,
                              joinDate: winner.joinDate,
                              location: winner.location,
                              email: winner.email || 'N/A',
                              receiptImage: "https://example.com/receipt.jpg",
                              uploadCount: winner.uploadCount || 0,
                              stamps: winner.stamps || Array(6).fill({ date: '', stamped: false })
                            } as ParticipantReceipt)}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4 space-x-1">
                      {Array.from({ length: Math.ceil(rewardWinners.length / PARTICIPANTS_PER_PAGE) }).map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setCurrentParticipantsPage(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentParticipantsPage ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-blue-400'
                          }`}
                        />
                      ))}
                    </div>
                    <ScrollBar />
                    </div>
                    </Card>

                    </div>
                    <ScrollBar orientation="vertical" className="bg-gray-100 w-2" />
                  </ScrollArea>
                  </DialogContent>
                  </Dialog>

                  {/* Participant Details Dialog */}
<Dialog open={!!selectedParticipant} onOpenChange={(open) => !open && setSelectedParticipant(null)}>
<DialogContent className="w-[95vw] max-w-[1000px] p-2 rounded-xl ">
{selectedParticipant && (
              <ScrollArea className="bg-white w-full h-[74vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] rounded-md">
                <div className="p-4">
                  <div className="w-full">
                    {/* Participant Info */}
                    <div className="flex items-center space-x-4 mb-5 border-b border-b-gray-200 pb-3">
                      <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                        <AvatarImage src={selectedParticipant.avatar} />
                        <AvatarFallback>{selectedParticipant.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-lg font-medium">{selectedParticipant.name}</h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>{selectedParticipant.email}</p>
                          <div className="flex items-center space-x-2">
                            <span>{selectedParticipant.location}</span>
                            <span>•</span>
                            <span>Joined {selectedParticipant.joinDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex w-full">
                    <div className="space-y-8 w-3/6">
                        {/* Purchase Journey */}
                        <Card className="bg-white p-4 flex flex-col">
                          <div className="mb-3 flex items-center justify-between w-full">
                            <div>
                              <h3 className="text-sm font-semibold text-gray-900">Purchase Journey</h3>
                              {/* <p className="text-xs text-gray-500">Path to {selectedParticipant.prize}</p> */}
                            </div>
                            <Gift className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                          </div>
                          
                          <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-100" />
                            {RewardThen.find(p => p.id === selectedParticipant.id)?.purchaseHistory?.map((purchase, i) => (
                              <div key={i} className="relative flex items-start mb-4 last:mb-0">
                                <div className="absolute left-4 top-2.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                                <div className="ml-8">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-900">
                                      {purchase.product}
                                    </span>
                                  </div>
                                  <p className="mt-1 text-xs text-gray-500">{purchase.date}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Card>

                    {/* Stamps Progress */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">Stamps Progress</h4>
                        <div className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">
                          {RewardThen.find(p => p.id === selectedParticipant.id)?.stamps?.filter(s => s.stamped).length}/6 Stamps
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-6 gap-1">
                          {RewardThen.find(p => p.id === selectedParticipant.id)?.stamps?.map((stamp, i) => (
                            <div key={i} className="aspect-square relative">
                              {stamp.stamped ? (
                                <div className="w-full h-full bg-yellow-500 rounded flex items-center justify-center shadow-sm">
                                  <span className="text-white text-[10px] font-bold">✓</span>
                                </div>
                              ) : (
                                <div className="w-full h-full rounded border border-dashed border-yellow-200 flex items-center justify-center hover:bg-yellow-50 transition-colors">
                                  <span className="text-yellow-200 text-[8px]">{i + 1}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                        
                      </div>
                    </div>
                      </div>

                      <div className="space-y-6 w-3/6 ml-8">
                        {/* Recent Reciepts */}
                  <div className="mt-0">
            <ScrollArea className="h-[290px] pr-4">
              <div className="space-y-4">
                {[1, 2, 3].map((_, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Receipt #{index + 1}</p>
                          <p className="text-sm text-gray-500">Uploaded today</p>
                        </div>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Receipt
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar />
            </ScrollArea>
          </div>

          {/* Select Winner Button */}
          <div className="mt-6 w-full flex justify-center">
            <Button 
              className="w-2/3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-3xl py-3"
            >
              Select as Winner
            </Button>
          </div>
                      </div>
                    </div>
                  </div>

                </div>
                <ScrollBar orientation="vertical" className="bg-gray-100 w-2" />
              </ScrollArea>
          )}
  </DialogContent>
</Dialog>
        </div>

      {renderActiveProductsDialog()}

      {/* <Card className="flex-1 shadow-xl overflow-hidden">
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
            <CardTitle className="text-base sm:text-lg font-medium">Recent Direct Repurchases</CardTitle>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handleSlideChange(currentIndex === 0 ? recentPurchases.length - 1 : currentIndex - 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => handleSlideChange(currentIndex === recentPurchases.length - 1 ? 0 : currentIndex + 1)}
                className="p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent 
          className="relative overflow-hidden"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {recentPurchases.map((purchase) => (
              <div
                key={purchase.id}
                className="min-w-full flex-shrink-0 p-2 sm:p-4"
              >
                <Card className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white rounded-2xl shadow-sm">
                  <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white shadow-sm">
                    <AvatarImage src={purchase.user.avatar} />
                    <AvatarFallback>{purchase.user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <p className="text-sm sm:text-base font-medium text-gray-900 truncate">{purchase.user.name}</p>
                      <p className="text-sm sm:text-base font-semibold text-green-600">{purchase.amount}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{purchase.product}</p>
                      <p className="text-xs text-gray-400">{purchase.time}</p>
                    </div>
                    <p className="text-xs text-gray-400 flex items-center mt-1">
                      <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0L2 12V2h10l8.59 8.59a2 2 0 011.128 1.414l-4.243 4.243a2 2 0 01-2.828 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {purchase.user.location}
                    </p>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          <div className="flex justify-center space-x-2 mt-3 sm:mt-4 pb-2">
            {recentPurchases.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'w-4 sm:w-6 bg-blue-600' : 'w-1.5 sm:w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </CardContent>
        </Card> */}

        <Card className="flex-1 shadow-xl overflow-hidden rounded-3xl">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
            <CardTitle className="text-lg font-medium">Content Video</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="relative max-h-[410px] flex items-center justify-center rounded-2xl overflow-hidden bg-gray-100">
            {videoPreview ? (
            <div className="relative w-full h-full">
              <video
              src={videoPreview}
              className="w-full h-full object-cover"
              controls
              />
              {thumbnailPreview && (
              <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Image
                src={thumbnailPreview}
                alt="Video thumbnail"
                layout="fill"
                objectFit="cover"
                />
              </div>
              )}
            </div>
            ) : (
            <div className="text-center">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Upload video</p>
            </div>
            )}
          </div>

          <div className="space-y-6">
                {renderMediaUploadInterface()}
                {(videoFile || (thumbnailFile && !videoPreview)) && (
                  <div className="space-y-4">
                    {isUploading && (
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                    <Button
                      className="w-full bg-emerald-500 hover:bg-emerald-600 rounded-full"
                      onClick={handleMediaSubmit}
                      disabled={isUploading || !videoFile || !thumbnailFile}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        'Upload Media'
                      )}
                    </Button>
                  </div>
                )}
          </div>
          </div>
        </CardContent>
        </Card>
        </div>
      )
    }