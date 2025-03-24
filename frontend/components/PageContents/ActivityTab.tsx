"use client"

import { useState, useEffect, useRef } from "react"
import { ImagePlus, Trash2, Package, Gift, Trophy, Edit, Star, BarChart, Plus, ChevronUp, ChevronDown, Edit2, Pencil, X } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog"
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc, updateDoc, limit } from "firebase/firestore"
import { FIREBASE_DB } from '../../FirebaseConfig'
import { getAuth } from "firebase/auth"
import axios from 'axios';

import { motion } from "framer-motion"
import { toast } from "sonner" 

interface Reward {
  name: string;
  points: number;
  description: string;
  image?: string;
}

interface ImageUpload {
  file: File | null;
  preview: string;
}

interface ProductPoll {
  id: string;
  title: string;
  products: { name: string; votes: number }[];
  creator: string;
  creatorRole: string;
}


import type { StaticImageData } from 'next/image';

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
  image?: StaticImageData | string;
}

interface FirebaseCampaign extends Campaign {
  userId: string;
  createdAt: Date;
}

interface FirebasePoll extends ProductPoll {
  userId: string;
  createdAt: Date;
}

// Add these interfaces after the existing interfaces
interface PurchaseHistory {
  product: string;
  date: string;
}

interface RewardWinner {
  id: string;
  name: string;
  badge: string;
  prize: string;
  points: number;
  achievement: string;
  date: string;
  purchaseHistory: PurchaseHistory[];
}

// Update FirebaseRewardData interface
interface FirebaseRewardData {
  userId: string;
  rewardWinners: RewardWinner[];
  totalPoints: number;
  activeCampaigns: number;
  createdAt: Date;
  updatedAt: Date;
  id?: string; // Add this line
}

// Add Campaign Thumbnail imports
import JoyPack from './images/JoyPack.jpg'
import RyanAir from './images/RyanAir.jpeg'

// Add example data
const exampleCampaigns: Campaign[] = [
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
];

const examplePolls: ProductPoll[] = [
  {
    id: "p1",
    title: "Favorite Flavor",
    products: [
      { name: "Sour Strawberry", votes: 150 },
      { name: "Blue Raspberry", votes: 120 },
      { name: "Green Apple", votes: 90 },
      { name: "Pink Lemonad", votes: 80 }
    ],
    creator: "Product Team",
    creatorRole: "Product Manager"
  },
  {
    id: "p2",
    title: "Sour Level Preference",
    products: [
      { name: "Extra Sour", votes: 200 },
      { name: "Medium Sour", votes: 180 },
      { name: "Mild Sour", votes: 150 },
      { name: "Sweet and Sour", votes: 120 }
    ],
    creator: "Marketing Team",
    creatorRole: "Product Manager"
  }
];

// Add example reward winners data
const exampleRewardData: FirebaseRewardData = {
  userId: "example-user",
  rewardWinners: [
    {
      id: "1",
      name: "Sarah Johnson",
      badge: "Diamond Member",
      prize: "Annual JoyRide Supply",
      points: 5000,
      achievement: "Most Active Community Member",
      date: "2024-02-20",
      purchaseHistory: [
        { product: "JoyRide Variety Pack", date: "2024-02-15" },
        { product: "Limited Edition Summer Box", date: "2024-02-10" },
        { product: "Mystery Flavor Bundle", date: "2024-02-01" },
        { product: "Sour Delights Collection", date: "2024-01-25" }
      ]
    },
    {
      id: "2",
      name: "Mike Anderson",
      badge: "Early Adopter",
      prize: "Custom Flavor Creation",
      points: 3500,
      achievement: "First 100 Subscribers",
      date: "2024-02-18",
      purchaseHistory: [
        { product: "Founder's Edition Box", date: "2024-02-12" },
        { product: "Premium Taster Pack", date: "2024-02-05" },
        { product: "Seasonal Collection", date: "2024-01-28" }
      ]
    },
    {
      id: "3",
      name: "Emily Chen",
      badge: "Social Ambassador",
      prize: "VIP Factory Tour",
      points: 4200,
      achievement: "Top Social Media Promoter",
      date: "2024-02-15",
      purchaseHistory: [
        { product: "Influencer Box", date: "2024-02-10" },
        { product: "Content Creator Pack", date: "2024-02-01" },
        { product: "Special Edition Set", date: "2024-01-20" }
      ]
    },
    {
      id: "4",
      name: "David Martinez",
      badge: "Taste Pioneer",
      prize: "Lifetime 20% Discount",
      points: 3800,
      achievement: "Product Innovation Contributor",
      date: "2024-02-12",
      purchaseHistory: [
        { product: "Beta Tester Bundle", date: "2024-02-08" },
        { product: "Experimental Flavors Pack", date: "2024-01-30" },
        { product: "Research Group Box", date: "2024-01-15" }
      ]
    }
  ],
  totalPoints: 16500,
  activeCampaigns: 4,
  createdAt: new Date(),
  updatedAt: new Date()
};

