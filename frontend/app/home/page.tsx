'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FIREBASE_AUTH, FIREBASE_DB } from '../../FirebaseConfig';
import {  ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import axios from 'axios';

import { Button } from "@/components/ui/button";
import { DashboardComponent } from './Components/dashboard';
import Image from 'next/image';
import LogoImage from './Images/download.png';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, Bell, LogOut, Upload, X, Inbox, Rocket, Check, ChevronRight, Package, Tag, Plus, Clock } from 'lucide-react';
import { WelcomePopup, ListingPopup, UploadPopup, GotItButton, CountdownButton } from './Components/WelcomePopups';

export default function HomePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string>("");
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [showListingPopup, setShowListingPopup] = useState(false);
  const [showUploadPopup, setShowUploadPopup] = useState(false);
  const [allStepsCompleted, setAllStepsCompleted] = useState(true);
  const [showCountdown, setShowCountdown] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [showWelcome, setShowWelcome] = useState(true);
  const [brandImageUrl, setBrandImageUrl] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);


  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
      } else {
        setDisplayName(user.displayName || "User");
        
        // Check user's login count
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.loginCount === 1 && !userData.Step1) {
            setShowWelcomePopup(true);
          }
        }
      }
    });

    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    const checkStepsStatus = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          const isCompleted = userData.StepsDone === true;
          setAllStepsCompleted(isCompleted);
        }
      }
    };
    checkStepsStatus();
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showCountdown && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      handleTutorialComplete();
    }
    return () => clearInterval(timer);
  }, [showCountdown, countdown]);

  useEffect(() => {
    const fetchBrandImage = async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) {
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists() && userDoc.data().brandImageUrl) {
          setBrandImageUrl(userDoc.data().brandImageUrl);
        }
      }
    };
    fetchBrandImage();
  }, []);

  const handleImageUpload = async (file: File) => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      if (!user) return;

      // Create form data for Cloudinary upload
      const formData = new FormData();
      formData.append('image', file);

      // Upload to Cloudinary
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/users/upload`, formData);
      
      if (response.data.success) {
        const imageUrl = response.data.data.secure_url;
        
        // Update Firebase with the new image URL
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        await updateDoc(userRef, {
          brandImageUrl: imageUrl
        });

        // Update local state
        setBrandImageUrl(imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleNextStep = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      await updateDoc(userRef, {
        Step1: true
      });
      setShowWelcomePopup(false);
      setShowListingPopup(true);
    }
  };

  const handleListingNext = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      await updateDoc(userRef, {
        Step2: true
      });
      setShowListingPopup(false);
      setShowUploadPopup(true);
    }
  };

  const handleUploadNext = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      await updateDoc(userRef, {
        Step3: true
      });
      setShowUploadPopup(false);
    }
  };


  const handleGotIt = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      await updateDoc(userRef, {
        Step1: true,
        Step2: true,
        Step3: true,
        Step4: true,
        Step5: true,
        StepsDone: true
      });
      setAllStepsCompleted(true);
      setShowCountdown(true);
      setShowWelcome(true);
    }
  };

  const handleWelcome = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      await updateDoc(userRef, {
        StepsDone: false
      });
      setAllStepsCompleted(false);
      setShowCountdown(false);
      setCountdown(10);
      setShowWelcome(true);
    }
  };

  const handleTutorialComplete = async () => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      const userRef = doc(FIREBASE_DB, 'users', user.uid);
      await updateDoc(userRef, {
        tutorialComplete: true
      });
      setShowCountdown(false);
      setShowWelcome(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await FIREBASE_AUTH.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="pl-0 pr-6 py-2">
        <div className="w-full bg-white border shadow-sm rounded-3xl ml-3 mr-4 px-6 py-3">
          <div className="flex justify-between items-center max-w-[1800px] mx-auto">
            <div className="flex items-center gap-2">
              <Image
                src={LogoImage}
                alt="Mall AI Logo"
                width={32}
                height={32}
                className="object-contain rounded-lg"
              />
              <span className="text-xl font-semibold text-zinc-800">Mall ai</span>
            </div>

            {/* Center - Brand Image Upload */}
            <div className="flex flex-col items-center">
              <label className="cursor-pointer">
                {/* <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                /> */}
                <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm hover:opacity-90 transition-opacity">
                  {brandImageUrl ? (
                    <Image
                      src={brandImageUrl}
                      alt="Brand"
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <></>
                    // <div className="w-full h-full flex items-center justify-center bg-gray-50">
                    //   <Upload className="w-5 h-5 text-gray-400" />
                    // </div>
                  )}
                </div>
              </label>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="outline" className="rounded-full px-4 py-2 border border-gray-200 hover:bg-gray-50 transition-all duration-200">
                <Settings className="h-4 w-4 mr-2 text-gray-600" />
                <span className="mr-1">Manage</span>
              </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-4 rounded-xl">
              <DropdownMenuItem 
                onClick={() => setShowNotifications(true)} 
                className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 text-base"
              >
                <Bell className="h-4 w-4 text-gray-600" />
                <span>Notifications</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer hover:bg-gray-50 text-red-600 hover:text-red-700 text-base"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="w-full pt-2">
        <DashboardComponent userName={displayName} allStepsCompleted={allStepsCompleted}
        showWelcome={showWelcome} />
      </div>

        {/* Use the new popup components */}
        {showWelcomePopup && <WelcomePopup onNext={handleNextStep} />}
        {showListingPopup && <ListingPopup onNext={handleListingNext} />}
        {showUploadPopup && <UploadPopup onNext={handleUploadNext} />}
        
        {!allStepsCompleted && <GotItButton onClick={handleGotIt} />}

            {showCountdown && showWelcome && (
          <CountdownButton countdown={countdown} onClick={handleWelcome} />
            )}

            {/* Add Notifications Popup */}
            {showNotifications && (
              <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 pt-32">
                <div className="bg-white rounded-2xl w-full max-w-md mx-4 shadow-xl">
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-gray-600" />
                        <h2 className="text-xl font-semibold">Notifications</h2>
                      </div>
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <X className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="bg-gray-100 p-4 rounded-full mb-4">
                        <Inbox className="h-8 w-8 text-gray-400" />
                      </div>
                      <p className="text-gray-500 text-center">No notifications yet</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
  );
}
