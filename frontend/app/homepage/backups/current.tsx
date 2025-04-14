'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from 'next/image';
import Link from 'next/link';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { FIREBASE_AUTH, FIREBASE_DB, FIREBASE_STORAGE } from '../../../FirebaseConfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { 
  User, LogOut, Home, Gift, Award, BarChart, 
  MessageSquare, Settings, MapPin, Mail, Upload, 
  Check, X, Clock, ChevronRight, Users, QrCode
} from 'lucide-react';

import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Eye } from 'lucide-react';

import LogoImage from '../login/Images/download.png';
import { InfluencerDialog } from '../../join/Components/InfluencerDialog';
import { ProductDetailDialog } from '../../join/Components/ProductDetailDialog';

import { productData } from '../../join/mockdata';

import { Home as HomeIcon } from 'lucide-react'; // rename to avoid conflict
import { Calendar } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Stamp {
  stamped: boolean;
}

interface PurchaseHistory {
  product: string;
  date: string;
}

interface Participant {
  id: string;
  name: string;
  email: string;
  location: string;
  joinDate: string;
  avatar?: string;
  purchaseHistory?: PurchaseHistory[];
  stamps?: Stamp[];
}

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const [userLocation, setUserLocation] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [subscribedBrands, setSubscribedBrands] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Prelims');

  const [showProductDialog, setShowProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [currentProductPage, setCurrentProductPage] = useState(0);
  const PRODUCTS_PER_PAGE = 3;
  const [showInfluencerDialog, setShowInfluencerDialog] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState(null);
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setUserEmail(user.email || '');
        setUserName(user.displayName || '');
        
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserAddress(userData.address || '');
            setUserLocation(userData.location || '');
            setProfileImage(userData.profileImage || null);
            setAge(userData.age || '');
            setGender(userData.gender || '');
          }
          
          // Fetch sample subscribed brands (this would be dynamically loaded in a real app)
          // For now, we'll create mock data

          const mockBrands = [
            // {
            //   id: '1',
            //   name: 'JoyRide Candy Co.',
            //   logo: '/joy.jpeg',
            //   campaigns: 2
            // },
            // {
            //   id: '2',
            //   name: 'Prime Hydration',
            //   logo: '/prof.jpeg',
            //   campaigns: 1
            // },
            // {
            //   id: '3',
            //   name: 'Chamberlain Coffee',
            //   logo: '/logo.png',
            //   campaigns: 3
            // }
          ];
          
          setSubscribedBrands(mockBrands);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
        
        setLoading(false);
      } else {
        // Redirect to login if not authenticated
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, 
        formData
      );

      if (response.data.success) {
        const downloadUrl = response.data.data.secure_url;
        
        // Update the user profile
        await updateProfile(user, { photoURL: downloadUrl });
        
        // Update Firestore document
        await updateDoc(doc(FIREBASE_DB, 'users', user.uid), {
          profileImage: downloadUrl
        });
        
        // Update state
        setProfileImage(downloadUrl);
      }
    } catch (error) {
      console.error('Error uploading profile image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    
    try {
      // Update displayName in Firebase Auth
      await updateProfile(user, { displayName: userName });
      
      // Update user document in Firestore
      await updateDoc(doc(FIREBASE_DB, 'users', user.uid), {
        displayName: userName,
        address: userAddress,
        location: userLocation,
        age: age,
        gender: gender,
        updatedAt: new Date()
      });
      
      alert('Profile updated successfully!');
      
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    }
  };

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      router.push('/join');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProductQRClick = (product: any) => {
    setSelectedProduct(product);
    setShowProductDialog(true);
  };

  const handleCampaignClick = (campaign: any) => {
    setSelectedCampaign(campaign);
    setSelectedParticipant(RewardThen[0]); // For demo, select first participant
    setShowCampaignDialog(true);
  };

  const handleInfluencerClick = (influencer) => {
    setSelectedInfluencer(influencer);
    setShowInfluencerDialog(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Example data for rewards and polls
  const rewardsCampaigns = [
    // {
    //   id: 1,
    //   brand: 'JoyRide Candy Co.',
    //   name: 'Summer Sweepstakes',
    //   uploadedReceipts: 4,
    //   totalRequired: 6,
    //   status: 'active',
    //   endDate: '2024-04-15',
    //   purchaseHistory: [
    //     { product: 'Blue Raspberry Candy Strips', date: '2024-03-14', amount: '$12.99' },
    //     { product: 'Green Apple Candy Strips', date: '2024-03-10', amount: '$12.99' },
    //     { product: 'Sour Strawberry Strips', date: '2024-03-05', amount: '$12.99' },
    //     { product: 'Lemon Candy Strips', date: '2024-03-01', amount: '$12.99' }
    //   ],
    //   receipts: [
    //     { id: 1, date: '2024-03-14', store: 'Sweet Spot Central', amount: '$12.99' },
    //     { id: 2, date: '2024-03-10', store: 'Candy Corner', amount: '$12.99' },
    //     { id: 3, date: '2024-03-05', store: 'Mall Candy Shop', amount: '$12.99' },
    //     { id: 4, date: '2024-03-01', store: 'Sweet Treats', amount: '$12.99' }
    //   ],
    //   prize: 'Win a Year Supply of JoyRide Candy'
    // },
    // {
    //   id: 2,
    //   brand: 'Chamberlain Coffee',
    //   name: 'New Flavor Launch',
    //   uploadedReceipts: 2,
    //   totalRequired: 4,
    //   status: 'new',
    //   endDate: '2024-04-30',
    //   purchaseHistory: [
    //     { product: 'Matcha Green Tea Latte', date: '2024-03-12', amount: '$5.99' },
    //     { product: 'Vanilla Bean Cold Brew', date: '2024-03-08', amount: '$4.99' }
    //   ],
    //   receipts: [
    //     { id: 1, date: '2024-03-12', store: 'Chamberlain Cafe', amount: '$5.99' },
    //     { id: 2, date: '2024-03-08', store: 'Coffee Corner', amount: '$4.99' }
    //   ],
    //   prize: 'Early Access to New Flavors'
    // }
  ];

  const pollsParticipation = [
    // {
    //   id: 1,
    //   brand: 'JoyRide Candy Co.',
    //   title: 'New Flavor Preference',
    //   date: '2023-07-10',
    //   status: 'completed'
    // },
    // {
    //   id: 2,
    //   brand: 'Prime Hydration',
    //   title: 'Package Design Feedback',
    //   date: '2023-07-05',
    //   status: 'completed'
    // }
  ];

  // Add mockup data for RewardThen
  const RewardThen = [
    // {
    //   id: '1',
    //   name: 'John Doe',
    //   email: 'john@example.com',
    //   location: 'New York',
    //   joinDate: '2023-01-15',
    //   purchaseHistory: [
    //     { product: 'Blue Raspberry Strips', date: '2024-03-14' },
    //     { product: 'Sour Apple Strips', date: '2024-03-10' },
    //     { product: 'Strawberry Strips', date: '2024-03-05' },
    //   ],
    //   stamps: [
    //     { stamped: true },
    //     { stamped: true },
    //     { stamped: true },
    //     { stamped: false },
    //     { stamped: false },
    //     { stamped: false },
    //   ]
    // },
    // Add more mock participants as needed
  ];

  const renderTabContent = () => {
    switch(activeTab) {
      case 'dashboard':
        return (
          <>
            {/* Welcome Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName || 'User'}!</h1>
                <p className="text-gray-600 mt-1">Track your rewards campaigns and poll participation.</p>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm relative">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <User className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Rewards Campaigns Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <Gift className="w-6 h-6 text-emerald-600" />
                  <CardTitle className="text-xl font-bold">Rewards Campaigns</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-emerald-50 transition-all group"
                  onClick={() => setActiveTab('polls')}
                >
                  Next
                  <ChevronRight className="ml-1 w-5 h-5 text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </CardHeader>
              <CardContent>
              {rewardsCampaigns.length > 0 ? (
  rewardsCampaigns.map((campaign) => (
  <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-all duration-300 mb-4">
    <div className="flex p-4">
      {/* Left - Image */}
      <div className="w-64 h-48 relative flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
        <Image
          src={campaign.brand === 'JoyRide Candy Co.' ? '/joy.jpeg' : '/logo.png'}
          alt={campaign.name}
          width={200}
          height={160}
          className="object-contain absolute inset-0 m-auto"
        />
      </div>

      {/* Right - Details */}
      <div className="ml-6 flex-1 relative">
        {/* View Details Button - Top Right */}
        <Button 
          size="sm" 
          variant="outline" 
          className="absolute top-0 right-0 text-xs h-8"
          onClick={() => handleCampaignClick(campaign)}
        >
          View Details
        </Button>

        {/* Brand Badge */}
        <div className="flex items-center gap-2 w-fit bg-white shadow-sm px-2 py-1 rounded-full border border-gray-100 mb-2">
          <div className="relative w-4 h-4 rounded-full overflow-hidden">
            <Image
              src={campaign.brand === 'JoyRide Candy Co.' ? '/joy.jpeg' : '/logo.png'}
              alt={campaign.brand}
              fill
              className="object-cover"
              sizes="16px"
            />
          </div>
          <span className="text-xs font-medium">{campaign.brand}</span>
        </div>
        
        {/* Campaign Name and Prize */}
        <h3 className="font-bold text-lg mb-1">{campaign.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{campaign.prize}</p>

        {/* Progress Section */}
        <div className="max-w-md">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">{campaign.uploadedReceipts} of {campaign.totalRequired} collected</span>
            <span className="text-xs font-medium text-amber-600">
              {Math.round((campaign.uploadedReceipts/campaign.totalRequired) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-1.5 rounded-full" 
              style={{ width: `${(campaign.uploadedReceipts/campaign.totalRequired) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* End Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-4">
          <Clock className="h-3.5 w-3.5" />
          <span>Ends {campaign.endDate}</span>
        </div>
      </div>
    </div>
  </Card>
  ))
) : (
  <div className="text-center py-8">
    <div className="bg-gray-100 inline-flex p-4 rounded-full mb-4">
      <Gift className="w-6 h-6 text-gray-400" />
    </div>
    <h3 className="text-gray-700 font-medium mb-1">No active reward campaigns</h3>
    <p className="text-sm text-gray-500 mb-4">Join brand campaigns to start earning rewards</p>
    <Button onClick={() => setActiveTab('brands')}>Find Campaigns</Button>
  </div>
)}
</CardContent>
<CardContent>
{rewardsCampaigns.map((campaign) => (
  <Card key={campaign.id} className="overflow-hidden hover:shadow-md transition-all duration-300 mb-4">
    <div className="flex p-4">
      {/* Left - Image */}
      <div className="w-64 h-48 relative flex-shrink-0 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
        <Image
          src={campaign.brand === 'JoyRide Candy Co.' ? '/joy.jpeg' : '/logo.png'}
          alt={campaign.name}
          width={200}
          height={160}
          className="object-contain absolute inset-0 m-auto"
        />
      </div>

      {/* Right - Details */}
      <div className="ml-6 flex-1 relative">
        {/* View Details Button - Top Right */}
        <Button 
          size="sm" 
          variant="outline" 
          className="absolute top-0 right-0 text-xs h-8"
          onClick={() => handleCampaignClick(campaign)}
        >
          View Details
        </Button>

        {/* Brand Badge */}
        <div className="flex items-center gap-2 w-fit bg-white shadow-sm px-2 py-1 rounded-full border border-gray-100 mb-2">
          <div className="relative w-4 h-4 rounded-full overflow-hidden">
            <Image
              src={campaign.brand === 'JoyRide Candy Co.' ? '/joy.jpeg' : '/logo.png'}
              alt={campaign.brand}
              fill
              className="object-cover"
              sizes="16px"
            />
          </div>
          <span className="text-xs font-medium">{campaign.brand}</span>
        </div>
        
        {/* Campaign Name and Prize */}
        <h3 className="font-bold text-lg mb-1">{campaign.name}</h3>
        <p className="text-sm text-gray-600 mb-3">{campaign.prize}</p>

        {/* Progress Section */}
        <div className="max-w-md">
          <div className="flex justify-between mb-1">
            <span className="text-xs font-medium">{campaign.uploadedReceipts} of {campaign.totalRequired} collected</span>
            <span className="text-xs font-medium text-amber-600">
              {Math.round((campaign.uploadedReceipts/campaign.totalRequired) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className="bg-gradient-to-r from-yellow-500 to-amber-500 h-1.5 rounded-full" 
              style={{ width: `${(campaign.uploadedReceipts/campaign.totalRequired) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* End Date */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mt-4">
          <Clock className="h-3.5 w-3.5" />
          <span>Ends {campaign.endDate}</span>
        </div>
      </div>
    </div>
  </Card>
))}
</CardContent>
            </Card>

            {/* Campaign Details Dialog */}
            <Dialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
              <DialogContent className="w-[95vw] max-w-[1000px] p-2 rounded-xl">
                {selectedCampaign && (
                  <ScrollArea className="bg-white w-full h-[78vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] rounded-md">
                    <div className="p-4">
                      <div className="w-full">
                        {/* Add brand header */}
                        <div className="mb-6 flex items-center justify-center space-x-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-50">
                            <Image
                              src={selectedCampaign.brand === 'JoyRide Candy Co.' ? '/joy.jpeg' : '/logo.png'}
                              alt={selectedCampaign.brand}
                              width={64}
                              height={64}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="text-center">
                            <h2 className="text-xl font-bold text-gray-900">{selectedCampaign.brand}</h2>
                          </div>
                        </div>
                        
                        <div className="flex w-full">
                          <div className="space-y-8 w-3/6">
                            {/* Purchase Journey */}
                            <Card className="bg-white p-4 flex flex-col">
                              <div className="mb-3 flex items-center justify-between w-full">
                                <div>
                                  <h3 className="text-sm font-semibold text-gray-900">Purchase Journey</h3>
                                  <p className="text-xs text-gray-500">Path to {selectedCampaign.prize}</p>
                                </div>
                                <Gift className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                              </div>
                              
                              <div className="relative">
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-emerald-100" />
                                {selectedCampaign.purchaseHistory?.map((purchase, i) => (
                                  <div key={i} className="relative flex items-start mb-4 last:mb-0">
                                    <div className="absolute left-4 top-2.5 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-emerald-600 ring-4 ring-white" />
                                    <div className="ml-8">
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-900">
                                          {purchase.product}
                                        </span>
                                        <span className="text-sm font-medium text-emerald-600">
                                          {purchase.amount}
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
                                  {selectedCampaign.uploadedReceipts}/{selectedCampaign.totalRequired} Stamps
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div className="grid grid-cols-6 gap-1">
                                  {Array.from({ length: selectedCampaign.totalRequired }).map((_, i) => (
                                    <div key={i} className="aspect-square relative">
                                      {i < selectedCampaign.uploadedReceipts ? (
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
                            {/* Recent Receipts */}
                            <div className="mt-0">
                              <ScrollArea className="h-[290px] pr-4">
                                <div className="space-y-4">
                                  {selectedCampaign.receipts?.map((receipt, index) => (
                                    <Card key={index}>
                                      <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                          <div>
                                            <p className="font-medium">Receipt #{receipt.id}</p>
                                            <p className="text-xs text-gray-400">{receipt.date}</p>
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

                            {/* Upload Receipt Button */}
                            <div className="mt-6 w-full flex justify-center">
                              <label className="w-2/3 border-2 border-dashed border-emerald-300 rounded-3xl p-6 cursor-pointer hover:bg-emerald-50 transition-colors flex flex-col items-center justify-center">
                                <Upload className="w-6 h-6 text-emerald-500 mb-2" />
                                <span className="text-sm font-medium text-emerald-600">Upload New Receipt</span>
                                <span className="text-xs text-gray-500 mt-1">Click or drag receipt image here</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                      // Handle the file upload here
                                      console.log('Receipt file:', file);
                                    }
                                  }}
                                />
                              </label>
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
          </>
        );
      
      case 'polls':
        return (
          <>
            {/* Welcome Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6 flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome, {userName || 'User'}!</h1>
                <p className="text-gray-600 mt-1">Track your rewards campaigns and poll participation.</p>
              </div>
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm relative">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-50">
                    <User className="w-8 h-8 text-blue-300" />
                  </div>
                )}
              </div>
            </div>

            {/* Polls Section */}
            <Card className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                  <CardTitle className="text-xl font-bold">Polls Participation</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-full hover:bg-emerald-50 transition-all group"
                  onClick={() => setActiveTab('dashboard')}
                >
                  <ChevronRight className="mr-1 w-5 h-5 text-emerald-600 rotate-180 group-hover:-translate-x-0.5 transition-transform" />
                  Back
                </Button>
              </CardHeader>
              <CardContent>
                {pollsParticipation.length > 0 ? (
                  <div className="space-y-4">
                    {pollsParticipation.map((poll) => (
                      <div 
                        key={poll.id} 
                        className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4 flex justify-between items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-900">{poll.title}</h3>
                          <p className="text-sm text-gray-600">{poll.brand}</p>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {poll.date}
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center mr-3">
                            <Check className="w-3 h-3 mr-1" />
                            Completed
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-gray-100 inline-flex p-4 rounded-full mb-4">
                      <MessageSquare className="w-6 h-6 text-gray-400" />
                    </div>
                    <h3 className="text-gray-700 font-medium mb-1">No polls participation yet</h3>
                    <p className="text-sm text-gray-500 mb-4">Participate in brand polls to share your opinion</p>
                    <Button onClick={() => setActiveTab('brands')}>Find Polls</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        );

      case 'brands':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Discover Brands</h1>
              <p className="text-gray-600 mt-1">Find more consumer packaged goods brands and their campaigns.</p>
            </div>

            {/* Categories Section */}
            <div className="w-full">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4 p-1">
                  {['Prelims', 'Beverage', 'Coffee', 'Candy', 'Personal Care', 'Alcohol', 'Supplements'].map((category) => (
                    <motion.div
                               key={category}
                               className="flex-none first:ml-0"
                               whileTap={{ scale: 0.95 }}
                             >
                               <Button 
                                 variant={category === selectedCategory ? 'default' : 'outline'} 
                                 className={`whitespace-nowrap rounded-full px-4 sm:px-5 text-sm sm:text-base h-9 sm:h-10 ${
                                   category === selectedCategory 
                                     ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                                     : 'hover:bg-gray-100 text-gray-800 border-gray-200'
                                 } transition-all duration-200`}
                                 onClick={() => setSelectedCategory(category)}
                               >
                                 {category}
                               </Button>
                             </motion.div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {productData
                .filter(product => {
                  if (selectedCategory === 'Prelims') return true;
                  return product.category === selectedCategory;
                })
                .slice(
                  currentProductPage * 3,
                  (currentProductPage + 1) * 3
                )
                .map((product) => (
                  <div key={product.id} className="group w-full">
                    <div className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 h-full">
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 h-48 flex items-center justify-center relative">
                        <Image
                          src={product.imageSrc}
                          alt={product.name}
                          width={160}
                          height={160}
                          className="object-contain cursor-pointer group-hover:scale-110 transition-transform duration-300"
                        />
                        {product.influencer && (
                          <button
                            onClick={() => handleInfluencerClick(product.influencer)}
                            className="absolute bottom-3 right-3 w-12 h-12 rounded-full border-2 border-white overflow-hidden transition-transform duration-300 hover:scale-110 shadow-md"
                          >
                            <Image
                              src={product.influencer.image}
                              alt={product.influencer.name}
                              width={48}
                              height={48}
                              className="object-cover"
                            />
                          </button>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{product.brand}</h3>
                            <p className="text-gray-600 text-sm">{product.category}</p>
                          </div>
                          <div className="flex items-center">
      <span className="text-lg font-bold">{product.price}</span>
      <span className="text-sm text-gray-500 ml-1">
        {product.brand === "ItsCalledW" ? "/stick" : 
         product.brand === "Ketone-IQ" ? "/serving" :
         product.category === "Beverage" ? "/pack" : "/bag"}
      </span>
    </div>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full mt-4 rounded-full"
                            >
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-[950px] p-0 rounded-lg">
                            <ScrollArea className="h-[84vh] p-4 rounded-md">
                              <div className="mt-5 p-0 sm:p-1">
                                <DialogHeader className="mb-4 sm:mb-6">
                                  <div className="sm:flex sm:items-center">
                                    <div className="sm:flex-auto">
                                      <DialogTitle className="text-lg sm:text-xl">{product.name} Overview</DialogTitle>
                                      <DialogDescription className="text-sm">
                                        Product details and variations
                                      </DialogDescription>
                                    </div>
                                    <div className="mt-4 sm:ml-16 sm:mt-0">
                                      <div className="bg-indigo-50 p-3 sm:p-3 rounded-full flex justify-between items-center border border-indigo-100">
                                        <h4 className="font-medium text-sm sm:text-base text-indigo-900 mr-8">Total</h4>
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
                                          {product.price}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="p-2 mt-2 relative min-h-44">
                                      <button 
                                        className="absolute -left-1 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white shadow-xl hover:bg-gray-50 transition-all border border-gray-100 hidden sm:flex items-center justify-center hover:scale-110"
                                        onClick={() => {
                                          const container = document.getElementById(`product-carousel-${product.id}`);
                                          if (container) container.scrollLeft -= container.offsetWidth / 2;
                                        }}
                                      >
                                        <ChevronRight className="w-5 h-5 text-gray-700 rotate-180" />
                                      </button>

                                      <div 
                                        id={`product-carousel-${product.id}`}
                                        className="flex overflow-x-auto sm:overflow-x-hidden scroll-smooth px-0 sm:px-0 gap-3 sm:gap-6 snap-x snap-mandatory sm:snap-none pb-4 sm:pb-0 -mx-2 sm:mx-0"
                                      >
                                        {product.similarProducts?.map((item: any) => (
                                          <div key={item.id} className="flex-none w-[80%] sm:w-1/3 snap-center first:ml-2 sm:first:ml-0">
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
                                                    src={item.imageUrl}
                                                    alt={item.name}
                                                    width={200}
                                                    height={200}
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
                                          const container = document.getElementById(`product-carousel-${product.id}`);
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
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Pagination */}
            {Math.ceil(productData.filter(product => {
              if (selectedCategory === 'Prelims') return true;
              return product.category === selectedCategory;
            }).length / 3) > 1 && (
              <div className="flex justify-center mt-8 space-x-1">
                {Array.from({
                  length: Math.ceil(
                    productData.filter(product => {
                      if (selectedCategory === 'Prelims') return true;
                      return product.category === selectedCategory;
                    }).length / 3
                  )
                }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentProductPage(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === currentProductPage ? 'bg-blue-600 w-4' : 'bg-gray-300 hover:bg-blue-400'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
              <p className="text-gray-600 mt-1">Manage your profile and preferences.</p>
            </div>
            
            <Card className="shadow-md">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input 
                          value={userEmail}
                          disabled
                          className="pl-10 rounded-[12px] bg-gray-50 py-6" 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Full Name</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input 
                          value={userName}
                          onChange={(e) => setUserName(e.target.value)}
                          className="pl-10 rounded-[12px] py-6" 
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Address</Label>
                      <div className="relative mt-1">
                        <HomeIcon className="absolute left-3 top-2 h-5 w-5 text-gray-400" />
                        <Textarea 
                          value={userAddress} 
                          onChange={(e) => setUserAddress(e.target.value)}
                          className="w-full resize-none rounded-[12px] pl-10"
                          rows={3}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Location</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                        <Input 
                          value={userLocation} 
                          onChange={(e) => setUserLocation(e.target.value)}
                          placeholder="City, State"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-4 bg-blue-600 rounded-2xl"
                      onClick={handleUpdateProfile}
                    >
                      Save Changes
                    </Button>
                  </div>
                  
                  <div className="flex flex-col items-center justify-start space-y-6">
                    <div className="relative group">
                      <Avatar className="w-32 h-32 border-4 border-white shadow-md">
                        <AvatarImage src={profileImage || ''} alt="Profile" />
                        <AvatarFallback>
                          <User className="w-16 h-16 text-blue-300" />
                        </AvatarFallback>
                      </Avatar>
                      
                      <label className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full shadow-md cursor-pointer transition-colors">
                        <Upload className="w-5 h-5" />
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleProfileImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                    
                    <div className="text-center mb-6">
                      <p className="text-sm text-gray-500">
                        {uploadingImage ? 'Uploading...' : 'Upload a profile picture'}
                      </p>
                    </div>

                    {/* Age and Gender inputs */}
                    <div className="w-full space-y-4">
                      <div>
                        <Label>Age</Label>
                        <div className="relative mt-1">
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                          <Input 
                            type="number" 
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            className="pl-10 rounded-[12px]"
                            placeholder="Enter your age"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Gender</Label>
                        <div className="relative mt-1">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="outline" 
                                className="w-full rounded-[12px] py-6 flex justify-between items-center pl-10 relative"
                              >
                                <Users className="absolute left-3 h-5 w-5 text-gray-400" />
                                <span className="text-left flex-1">
                                  {gender || "Select gender"}
                                </span>
                                <ChevronRight className="h-5 w-5 text-gray-400 rotate-90" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                              <DropdownMenuItem onClick={() => setGender("male")}>
                                Male
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setGender("female")}>
                                Female
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => setGender("other")}>
                                Other
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="w-full bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2">
                <Avatar className="w-9 h-9">
                  <AvatarImage src={LogoImage.src} alt="Logo" />
                  <AvatarFallback>MA</AvatarFallback>
                </Avatar>
                <span className="text-xl font-semibold text-zinc-800">Mall AI</span>
              </div>
            </Link>
          </div>
          
          <Button 
            onClick={handleSignOut}
            variant="outline" 
            className="flex items-center gap-2 rounded-full"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Navigation */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden sticky top-24">
              <nav className="p-4">
                <ul className="space-y-2">
                  <li>
                    <Button 
                      variant={activeTab === 'dashboard' ? 'default' : 'ghost'} 
                      className={`w-full justify-start rounded-2xl ${
                        activeTab === 'dashboard' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                      }`}
                      onClick={() => setActiveTab('dashboard')}
                    >
                      <Home className="w-4 h-4 mr-3" />
                      Dashboard
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeTab === 'brands' ? 'default' : 'ghost'} 
                      className={`w-full justify-start rounded-2xl ${
                        activeTab === 'brands' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                      }`}
                      onClick={() => setActiveTab('brands')}
                    >
                      <BarChart className="w-4 h-4 mr-3" />
                      Brands
                    </Button>
                  </li>
                  <li>
                    <Button 
                      variant={activeTab === 'settings' ? 'default' : 'ghost'} 
                      className={`w-full justify-start rounded-2xl ${
                        activeTab === 'settings' ? 'bg-blue-600 text-white hover:bg-blue-700' : ''
                      }`}
                      onClick={() => setActiveTab('settings')}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </Button>
                  </li>
                </ul>
              </nav>
              
              {/* Brands Subscribed Section */}
              <div className="p-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-medium text-sm">Brands Subscribed</h3>
                </div>
                <div className="space-y-3">
                  {subscribedBrands.length > 0 ? (
                    subscribedBrands.map((brand) => (
                      <div key={brand.id} className="flex items-center gap-3">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={brand.logo} alt={brand.name} />
                          <AvatarFallback>
                            {brand.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="overflow-hidden">
                          <p className="text-sm font-medium truncate">{brand.name}</p>
                          <p className="text-xs text-gray-500">{brand.campaigns} campaigns</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-2">
                      <p className="text-xs text-gray-500">No brands subscribed yet</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {renderTabContent()}
          </div>
        </div>
      </div>
      <InfluencerDialog
        influencer={selectedInfluencer}
        open={showInfluencerDialog}
        onOpenChange={setShowInfluencerDialog}
      />
      <ProductDetailDialog
        product={selectedProduct}
        open={showProductDialog}
        onOpenChange={setShowProductDialog}
      />
    </div>
  );
}