export function ActivityTab() {
  // Convert historyData to state
  const [productListings, setProductListings] = useState<(Campaign & { id: string })[]>(exampleCampaigns)
  const [pollHistory, setPollHistory] = useState<(ProductPoll & { id: string })[]>(examplePolls)
  
  // Add refs for scrolling
  const campaignsRef = useRef<HTMLDivElement>(null)
  const pollsRef = useRef<HTMLDivElement>(null)

  const [activeSection, setActiveSection] = useState("products")
  const [isMobile, setIsMobile] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{type: 'campaign' | 'poll', id: string} | null>(null);

  const [newCampaign, setNewCampaign] = useState<Campaign>({
    id: "",
    name: "",
    listingDate: "",
    endDate: "",
    status: "Active",
    creator: "Current User",
    creatorRole: "Campaign Manager",
    rewards: [],
    description: "",
    image: undefined
  })

  const [newReward, setNewReward] = useState<Reward>({
    name: "",
    points: 0,
    description: ""
  })
  const [rewardImage, setRewardImage] = useState<ImageUpload>({ file: null, preview: '' });
  const [campaignImage, setCampaignImage] = useState<ImageUpload>({ file: null, preview: '' });
  const [showRewardForm, setShowRewardForm] = useState(false);

  const [newPoll, setNewPoll] = useState<ProductPoll>({
    id: "",
    title: "",
    products: [{ name: "", votes: 0 }, { name: "", votes: 0 }],
    creator: "Current User",
    creatorRole: "Product Manager"
  });

  // Add new state for edit mode
  const [editingPoll, setEditingPoll] = useState<ProductPoll | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleAddProduct = () => {
    setNewPoll(prev => ({
      ...prev,
      products: [...prev.products, { name: "", votes: 0 }]
    }));
  };

  const handleDeleteCampaign = (id: string) => {
    setItemToDelete({ type: 'campaign', id });
    setDeleteConfirmOpen(true);
  };

  const handleDeletePoll = (id: string) => {
    setItemToDelete({ type: 'poll', id });
    setDeleteConfirmOpen(true);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    
    setIsLoading(true);
    try {
      const collectionName = itemToDelete.type === 'campaign' ? 'campaigns' : 'polls';
      const docRef = doc(FIREBASE_DB, collectionName, itemToDelete.id.toString());
      
      await deleteDoc(docRef);

      if (itemToDelete.type === 'campaign') {
        setProductListings(prev => prev.filter(c => c.id !== itemToDelete.id.toString()));
      } else {
        setPollHistory(prev => prev.filter(p => p.id !== itemToDelete.id.toString()));
      }
      
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      // Add error handling UI here if needed
    } finally {
      setIsLoading(false);
    }
  };

  const handleVote = (pollId: number, productIndex: number) => {
    const pollIndex = pollHistory.findIndex(p => p.id === pollId.toString());
    if (pollIndex !== -1) {
      const updatedPoll = { ...pollHistory[pollIndex] };
      updatedPoll.products[productIndex].votes += 1;
      setPollHistory(prev => {
        const newPollHistory = [...prev];
        newPollHistory[pollIndex] = updatedPoll;
        return newPollHistory;
      });
    }
  };

  // Add new state for reward data
  const [rewardData, setRewardData] = useState<FirebaseRewardData>(exampleRewardData);
  
  // Add this function to fetch reward data
  const fetchRewardData = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    
    if (!user) {
      console.log('No user logged in');
      return;
    }

    try {
      const rewardsQuery = query(
        collection(FIREBASE_DB, 'rewards'),
        where('userId', '==', user.uid),
        limit(1)
      );

      const rewardsSnap = await getDocs(rewardsQuery);

      if (rewardsSnap.empty) {
        // Initialize default reward data for new users
        const defaultRewardData: FirebaseRewardData = {
          userId: user.uid,
          rewardWinners: [],
          totalPoints: 0,
          activeCampaigns: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const docRef = await addDoc(collection(FIREBASE_DB, 'rewards'), defaultRewardData);
        setRewardData({ ...defaultRewardData, id: docRef.id });
      } else {
        setRewardData({ 
          ...rewardsSnap.docs[0].data() as FirebaseRewardData,
          id: rewardsSnap.docs[0].id 
        });
      }
    } catch (error) {
      console.error('Error fetching reward data:', error);
      toast.error('Failed to fetch reward data');
    }
  };

  useEffect(() => {
    // Fetch user's campaigns and polls on mount
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        if (!user) {
          console.log('No user logged in');
          return;
        }

        try {
          // First attempt with indexes
          const [campaignsSnap, pollsSnap] = await Promise.all([
            getDocs(
              query(
                collection(FIREBASE_DB, 'campaigns'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
              )
            ),
            getDocs(
              query(
                collection(FIREBASE_DB, 'polls'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
              )
            )
          ]);

          setProductListings(
            campaignsSnap.docs.map(doc => ({
              ...(doc.data() as FirebaseCampaign),
              id: doc.id,
            }))
          );

          setPollHistory(
            pollsSnap.docs.map(doc => ({
              ...(doc.data() as FirebasePoll),
              id: doc.id,
            }))
          );
        } catch (error: any) {
          // If error contains information about missing index
          if (error.code === 'failed-precondition') {
            // Fallback to simple queries without ordering
            const [campaignsSnap, pollsSnap] = await Promise.all([
              getDocs(
                query(
                  collection(FIREBASE_DB, 'campaigns'),
                  where('userId', '==', user.uid)
                )
              ),
              getDocs(
                query(
                  collection(FIREBASE_DB, 'polls'),
                  where('userId', '==', user.uid)
                )
              )
            ]);

            setProductListings(
              campaignsSnap.docs.map(doc => ({
                ...(doc.data() as FirebaseCampaign),
                id: doc.id,
              }))
            );

            setPollHistory(
              pollsSnap.docs.map(doc => ({
                ...(doc.data() as FirebasePoll),
                id: doc.id,
              }))
            );

            // Show error toast with link to create index
            toast.error(
              "Please create the required indexes for optimal performance. Check the console for details.",
              { duration: 5000 }
            );
            console.error('Create the following indexes:');
            console.error('Collection: campaigns');
            console.error('Fields: userId (Ascending) + createdAt (Descending)');
            console.error('Collection: polls');
            console.error('Fields: userId (Ascending) + createdAt (Descending)');
          } else {
            throw error;
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchUserData(),  // existing function
          fetchRewardData() // new function
        ]);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error("Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  const handleAddCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.log('No user logged in');
        return;
      }

      // Upload image to Cloudinary if exists
      let imageUrl = undefined;
      if (campaignImage.file) {
        const formData = new FormData();
        formData.append('image', campaignImage.file);

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData);
          if (response.data.success) {
            imageUrl = response.data.data.secure_url;
          }
        } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
        }
      }

      const campaignData: FirebaseCampaign = {
        ...newCampaign,
        id: Date.now().toString(),
        status: "Active",
        creator: user.displayName || "Current User",
        creatorRole: "Campaign Manager",
        rewards: [...newCampaign.rewards],
        image: imageUrl, // Use the Cloudinary URL
        userId: user.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(FIREBASE_DB, 'campaigns'), campaignData);
      
      setProductListings(prev => [{
        ...campaignData,
        id: docRef.id
      }, ...prev]);
      
      // Show success toast
      toast.success("Campaign created successfully!", {
        duration: 2000,
      });
      
      // Reset form
      setNewCampaign({
        id: "",
        name: "",
        listingDate: "",
        endDate: "",
        status: "Active",
        creator: "",
        creatorRole: "",
        rewards: [],
        description: "",
        image: undefined
      });
      setCampaignImage({ file: null, preview: '' });
    } catch (error) {
      console.error("Error adding campaign:", error);
      toast.error("Failed to create campaign");
    } finally {
      // Reset button text after 2 seconds
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const handleAddPoll = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const pollData: FirebasePoll = {
        ...newPoll,
        creator: user.displayName || "Current User",
        creatorRole: "Product Manager",
        userId: user.uid,
        createdAt: new Date()
      };

      const docRef = await addDoc(collection(FIREBASE_DB, 'polls'), pollData);
      
      setPollHistory(prev => [{
        ...pollData,
        id: docRef.id
      }, ...prev]);
      
      // Show success toast
      toast.success("Poll created successfully!", {
        duration: 2000,
      });
      
      // Reset form
      setNewPoll({
        id: "",
        title: "",
        products: [{ name: "", votes: 0 }, { name: "", votes: 0 }],
        creator: "",
        creatorRole: ""
      });
    } catch (error) {
      console.error("Error adding poll:", error);
      toast.error("Failed to create poll");
    } finally {
      // Reset button text after 2 seconds
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  const handleCampaignImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCampaignImage({
        file,
        preview: imageUrl
      });
      // Don't set the image in newCampaign state since we'll use RyanAir as default
    }
  };


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Add new function to handle poll updates
  const handleUpdatePoll = async (updatedPoll: ProductPoll) => {
    try {
      const pollRef = doc(FIREBASE_DB, 'polls', updatedPoll.id);
      await updateDoc(pollRef, {
        title: updatedPoll.title,
        products: updatedPoll.products
      });

      // Update local state
      setPollHistory(prev => prev.map(poll => 
        poll.id === updatedPoll.id ? updatedPoll : poll
      ));

      setIsEditModalOpen(false);
      toast.success("Poll updated successfully!");
    } catch (error) {
      console.error("Error updating poll:", error);
      toast.error("Failed to update poll");
    }
  };

  // Add this new state near the top of the component with other state declarations
  const [expandedWinners, setExpandedWinners] = useState<number[]>([]);

  // Add this new function before the return statement
  const toggleWinnerExpansion = (winnerId: number) => {
    setExpandedWinners(prev => 
      prev.includes(winnerId) 
        ? prev.filter(id => id !== winnerId)
        : [...prev, winnerId]
    );
  };

  // Add these new state variables
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isEditingCampaign, setIsEditingCampaign] = useState(false);
  const [editCampaignImage, setEditCampaignImage] = useState<ImageUpload>({ file: null, preview: '' });

  // Add this new function
  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign) return;
    
    setIsSubmitting(true);
    try {
      let imageUrl = editingCampaign.image;

      // Upload new image if exists
      if (editCampaignImage.file) {
        const formData = new FormData();
        formData.append('image', editCampaignImage.file);

        try {
          const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData);
          if (response.data.success) {
            imageUrl = response.data.data.secure_url;
          }
        } catch (error) {
          console.error('Error uploading image to Cloudinary:', error);
          toast.error("Failed to upload image");
          return;
        }
      }

      // Update campaign in Firebase
      const campaignRef = doc(FIREBASE_DB, 'campaigns', editingCampaign.id);
      await updateDoc(campaignRef, {
        name: editingCampaign.name,
        description: editingCampaign.description,
        listingDate: editingCampaign.listingDate,
        endDate: editingCampaign.endDate,
        image: imageUrl
      });

      // Update local state
      setProductListings(prev => prev.map(campaign => 
        campaign.id === editingCampaign.id 
          ? { 
              ...campaign, 
              name: editingCampaign.name, 
              description: editingCampaign.description,
              listingDate: editingCampaign.listingDate,
              endDate: editingCampaign.endDate,
              image: imageUrl 
            }
          : campaign
      ));

      setIsEditingCampaign(false);
      setEditingCampaign(null);
      setEditCampaignImage({ file: null, preview: '' });
      toast.success("Campaign updated successfully!");
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-2 p-0 sm:p-1">
        <div className="flex flex-wrap justify-end gap-2 mb-4">
          <Button 
            variant={activeSection === "products" ? "default" : "outline"}
            onClick={() => setActiveSection("products")}
            className={`
              transition-all duration-300 
              ${activeSection === "products" 
                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl" 
                : "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 rounded-3xl"
              }
            `}
          >
            <Package className="mr-2 h-4 w-4" />
             Activity
          </Button>
          
          <Button 
            variant={activeSection === "rewards" ? "default" : "outline"}
            onClick={() => setActiveSection("rewards")}
            className={`
              transition-all duration-300 
              ${activeSection === "rewards" 
                ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-3xl" 
                : "hover:bg-yellow-50 hover:text-yellow-600 hover:border-yellow-200 rounded-3xl"
              }
            `}
          >
            <Trophy className="mr-2 h-4 w-4" />
             History
          </Button>
        </div>

        {activeSection === "products" && (
          <div className="space-y-8 pt-2">
            {/* Campaigns Section */}
            <div className="space-y-6">
           <Card className="w-full rounded-3xl overflow-hidden">
                           <CardHeader className="pb-0">
                             <div className="flex justify-between items-center">
                               <CardTitle className="text-xl font-bold">Active Campaigns</CardTitle>
                               <Dialog>
                                 <DialogTrigger asChild>
                                   <Button variant="outline" size="sm" className="ml-2 rounded-3xl bg-emerald-500 text-white hover:bg-emerald-600">
                                     <Plus className="h-4 w-4 mr-1" />
                                      Add New
                                   </Button>
                                 </DialogTrigger>
                                <DialogContent className="sm:max-w-[800px] p-2.5 rounded-3xl">
                                                      <div className="mt-4">
                                                        <Card className="p-6 border-0 shadow-sm">
                                                          <form onSubmit={handleAddCampaign}>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                              <div className="space-y-4">
                                                                <div className="space-y-1">
                                                                  <Label className="text-gray-700 font-medium">Reward Name</Label>
                                                                  <Input 
                                                                    value={newCampaign.name}
                                                                    onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                                                                    placeholder="Enter reward name"
                                                                    className="rounded-xl"
                                                                  />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                  <div className="space-y-1 mt-2">
                                                                    <Label className="text-gray-700 font-medium">Start Date</Label>
                                                                    <Input 
                                                                      type="date"
                                                                      value={newCampaign.listingDate}
                                                                      onChange={(e) => setNewCampaign({...newCampaign, listingDate: e.target.value})}
                                                                      className="rounded-xl"
                                                                    />
                                                                  </div>
                                                                  <div className="space-y-1 mt-2">
                                                                    <Label className="text-gray-700 font-medium">End Date</Label>
                                                                    <Input 
                                                                      type="date"
                                                                      value={newCampaign.endDate}
                                                                      onChange={(e) => setNewCampaign({...newCampaign, endDate: e.target.value})}
                                                                      className="rounded-xl"
                                                                    />
                                                                  </div>
                                                                </div>
                                                                <div className="space-y-1">
                                                                  <Label className="text-gray-700 font-medium">Description</Label>
                                                                  <Textarea 
                                                                    value={newCampaign.description}
                                                                    onChange={(e) => setNewCampaign({...newCampaign, description: e.target.value})}
                                                                    placeholder="Reward description"
                                                                    className="min-h-[120px] rounded-xl"
                                                                  />
                                                                </div>
                                                              </div>
                                
                                                              <div className="space-y-4">
                                                                <div className="w-full flex justify-center">
                                                                  <Label className="text-gray-700 font-medium">Campaign Image</Label>
                                                                </div>
                                                                
                                                                <div className="relative w-full mx-auto h-72 rounded-3xl border-2 border-gray-50 overflow-hidden mt-2 bg-gray-50">
                                                                  <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    onChange={handleCampaignImageUpload}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                  />
                                                                  {campaignImage.preview ? (
                                                                    <Image src={campaignImage.preview} alt="Preview" fill className="object-cover" />
                                                                  ) : (
                                                                    <div className="absolute inset-0 flex items-center justify-center">
                                                                      <ImagePlus className="w-12 h-12 text-gray-400" />
                                                                    </div>
                                                                  )}
                                                                </div>
                                                              </div>
                                                            </div>
                                
                                                            <div className="flex justify-center mt-8">
                                                              <Button 
                                                                type="submit" 
                                                                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 mt-2 text-white w-1/3 rounded-full shadow-md"
                                                                disabled={isSubmitting}
                                                              >
                                                                {isSubmitting ? "Done!" : "Create Campaign"}
                                                              </Button>
                                                            </div>
                                                          </form>
                                                        </Card>
                                                      </div>
                                                    </DialogContent>
                               </Dialog>
                             </div>
                           </CardHeader>
                           <CardContent className="pt-6">
                             <ScrollArea className="w-full">
                               <div 
                                 ref={campaignsRef}
                                 className="flex gap-4 pb-4"
                               >
                                 {productListings.map((campaign, index) => (
                                   <motion.div
                                     key={index}
                                     initial={{ opacity: 0, y: 20 }}
                                     animate={{ opacity: 1, y: 0 }}
                                     transition={{ duration: 0.3, delay: index * 0.1 }}
                                   >
                                     <div key={index} className="w-[300px] flex-none">
                                       <Card className="w-full p-3.5 rounded-3xl hover:shadow-md transition-all duration-300">
                                         <div className="relative w-full h-48 mb-3 rounded-2xl overflow-hidden group whitespace-nowrap">
                                           {campaign.image ? (
                                             <>
                                               <Image 
                                                 src={campaign.image} 
                                                 alt={campaign.name} 
                                                 fill 
                                                 className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" 
                                                 unoptimized={typeof campaign.image === 'string'} 
                                               /> 
                                               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/40 to-black/20" />
                                               <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                                 <div className="bg-yellow-500 text-white text-xs sm:text-sm font-semibold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full w-fit mb-1 sm:mb-2">
                                                   Special Prize
                                                 </div>
                                                 <div className="flex items-center justify-between gap-2">
                                                   <h3 className="text-lg sm:text-lg font-bold text-white">{campaign.name}</h3>
                                                 </div>
                                               </div>
                                             </>
                                           ) : (
                                             <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
                                               <ImagePlus className="w-12 h-12 text-gray-400" />
                                             </div>
                                           )}
                                         </div>
                                         <div>
                                           <div>
                                             <span className="text-sm text-gray-600">{campaign.description}</span>
                                           </div>
                                           <div className="w-full flex justify-end">
                                             <Button 
                                               variant="ghost" 
                                               size="sm"
                                               onClick={() => {
                                                 setEditingCampaign(campaign);
                                                 setIsEditingCampaign(true);
                                                 if (campaign.image) {
                                                   setEditCampaignImage({ file: null, preview: typeof campaign.image === 'string' ? campaign.image : campaign.image?.src || '' });
                                                 }
                                               }}
                                               className="hover:bg-blue-50 text-blue-600"
                                             >
                                               <Edit className="w-4 h-4" />
                                             </Button>
                                           </div>
                                         </div>
                                         
                                         <div className="flex justify-between text-xs text-gray-500 mt-2">
                                           <span><span className="font-semibold">Started: </span> {campaign.listingDate}</span>
                                           <span><span className="font-semibold text-yellow-500">Ends: </span> {campaign.endDate}</span>
                                         </div>
                                       </Card>
                                     </div>
                                   </motion.div>
                                 ))}
                               </div>
                               <ScrollBar orientation="horizontal" className="bg-gray-100 h-2">
                                 <div className="relative flex-1 rounded-full bg-gray-300" />
                               </ScrollBar>
                             </ScrollArea>
                           </CardContent>
                         </Card>
            </div>

            {/* Polls Section */}
            <div className="space-y-6 mt-8">
              <Card className="w-full rounded-3xl overflow-hidden">
                              <CardHeader className="pb-0">
                                <div className="flex justify-between items-center">
                                  <CardTitle className="text-xl font-bold">Product Polls</CardTitle>
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="ml-2 rounded-3xl bg-blue-500 text-white hover:bg-blue-600">
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add Poll
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[600px] p-2.5 rounded-3xl">
                                                          <div className="mt-4">
                                                            <Card className="p-6 border-0 shadow-sm bg-transparent">
                                                              <form onSubmit={handleAddPoll}>
                                                                <div className="space-y-4">
                                                                  <div className="space-y-1">
                                                                    <Label className="text-gray-700 font-medium">Poll Title</Label>
                                                                    <Input 
                                                                      value={newPoll.title}
                                                                      onChange={(e) => setNewPoll({...newPoll, title: e.target.value})}
                                                                      placeholder="Enter poll title"
                                                                      className="rounded-xl"
                                                                    />
                                                                  </div>
                                                                  <div className="space-y-2 pt-6">
                                                                    <div className="flex justify-between items-center">
                                                                      <Label className="text-gray-700 font-medium">Products / Options</Label>
                                                                      <Button 
                                                                        type="button"
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="rounded-2xl bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                                                                        onClick={handleAddProduct}
                                                                      >
                                                                        <Plus className="h-3 w-3 mr-1" />
                                                                        Add Option
                                                                      </Button>
                                                                    </div>
                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                                      {newPoll.products.map((product, index) => (
                                                                        <div key={index} className="space-y-1">
                                                                          <Label className="text-gray-700">Option {index + 1}</Label>
                                                                          <div className="flex gap-2">
                                                                            <Input 
                                                                              value={product.name}
                                                                              className="rounded-xl"
                                                                              onChange={(e) => {
                                                                                const updatedProducts = [...newPoll.products];
                                                                                updatedProducts[index].name = e.target.value;
                                                                                setNewPoll(prev => ({
                                                                                  ...prev,
                                                                                  products: updatedProducts
                                                                                }));
                                                                              }}
                                                                              placeholder={`Enter product or statement`}
                                                                            />
                                                                            {index > 1 && (
                                                                              <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => {
                                                                                  setNewPoll(prev => ({
                                                                                    ...prev,
                                                                                    products: prev.products.filter((_, i) => i !== index)
                                                                                  }));
                                                                                }}
                                                                                className="hover:bg-red-50 rounded-full"
                                                                              >
                                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                                              </Button>
                                                                            )}
                                                                          </div>
                                                                        </div>
                                                                      ))}
                                                                    </div>
                                                                  </div>
                                                                  <div className="flex justify-center mt-4">
                                                                    <Button 
                                                                      type="submit" 
                                                                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 mt-2 text-white w-1/3 rounded-full shadow-md"
                                                                      disabled={isSubmitting}
                                                                    >
                                                                      {isSubmitting ? "Done!" : "Create Poll"}
                                                                    </Button>
                                                                  </div>
                                                                </div>
                                                              </form>
                                                            </Card>
                                                          </div>
                                                        </DialogContent>
                                  </Dialog>
                                </div>
                              </CardHeader>
                              <CardContent className="pt-6">
                                                <ScrollArea className="w-full">
                                                  <div
                                                    ref={pollsRef}
                                                    className="flex gap-4 pb-4"
                                                  >
                                                    {pollHistory.map((poll, index) => (
                                                      <motion.div
                                                        key={`poll-${index}`}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ duration: 0.3, delay: index * 0.1 }}
                                                        className="w-[350px] flex-none"
                                                      >
                                                        <Card className="w-full rounded-3xl overflow-hidden hover:shadow-md transition-all duration-300">
                                                          <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4">
                                                            <div className="flex justify-between items-center">
                                                              <CardTitle className="text-lg font-semibold">{poll.title}</CardTitle>
                                                              <Button 
                                                                variant="ghost" 
                                                                size="sm"
                                                                onClick={() => {
                                                                  setEditingPoll(poll);
                                                                  setIsEditModalOpen(true);
                                                                }}
                                                                className="hover:bg-blue-400 text-white rounded-full p-2 h-8 w-8"
                                                              >
                                                                <Edit className="w-4 h-4" />
                                                              </Button>
                                                            </div>
                                                          </CardHeader>
                                                          <CardContent className="p-4">
                                                            <div className="space-y-3">
                                                              {poll.products.map((product, productIndex) => (
                                                                <div 
                                                                  key={productIndex}
                                                                  className="relative bg-gray-50 rounded-2xl p-3 hover:bg-gray-100 transition-colors"
                                                                >
                                                                  <div className="flex justify-between items-center">
                                                                    <div className="font-medium">{product.name}</div>
                                                                    <div className="text-blue-500 font-semibold">{product.votes} votes</div>
                                                                  </div>
                                                                  <div className="w-full bg-gray-200 h-2 rounded-full mt-2 overflow-hidden">
                                                                    <div 
                                                                      className="bg-blue-500 h-full rounded-full" 
                                                                      style={{ 
                                                                        width: `${Math.max(5, Math.min(100, (product.votes / Math.max(1, poll.products.reduce((a, b) => a + b.votes, 0))) * 100))}%` 
                                                                      }}
                                                                    ></div>
                                                                  </div>
                                                                </div>
                                                              ))}
                                                            </div>
                                                          </CardContent>
                                                        </Card>
                                                      </motion.div>
                                                    ))}
                                                  </div>
                                                  <ScrollBar orientation="horizontal" className="bg-gray-100 h-2">
                                                    <div className="relative flex-1 rounded-full bg-gray-300" />
                                                  </ScrollBar>
                                                </ScrollArea>
                                              </CardContent>
                            </Card>
            </div>
          </div>
        )}

        {activeSection === "rewards" && (
          <div className="space-y-8 pt-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="rounded-3xl p-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 text-white rounded-full flex items-center justify-center mb-3">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Total Points</h3>
                  <p className="text-3xl font-semibold text-yellow-500 mt-1">
                    {rewardData?.totalPoints || 0}
                  </p>
                </div>
              </Card>
              
              <Card className="rounded-3xl p-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-500 text-white rounded-full flex items-center justify-center mb-3">
                    <Package className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Active Campaigns</h3>
                  <p className="text-3xl font-semibold text-emerald-500 mt-1">
                    {rewardData?.activeCampaigns || 0}
                  </p>
                </div>
              </Card>
              
              <Card className="rounded-3xl p-6">
                <div className="flex flex-col items-center">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 text-white rounded-full flex items-center justify-center mb-3">
                    <Star className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold">Top Reward</h3>
                  <p className="text-3xl font-semibold text-blue-500 mt-1">
                    {rewardData?.rewardWinners && rewardData.rewardWinners.length > 0 
                      ? rewardData.rewardWinners[0].points 
                      : 0}
                  </p>
                </div>
              </Card>
            </div>
            
            <Card className="rounded-3xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-xl font-bold">Reward Winners</CardTitle>
                          <Trophy className="h-5 w-5 text-yellow-500" />
                        </CardHeader>
                        <CardContent className="p-2 sm:p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {exampleRewardData.rewardWinners.map((winner) => (
                              <div key={winner.id} className="flex flex-col space-y-4">
                                <div 
                                  className="group relative flex flex-col space-y-2 p-4 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl border border-emerald-100 hover:shadow-md transition-all duration-300 cursor-pointer"
                                  onClick={() => toggleWinnerExpansion(Number(winner.id))}
                                >
                                  <div className="absolute top-3 right-3">
                                    <span className="inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-700/10">
                                      {winner.badge}
                                    </span>
                                  </div>
                                  
                                  <div className="absolute bottom-3 right-3">
                                    <div className={`bg-white rounded-full p-1 shadow-sm transition-transform duration-200 ${
                                      expandedWinners.includes(Number(winner.id)) ? 'rotate-90' : ''
                                    }`}>
                                      <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        width="16" 
                                        height="16" 
                                        viewBox="0 0 24 24" 
                                        fill="none" 
                                        stroke="currentColor" 
                                        strokeWidth="2" 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        className="text-gray-600"
                                      >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                      </svg>
                                    </div>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-base text-gray-900">{winner.name}</h4>
                                  </div>
                                  
                                  <div className="flex items-center space-x-2">
                                    <Gift className="h-4 w-4 text-emerald-500" />
                                    <span className="text-sm font-medium text-emerald-600">{winner.prize}</span>
                                  </div>
                                  
                                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Trophy className="h-4 w-4 text-yellow-500" />
                                      <span>{winner.achievement}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <Star className="h-4 w-4 text-blue-500" />
                                      <span>{winner.points} Points</span>
                                    </div>
                                  </div>
                                  
                                  <div className="text-xs text-gray-500 mt-1">
                                    Awarded: {winner.date}
                                  </div>
                                </div>
            
                                {expandedWinners.includes(Number(winner.id)) && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Card className="bg-white p-4 flex flex-col">
                                      <div className="mb-3 flex items-center justify-between w-full">
                                        <div>
                                          <h3 className="text-sm font-semibold text-gray-900">Purchase Journey</h3>
                                          <p className="text-xs text-gray-500">Path to {winner.prize}</p>
                                        </div>
                                        <Gift className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                                      </div>
                                      
                                      <div className="relative">
                                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-100" />
                                        {winner.purchaseHistory.map((purchase, i) => (
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
                                  </motion.div>
                                )}
                              </div>
                            ))}
                            </div>
                        </CardContent>
                      </Card>
          </div>
        )}
        
        {/* Edit Campaign Dialog */}
        {editingCampaign && (
          <Dialog open={isEditingCampaign} onOpenChange={setIsEditingCampaign}>
            <DialogContent className="sm:max-w-[800px] p-2.5 rounded-3xl">
              <div className="mt-4">
                <Card className="p-6 border-0 shadow-sm">
                  <form onSubmit={handleUpdateCampaign}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <Label className="text-gray-700 font-medium">Reward Name</Label>
                          <Input 
                            value={editingCampaign.name}
                            onChange={(e) => setEditingCampaign(prev => prev ? {...prev, name: e.target.value} : null)}
                            placeholder="Enter reward name"
                            className="rounded-xl"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1 mt-2">
                            <Label className="text-gray-700 font-medium">Start Date</Label>
                            <Input 
                              type="date"
                              value={editingCampaign.listingDate}
                              onChange={(e) => setEditingCampaign(prev => prev ? {...prev, listingDate: e.target.value} : null)}
                              className="rounded-xl"
                            />
                          </div>
                          <div className="space-y-1 mt-2">
                            <Label className="text-gray-700 font-medium">End Date</Label>
                            <Input 
                              type="date"
                              value={editingCampaign.endDate}
                              onChange={(e) => setEditingCampaign(prev => prev ? {...prev, endDate: e.target.value} : null)}
                              className="rounded-xl"
                            />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-gray-700 font-medium">Description</Label>
                          <Textarea 
                            value={editingCampaign.description}
                            onChange={(e) => setEditingCampaign(prev => prev ? {...prev, description: e.target.value} : null)}
                            placeholder="Reward description"
                            className="min-h-[120px] rounded-xl"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                      <div className="w-full flex justify-center">
                          <Label className="text-gray-700 font-medium">Campaign Image</Label>
                        </div>                        
                        <div className="relative w-full mx-auto h-72 rounded-3xl border-2 border-gray-50 overflow-hidden mt-2 bg-gray-50">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const imageUrl = URL.createObjectURL(file);
                                setEditCampaignImage({
                                  file,
                                  preview: imageUrl
                                });
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          {editCampaignImage.preview ? (
                            <Image src={editCampaignImage.preview} alt="Preview" fill className="object-cover" />
                          ) : editingCampaign.image ? (
                            <Image 
                              src={editingCampaign.image} 
                              alt="Current Image" 
                              fill 
                              className="object-cover" 
                              unoptimized={typeof editingCampaign.image === 'string'} 
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <ImagePlus className="w-12 h-12 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between mt-8">
                      <Button 
                        type="button"
                        variant="outline"
                        className="rounded-full px-6 text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeleteCampaign(editingCampaign.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-full px-8"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Update"}
                      </Button>
                    </div>
                  </form>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Edit Poll Dialog */}
        {editingPoll && (
          <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
            <DialogContent className="sm:max-w-[600px] p-2.5 rounded-3xl">
              <div className="mt-4">
                <Card className="p-6 border-0 shadow-sm">
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <Label className="text-gray-700 font-medium">Poll Title</Label>
                      <Input 
                        value={editingPoll.title}
                        onChange={(e) => setEditingPoll(prev => prev ? {...prev, title: e.target.value} : null)}
                        placeholder="Enter poll title"
                        className="rounded-xl"
                      />
                    </div>
                    <div className="space-y-2 pt-6">
                      <div className="flex justify-between items-center">
                        <Label className="text-gray-700 font-medium">Products / Options</Label>
                        <Button 
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-2xl bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                          onClick={() => {
                            if (editingPoll) {
                              setEditingPoll({
                                ...editingPoll,
                                products: [...editingPoll.products, { name: "", votes: 0 }]
                              });
                            }
                          }}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Add Option
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {editingPoll.products.map((product, index) => (
                          <div key={index} className="space-y-1">
                            <Label className="text-gray-700">Option {index + 1}</Label>
                            <div className="flex gap-2">
                              <Input 
                                value={product.name}
                                className="rounded-xl"
                                onChange={(e) => {
                                  if (editingPoll) {
                                    const updatedProducts = [...editingPoll.products];
                                    updatedProducts[index].name = e.target.value;
                                    setEditingPoll({
                                      ...editingPoll,
                                      products: updatedProducts
                                    });
                                  }
                                }}
                                placeholder={`Enter product or statement`}
                              />
                              {index > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => {
                                    if (editingPoll) {
                                      setEditingPoll({
                                        ...editingPoll,
                                        products: editingPoll.products.filter((_, i) => i !== index)
                                      });
                                    }
                                  }}
                                  className="hover:bg-red-50 rounded-full"
                                >
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button 
                        type="button"
                        variant="outline"
                        className="rounded-full px-6 text-red-500 border-red-200 hover:bg-red-50"
                        onClick={() => handleDeletePoll(editingPoll.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        onClick={() => handleUpdatePoll(editingPoll)}
                        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full px-8"
                      >
                       Update
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </DialogContent>
          </Dialog>
        )}
        
        {/* Confirmation Dialog */}
        <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-[425px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Confirm Deletion</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-700">
                Are you sure you want to delete this {itemToDelete?.type}? This action cannot be undone.
              </p>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteConfirmOpen(false)}
                className="rounded-full"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 text-white rounded-full"
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
