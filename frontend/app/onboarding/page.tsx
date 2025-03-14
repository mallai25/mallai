'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Check, 
  ArrowRight, 
  User, 
  Lock, 
  Mail, 
  Building, 
  Globe, 
  CreditCard, 
  Shield, 
  Info,
  Phone,
  MapPin,
  Flag,
  Home as HomeIcon, 
  X,
  Plus,
  Barcode
} from 'lucide-react';
import { FIREBASE_AUTH } from '@/FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/FirebaseConfig';
import mallLogo from '@/components/Images/download.png';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";

// Loading component
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Countdown modal component
function CountdownModal({ isOpen, onClose, onComplete, isGuestUser = false }) {
  const [counter, setCounter] = useState(6);

  useEffect(() => {
    if (isOpen) {
      const timer = counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
      if (counter === 0) {
        onComplete();
      }
      return () => clearInterval(timer);
    }
  }, [counter, isOpen, onComplete]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            {isGuestUser ? 'Guest Session Ended' : 'Trial Started!'}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center text-white mb-6">
            <Check className="w-10 h-10" />
          </div>
          <p className="text-lg mb-6">
            {isGuestUser 
              ? 'Your guest session has ended. You will be redirected to create an account.'
              : 'Your account has been successfully created and your free trial has started.'}
          </p>
          <div className="relative w-24 h-24 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" 
                  cy="50" 
                  r="45" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="8"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * counter / 6)}
                  transform="rotate(-90 50 50)"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-blue-500">{counter}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            {isGuestUser 
              ? 'Redirecting to account creation...' 
              : 'Redirecting to dashboard...'}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// GS1 Purchase/Confirm Modal component
function GS1PurchaseModal({ isOpen, onClose, isConditioned = false }) {
  const [requesterName, setRequesterName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [barcodes, setBarcodes] = useState([]);
  const [isRequestSubmitted, setIsRequestSubmitted] = useState(false);

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  const handleExpiryChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      let formattedValue = value;
      if (value.length > 2) {
        formattedValue = value.slice(0, 2) + '/' + value.slice(2);
      }
      setExpiry(formattedValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsRequestSubmitted(true);
    }, 1500);
  };

  const handleContinue = () => {
    onClose();
  };


  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isConditioned ? "Confirm GS1 Standard Barcodes" : "Purchase GS1 Standard Barcodes"}</DialogTitle>
          <DialogDescription>
            {isConditioned 
              ? "Complete the form to confirm your existing GS1 barcodes." 
              : "Complete the form below to request purchase of GS1 barcodes for your brand."}
          </DialogDescription>
        </DialogHeader>
        
        {!isRequestSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="requesterName">Name of Requester</Label>
              <Input 
                id="requesterName" 
                value={requesterName} 
                onChange={(e) => setRequesterName(e.target.value)} 
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <div className="relative">
                <Input 
                  id="cardNumber" 
                  value={cardNumber} 
                  onChange={handleCardNumberChange} 
                  placeholder="1234 5678 9012 3456"
                  className="pr-10"
                  required
                />
                <div className="absolute right-3 top-2.5">
                  <CreditCard className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input 
                  id="expiry" 
                  value={expiry} 
                  onChange={handleExpiryChange} 
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input 
                  id="cvc" 
                  value={cvc} 
                  onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} 
                  placeholder="123"
                  required
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="w-full sm:w-auto px-6 py-2.5 border-2 hover:bg-gray-50 transition-all duration-200"
              >
                Do Later
              </Button>
              <Button 
                type="submit" 
                className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                    Processing...
                  </div>
                ) : (
                  'Submit Request'
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="bg-green-100 rounded-full p-3 mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">Request Has Been Made</h3>
            <p className="text-gray-600 text-center mb-6">
              Your {isConditioned ? "barcode confirmation" : "purchase request"} has been successfully submitted.
            </p>
            <Button 
              onClick={handleContinue}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-md shadow-sm hover:shadow-md transition-all duration-200"
            >
              Continue
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Barcode entry component
function BarcodeEntrySection({ barcodes, setBarcodes }) {
  const handleAddBarcode = () => {
    setBarcodes([...barcodes, { productName: '', barcodeNumber: '' }]);
  };

  const handleRemoveBarcode = (index) => {
    const newBarcodes = [...barcodes];
    newBarcodes.splice(index, 1);
    setBarcodes(newBarcodes);
  };

  const handleBarcodeChange = (index, field, value) => {
    const newBarcodes = [...barcodes];
    newBarcodes[index][field] = value;
    setBarcodes(newBarcodes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-medium">GS1 Standard Barcodes</h4>
        <Button 
          type="button" 
          onClick={handleAddBarcode}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Barcode
        </Button>
      </div>

      {barcodes.length === 0 && (
        <div className="text-center p-6 border border-dashed border-gray-300 rounded-lg">
          <Barcode className="h-8 w-8 mx-auto text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No barcodes added yet. Click the button above to add your first product barcode.</p>
        </div>
      )}

      {barcodes.map((barcode, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 p-4 bg-gray-50 rounded-lg relative">
          <div className="col-span-5">
            <Label htmlFor={`productName-${index}`}>Product Name</Label>
            <Input
              id={`productName-${index}`}
              value={barcode.productName}
              onChange={(e) => handleBarcodeChange(index, 'productName', e.target.value)}
              placeholder="Product name"
              className="mt-1"
            />
          </div>
          <div className="col-span-6">
            <Label htmlFor={`barcodeNumber-${index}`}>Barcode Number</Label>
            <div className="relative mt-1">
              <Barcode className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                id={`barcodeNumber-${index}`}
                value={barcode.barcodeNumber}
                onChange={(e) => handleBarcodeChange(index, 'barcodeNumber', e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="Enter GS1 barcode number"
                className="pl-10"
              />
            </div>
          </div>
          <div className="col-span-1 flex items-end justify-end">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => handleRemoveBarcode(index)}
              className="h-10 w-10 rounded-full hover:bg-red-100 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div></div>}>
      <OnboardingContent />
    </Suspense>
  );
}

function OnboardingContent() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'basic';
  const period = searchParams.get('period') || 'semiannual';

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuestUser, setIsGuestUser] = useState(false);
  const [guestUserId, setGuestUserId] = useState('');
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPlanDetails, setShowPlanDetails] = useState(true);
  const [companyInfo, setCompanyInfo] = useState({
    companyName: '',
    registrationNumber: '',
    postalAddress: '',
    physicalAddress: '',
    country: '',
    province: '',
    city: '',
    zipCode: '',
    companyEmail: '',
    companyPhone: '',
    website: '',
    hasGS1Barcode: false
  });
  const [billingOption, setBillingOption] = useState(plan === 'pro' ? period : (plan === 'conditioned' ? 'monthly' : ''));
  const [isAgreementChecked, setIsAgreementChecked] = useState(false);
  const [socialAccounts, setSocialAccounts] = useState([
    { 
      name: "Facebook", 
      iconName: "Facebook", 
      username: "", 
      bgColor: "bg-[#1877F2]", 
      color: "text-[#1877F2]",
      hoverBg: "hover:bg-[#1877F2]/90",
      isOpen: false,
      urlPrefix: "https://facebook.com"
    },
    { 
      name: "Twitter", 
      iconName: "Twitter", 
      username: "", 
      bgColor: "bg-[#1DA1F2]",
      color: "text-[#1DA1F2]",
      hoverBg: "hover:bg-[#1DA1F2]/90",
      isOpen: false,
      urlPrefix: "https://twitter.com"
    },
    { 
      name: "Instagram", 
      iconName: "Instagram", 
      username: "", 
      bgColor: "bg-[#E4405F]",
      color: "text-[#E4405F]",
      hoverBg: "hover:bg-[#E4405F]/90",
      isOpen: false,
      urlPrefix: "https://instagram.com"
    },
    { 
      name: "YouTube", 
      iconName: "Youtube", 
      username: "", 
      bgColor: "bg-[#FF0000]",
      color: "text-[#FF0000]",
      hoverBg: "hover:bg-[#FF0000]/90",
      isOpen: false,
      urlPrefix: "https://youtube.com"
    },
  ]);
  const [showGS1Modal, setShowGS1Modal] = useState(false);
  const [showCountdownModal, setShowCountdownModal] = useState(false);
  const [barcodes, setBarcodes] = useState([]);

  // Check if user is already authenticated or has a guest ID
  useEffect(() => {
    const storedGuestId = localStorage.getItem('guestUserId');

    if (storedGuestId) {
      setIsGuestUser(true);
      setGuestUserId(storedGuestId);

      // If guest user, fetch company info if they're at step 2 or 3
      if (step >= 2) {
        fetchGuestUserData(storedGuestId);
      }
    }

    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true);
        // Clear guest user status if authenticated
        if (storedGuestId) {
          localStorage.removeItem('guestUserId');
          setIsGuestUser(false);
        }

        // Fetch user data
        fetchUserData(user.uid);

        setStep(2); // Skip to step 2 if already authenticated
        setShowPlanDetails(false); // Hide plan details after authentication
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch guest user data
  const fetchGuestUserData = async (guestId) => {
    try {
      const guestUserDoc = await getDoc(doc(FIREBASE_DB, 'users', guestId));
      if (guestUserDoc.exists()) {
        const userData = guestUserDoc.data();

        // Load company info if available
        if (userData.companyName) {
          setCompanyInfo(prevState => ({
            ...prevState,
            companyName: userData.companyName || '',
            website: userData.website || '',
            companyEmail: userData.companyEmail || '',
            companyPhone: userData.companyPhone || ''
          }));
        }

        // Load social accounts if available
        if (userData.socialAccounts) {
          const userSocialAccounts = userData.socialAccounts;
          setSocialAccounts(prevAccounts => {
            return prevAccounts.map(account => {
              const matchedAccount = userSocialAccounts.find(acc => acc.name === account.name);
              if (matchedAccount) {
                return { ...account, username: matchedAccount.username || '' };
              }
              return account;
            });
          });
        }

        // Load barcodes if available and plan is conditioned
        if (userData.barcodes && plan === 'conditioned') {
          setBarcodes(userData.barcodes);
        }
      }
    } catch (err) {
      console.error("Error fetching guest user data:", err);
    }
  };

  // Fetch authenticated user data
  const fetchUserData = async (userId) => {
    try {
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.name) {
          setName(userData.name);
        }

        if (userData.email) {
          setEmail(userData.email);
        }

        // Load company info if available
        if (userData.companyName) {
          setCompanyInfo(prevState => ({
            ...prevState,
            companyName: userData.companyName || '',
            website: userData.website || '',
            companyEmail: userData.companyEmail || '',
            companyPhone: userData.companyPhone || ''
          }));
        }

        // Try to get more company details from companies collection
        try {
          const companyDoc = await getDoc(doc(FIREBASE_DB, 'companies', userId));
          if (companyDoc.exists()) {
            const companyData = companyDoc.data();
            setCompanyInfo(prevState => ({
              ...prevState,
              ...companyData
            }));
          }
        } catch (err) {
          console.error("Error fetching company data:", err);
        }

        // Load social accounts if available
        if (userData.socialAccounts) {
          const userSocialAccounts = userData.socialAccounts;
          setSocialAccounts(prevAccounts => {
            return prevAccounts.map(account => {
              const matchedAccount = userSocialAccounts.find(acc => acc.name === account.name);
              if (matchedAccount) {
                return { ...account, username: matchedAccount.username || '' };
              }
              return account;
            });
          });
        }

        // Load barcodes if available and plan is conditioned
        if (userData.barcodes && plan === 'conditioned') {
          setBarcodes(userData.barcodes);
        }
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    }
  };

  // Continue as guest viewer
  const handleContinueAsGuest = () => {
    try {
      setLoading(true);

      // Generate a random temporary ID just for tracking in localStorage
      const tempId = 'guest_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

      // Save to localStorage
      localStorage.setItem('guestUserId', tempId);
      setGuestUserId(tempId);
      setIsGuestUser(true);

      // No Firebase account creation for guest viewer - just keep all in state
      // This way we don't create unnecessary entries in the database

      // Move to next step
      setStep(2);
      setShowPlanDetails(false);
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error("Error setting up guest viewer:", err);
      setError("Failed to set up guest viewer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        FIREBASE_AUTH, 
        email, 
        password
      );

      // Check if guest user data exists
      const storedGuestId = localStorage.getItem('guestUserId');

      if (storedGuestId) {
        // Get guest user data
        const guestUserRef = doc(FIREBASE_DB, 'users', storedGuestId);
        const guestUserDoc = await getDoc(guestUserRef);

        if (guestUserDoc.exists()) {
          // Transfer data to permanent user
          const guestData = guestUserDoc.data();

          // Merge guest data with new user data
          await setDoc(doc(FIREBASE_DB, 'users', userCredential.user.uid), {
            ...guestData,
            uid: userCredential.user.uid,
            email: email,
            name: name,
            isTemporary: false,
            createdAt: new Date().toISOString(),
            isOnboardingComplete: false
          });

          // If there's company data, transfer it too
          if (guestData.companyName) {
            const guestCompanyRef = doc(FIREBASE_DB, 'companies', storedGuestId);
            const guestCompanyDoc = await getDoc(guestCompanyRef);

            if (guestCompanyDoc.exists()) {
              const companyData = guestCompanyDoc.data();
              await setDoc(doc(FIREBASE_DB, 'companies', userCredential.user.uid), {
                ...companyData,
                userId: userCredential.user.uid
              });
            }
          }

          // Remove temporary user (optional)
          // await deleteDoc(guestUserRef);
        } else {
          // Just create new user if no guest data
          await setDoc(doc(FIREBASE_DB, 'users', userCredential.user.uid), {
            uid: userCredential.user.uid,
            email: email,
            name: name,
            plan: plan,
            billingPeriod: plan === 'pro' ? billingOption : (plan === 'conditioned' ? billingOption : 'monthly'),
            createdAt: new Date().toISOString(),
            isOnboardingComplete: false
          });
        }

        // Clear guest user ID
        localStorage.removeItem('guestUserId');
        setIsGuestUser(false);
      } else {
        // No guest data, just create new user
        await setDoc(doc(FIREBASE_DB, 'users', userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: email,
          name: name,
          plan: plan,
          billingPeriod: plan === 'pro' ? billingOption : (plan === 'conditioned' ? billingOption : 'monthly'),
          createdAt: new Date().toISOString(),
          isOnboardingComplete: false
        });
      }

      setIsAuthenticated(true);

      // If we're at the billing step and came from "Create Account" in billing, hide the form
      if (step === 3 && showCreateAccount) {
        setShowCreateAccount(false);
      } else {
        // Otherwise advance to company info
        setStep(2);
        setShowPlanDetails(false); // Hide plan details after account creation
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const user = FIREBASE_AUTH.currentUser;
      const userId = user ? user.uid : guestUserId;

      if (userId) {
        // Extract social accounts that have usernames
        const filteredSocialAccounts = socialAccounts
          .filter(acc => acc.username)
          .map(acc => ({
            name: acc.name,
            icon: acc.iconName,
            username: acc.username,
            url: `${acc.urlPrefix}/${acc.username}`
          }));

        // Save company info to Firestore
        await setDoc(doc(FIREBASE_DB, 'companies', userId), {
          ...companyInfo,
          userId: userId,
          socialAccounts: filteredSocialAccounts,
          barcodes: plan === 'conditioned' ? barcodes : [],
          createdAt: new Date().toISOString(),
        });

        // Update user document with company information
        await updateDoc(doc(FIREBASE_DB, 'users', userId), {
          companyName: companyInfo.companyName,
          website: companyInfo.website,
          companyEmail: companyInfo.companyEmail,
          companyPhone: companyInfo.companyPhone,
          socialAccounts: filteredSocialAccounts,
          barcodes: plan === 'conditioned' ? barcodes : []
        });

        setStep(3);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err: any) {
      console.error(err);
      setError('Error saving company information');
    } finally {
      setLoading(false);
    }
  };

  const handleBillingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Call handleStartFreeTrial instead of duplicating logic
    handleStartFreeTrial();
  };

  const handleSocialInputChange = (name: string, value: string) => {
    setSocialAccounts(accounts => {
      return accounts.map(account => {
        if (account.name === name) {
          const cleanUsername = value.replace(/[@\s]/g, '');
          return { ...account, username: cleanUsername };
        }
        return account;
      });
    });
  };

  const toggleSocialInput = (name: string) => {
    setSocialAccounts(accounts =>
      accounts.map(account => ({
        ...account,
        isOpen: account.name === name ? !account.isOpen : account.isOpen
      }))
    );
  };

  const handleStartFreeTrial = async () => {
    try {
      const user = FIREBASE_AUTH.currentUser;
      
      console.log("Start Free Trial - User status:", { 
        isAuthenticated, 
        isGuestUser,
        showCreateAccount,
        userId: user ? user.uid : guestUserId 
      });

      // For guest users who haven't created an account yet
      if (isGuestUser) {
        console.log("Guest user - showing countdown modal");
        // Show countdown modal which will redirect to account creation
        setShowCountdownModal(true);
        setLoading(false);
        return;
      }

      if (user) {
        console.log("Authenticated user - saving subscription info");
        // Save billing information
        await addDoc(collection(FIREBASE_DB, 'subscriptions'), {
          userId: user.uid,
          plan: plan,
          billingOption: billingOption,
          trialStart: new Date().toISOString(),
          trialEnd: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days from now
          status: 'trial',
          createdAt: new Date().toISOString(),
        });

        // Set onboarding as complete
        await updateDoc(doc(FIREBASE_DB, 'users', user.uid), {
          isOnboardingComplete: true,
          completedAt: new Date().toISOString(),
        });

        // Show countdown modal for authenticated users
        console.log("Showing countdown modal for authenticated user");
        setShowCountdownModal(true);
      } else {
        console.log("No authenticated user found - cannot proceed");
        setError('Authentication error. Please try logging in again.');
      }
    } catch (err) {
      console.error("Error starting free trial:", err);
      setError('Error processing subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCountdownComplete = () => {
    console.log("Countdown complete - User status:", { isGuestUser, isAuthenticated });
    
    if (isGuestUser) {
      // For guest users, go back to step 1 (account creation)
      console.log("Redirecting guest user to account creation");
      setStep(1);
      setShowPlanDetails(true);
      setShowCreateAccount(false);
      setShowCountdownModal(false);
    } else {
      // For authenticated users, go to home page
      console.log("Redirecting authenticated user to home page");
      window.location.href = '/home';
    }
  };

  // Get plan details based on the selected plan
  const getPlanDetails = () => {
    switch (plan) {
      case 'pro':
        return {
          name: 'Pro Plan',
          price: billingOption === 'annual' ? '$372/ 6 months' : '$186/ 6 months',
          commitment: billingOption === 'annual' ? '12 Month Commitment' : '6 Month Commitment',
          color: 'bg-blue-500',
          textColor: 'text-blue-500',
          features: [
            'Purchase GS1 Barcode',
            'Dynamic QR Data',
            'Product Profile pages',
            'Entity Validation',
            'Rewards Campaigns setup',
            'Create Quick Product Polls',
            'Highlight SKU Management',
            'Receive orders through Stripe',
            'Product description creation assistance'
          ]
        };
      case 'enterprise':
        return {
          name: 'Enterprise Plan',
          price: '$199/month',
          commitment: '12 Month Commitment',
          color: 'bg-gray-800',
          textColor: 'text-gray-800',
          features: [
            'Purchase GS1 Barcode',
            'Dynamic QR Data',
            'Product Profile pages',
            'Entity Validation',
            'Rewards Campaigns setup',
            'Create Quick Product Polls',
            'Highlight SKU Management',
            'Receive Direct orders through Stripe',
            'Product description creation assistance'
          ]
        };
      case 'conditioned':
        return {
          name: 'Conditioned Plan',
          price: billingOption === 'monthly' ? '$31/month' : '$186/month',
          commitment: billingOption === 'monthly' ? 'Monthly' : '6 Month Commitment',
          color: 'bg-purple-500',
          textColor: 'text-purple-500',
          features: [
            'For brands with GS1 barcodes',
            'Dynamic QR Data',
            'Product Profile pages',
            'Entity Validation',
            'Rewards Campaigns setup',
            'Create Quick Product Polls',
            'Highlight SKU Management',
            'Receive Direct orders through Stripe'
          ]
        };
      default:
        return {
          name: 'Basic Plan',
          price: '$29/month',
          commitment: 'Monthly',
          color: 'bg-emerald-500',
          textColor: 'text-emerald-500',
          features: [
            'Purchase GS1 Barcode',
            'Dynamic QR Data',
            'Product Profile pages',
            'Entity Validation',
            'Rewards Campaigns setup',
            'Create Quick Product Polls',
            'Highlight SKU Management',
            'Receive Direct orders through Stripe',
            'Product description creation assistance'
          ]
        };
    }
  };

  const planDetails = getPlanDetails();

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
          <header className="backdrop-blur-lg bg-white/70 py-4">
            <div className="container mx-auto px-4 flex items-center">
              <Link href="/" className="flex items-center gap-2 w-fit">
            <Image
              src={mallLogo}
              alt="Logo"
              width={36}
              height={36}
              className="object-contain rounded-lg"
            />
            <span className="text-xl font-semibold text-zinc-800">Mall AI</span>
          </Link>
            </div>
          </header>

          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl">
              {/* Steps indicator */}
              <div className="mb-8">
                <div className="flex justify-between items-center">
                  <div className={`flex flex-col items-center ${step >= 1 ? planDetails.textColor : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full ${step >= 1 ? planDetails.color : 'bg-gray-200'} flex items-center justify-center text-white mb-2`}>
                      {step > 1 ? <Check className="w-5 h-5" /> : <User className="w-5 h-5" />}
                    </div>
                    <span className="text-sm">Account</span>
                  </div>

                  <div className={`flex-1 h-1 mx-2 ${step >= 2 ? planDetails.color : 'bg-gray-200'}`} />

                  <div className={`flex flex-col items-center ${step >= 2 ? planDetails.textColor : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full ${step >= 2 ? planDetails.color : 'bg-gray-200'} flex items-center justify-center text-white mb-2`}>
                      {step > 2 ? <Check className="w-5 h-5" /> : <Building className="w-5 h-5" />}
                    </div>
                    <span className="text-sm">Company</span>
                  </div>

                  <div className={`flex-1 h-1 mx-2 ${step >= 3 ? planDetails.color : 'bg-gray-200'}`} />

                  <div className={`flex flex-col items-center ${step >= 3 ? planDetails.textColor : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full ${step >= 3 ? planDetails.color : 'bg-gray-200'} flex items-center justify-center text-white mb-2`}>
                      {step > 3 ? <Check className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                    </div>
                    <span className="text-sm">Billing</span>
                  </div>

                  <div className={`flex-1 h-1 mx-2 ${step >= 4 ? planDetails.color : 'bg-gray-200'}`} />

                  <div className={`flex flex-col items-center ${step >= 4 ? planDetails.textColor : 'text-gray-400'}`}>
                    <div className={`w-10 h-10 rounded-full ${step >= 4 ? planDetails.color : 'bg-gray-200'} flex items-center justify-center text-white mb-2`}>
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-sm">Complete</span>
                  </div>
                </div>
              </div>

              {/* Card with selected plan info */}
              {showPlanDetails && (
                <div className="bg-white rounded-3xl shadow-lg p-6 mb-8">
                  <div className="flex items-center mb-4">
                    <div className={`w-16 h-16 ${planDetails.color} rounded-2xl flex items-center justify-center text-white mr-4`}>
                      <span className="text-2xl font-bold">{plan.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{planDetails.name}</h3>
                      <p className="text-gray-500">{planDetails.commitment}</p>
                      <p className="text-2xl font-bold">{planDetails.price}</p>
                      <p className="text-sm text-green-600 font-medium">15 days free trial</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 1: Account Information */}
              {step === 1 && (
                <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 relative">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">Create</h2>
                  <Button
  type="button"
  variant="outline"
  onClick={handleContinueAsGuest}
  className="text-sm py-2.5 px-5 rounded-xl bg-purple-600 text-white hover:opacity-90 transition-all duration-300 font-medium flex items-center gap-2 hover:shadow-sm hover:shadow-purple-100 border-none"
  disabled={loading}
>
  {loading ? (
    <>
      <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      Processing...
    </>
  ) : (
    'Guest Viewer'
  )}
</Button>
                </div>
              
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                  </div>
                )}
              
                <form onSubmit={handleSignUp} className="space-y-6">
                  <div>
                    <Label htmlFor="email" className="text-gray-700 font-medium mb-1 block">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 border-2 rounded-xl py-6"
                        placeholder="you@example.com"
                        required
                      />
                    </div>
                  </div>
              
                  <div>
                    <Label htmlFor="name" className="text-gray-700 font-medium mb-1 block">Full Name</Label>
                    <div className="relative mt-2">
                      <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-10 border-2 rounded-xl py-6"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
              
                  <div>
                    <Label htmlFor="password" className="text-gray-700 font-medium mb-1 block">Password</Label>
                    <div className="relative mt-2">
                      <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 border-2 rounded-xl py-6"
                        placeholder="••••••••••"
                        required
                      />
                    </div>
                  </div>
              
                  <Button
                    type="submit"
                    className={`w-full ${planDetails.color} hover:opacity-90 text-white py-6 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-lg`}
                    disabled={loading}
                  >
                    {loading ? 'Creating Account...' : 'Create & Continue'}
                  </Button>
                </form>
              </div>
              )}

              {/* Step 2: Company Information */}
              {step === 2 && (
                <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 relative">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Company Information</h2>
                    {isGuestUser && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        onClick={() => {
                          setStep(3);
                          // Scroll to top
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        Skip <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleCompanyInfoSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyName" className="text-gray-700 font-medium mb-1 block">Company Name</Label>
                        <div className="relative mt-2">
                          <Building className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="companyName"
                            type="text"
                            value={companyInfo.companyName}
                            onChange={(e) => setCompanyInfo({...companyInfo, companyName: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="Acme Inc."
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="registrationNumber" className="text-gray-700 font-medium mb-1 block">
                        Company Registration Number
                        </Label>
                        <div className="relative mt-2">
                          <Info className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="registrationNumber"
                            type="text"
                            value={companyInfo.registrationNumber}
                            onChange={(e) => setCompanyInfo({...companyInfo, registrationNumber: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="Registration Number"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="postalAddress" className="text-gray-700 font-medium mb-1 block">Postal Address</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="postalAddress"
                          type="text"
                          value={companyInfo.postalAddress}
                          onChange={(e) => setCompanyInfo({...companyInfo, postalAddress: e.target.value})}
                          className="pl-10 border-2 rounded-xl py-6"
                          placeholder="Postal Address"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="physicalAddress" className="text-gray-700 font-medium mb-1 block">Physical Address</Label>
                        <div className="relative mt-2">
                          <HomeIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="physicalAddress"
                            type="text"
                            value={companyInfo.physicalAddress}
                            onChange={(e) => setCompanyInfo({...companyInfo, physicalAddress: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="Street Address"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="country" className="text-gray-700 font-medium mb-1 block">Country</Label>
                        <div className="relative mt-2">
                          <Flag className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="country"
                            type="text"
                            value={companyInfo.country}
                            onChange={(e) => setCompanyInfo({...companyInfo, country: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="Country"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="province" className="text-gray-700 font-medium mb-1 block">Province/State</Label>
                        <div className="relative mt-2">
                          <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="province"
                            type="text"
                            value={companyInfo.province}
                            onChange={(e) => setCompanyInfo({...companyInfo, province: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="Province/State"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="city" className="text-gray-700 font-medium mb-1 block">City</Label>
                        <div className="relative mt-2">
                          <Building className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="city"
                            type="text"
                            value={companyInfo.city}
                            onChange={(e) => setCompanyInfo({...companyInfo, city: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="City"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="zipCode" className="text-gray-700 font-medium mb-1 block">
                          Zip Code 
                        </Label>
                        <div className="relative mt-2">
                          <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="zipCode"
                            type="text"
                            value={companyInfo.zipCode}
                            onChange={(e) => setCompanyInfo({...companyInfo, zipCode: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="Zip Code"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="companyEmail" className="text-gray-700 font-medium mb-1 block">Company Email</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="companyEmail"
                            type="email"
                            value={companyInfo.companyEmail}
                            onChange={(e) => setCompanyInfo({...companyInfo, companyEmail: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="company@example.com"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="companyPhone" className="text-gray-700 font-medium mb-1 block">Company Phone Number</Label>
                        <div className="relative mt-2">
                          <Phone className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input
                            id="companyPhone"
                            type="tel"
                            value={companyInfo.companyPhone}
                            onChange={(e) => setCompanyInfo({...companyInfo, companyPhone: e.target.value})}
                            className="pl-10 border-2 rounded-xl py-6"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="website" className="text-gray-700 font-medium mb-1 block">Website</Label>
                      <div className="relative mt-2">
                        <Globe className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input
                          id="website"
                          type="text"
                          value={companyInfo.website}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (value && !value.startsWith('http')) {
                              value = `https://${value}`;
                            }
                            setCompanyInfo({...companyInfo, website: value});
                          }}
                          className="pl-10 border-2 rounded-xl py-6"
                          placeholder="https://example.com"
                        />
                      </div>
                    </div>

                    {/* Social Media Accounts - Improved UI */}
                    <div className="pt-8">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {socialAccounts.map((account) => (
                          <Card 
                            key={account.name} 
                            className={`overflow-hidden transition-all duration-300 ${
                              account.username ? `border-2 ${account.color} border-opacity-50` : 'border border-gray-200'
                            }`}
                          >
                            <CardContent className="p-4">
                              <div className="flex flex-col items-center space-y-3">
                                <div 
                                  className={`w-10 h-10 ${account.bgColor} rounded-full flex items-center justify-center text-white mt-2`}
                                  onClick={() => toggleSocialInput(account.name)}
                                >
                                  {account.name === 'Facebook' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>}
                                  {account.name === 'Twitter' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>}
                                  {account.name === 'Instagram' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>}
                                  {account.name === 'YouTube' && <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>}
                                </div>
                                <span className="text-sm font-medium">{account.name}</span>

                                <div className="w-full">
                                  <div className="relative">
                                    <Input
                                      value={account.username}
                                      onChange={(e) => handleSocialInputChange(account.name, e.target.value)}
                                      placeholder="username"
                                      className="w-full text-sm pr-8 focus:ring-2"
                                    />
                                    {account.username && (
                                      <div className="absolute right-2 top-2">
                                        <Check className="h-4 w-4 text-green-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-2 text-center">
                                    {account.urlPrefix}/{account.username || 'username'}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>

                    {/* GS1 Barcode input for Conditioned Plan */}
                    {plan === 'conditioned' && (
                      <>
                        <div className="flex items-start space-x-2">
                          <Checkbox 
                            id="hasGS1Barcode" 
                            checked={companyInfo.hasGS1Barcode}
                            onCheckedChange={(checked) => 
                              setCompanyInfo({...companyInfo, hasGS1Barcode: checked as boolean})
                            }
                            className="mt-1"
                          />
                          <Label 
                            htmlFor="hasGS1Barcode"
                            className="text-sm text-gray-700 mt-0.5"
                          >
                            I confirm that my brand already has GS1 Standard Barcode
                          </Label>
                        </div>

                        {companyInfo.hasGS1Barcode && (
                          <BarcodeEntrySection barcodes={barcodes} setBarcodes={setBarcodes} />
                        )}
                      </>
                    )}

                    <Button
                      type="submit"
                      className={`w-full ${planDetails.color} hover:opacity-90 text-white py-6 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-lg`}
                      disabled={(plan === 'conditioned' && !companyInfo.hasGS1Barcode)}
                    >
                      {loading ? 'Saving...' : 'Continue to Billing'}
                    </Button>
                  </form>
                </div>
              )}

              {/* Step 3: Billing */}
              {step === 3 && (
                <div>
                  {/* Navigation for billing step */}
                  <div className="flex justify-end mb-4">
                    {!isGuestUser && (
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
                        onClick={() => setStep(2)}
                      >
                        <ArrowRight className="h-4 w-4 rotate-180" /> Back
                      </Button>
                    )}
                    {isGuestUser && (
                      <Button
                        type="button"
                        className={`${planDetails.color} hover:opacity-90 text-white px-4 py-2 rounded-xl font-medium`}
                        onClick={() => {
                          setStep(1);
                          setShowPlanDetails(true);
                        }}
                      >
                        Go Create Account
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Plan details */}
                    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6">Plan Details</h2>
                    <div className={`p-4 mb-6 rounded-xl ${planDetails.color} bg-opacity-10`}>
                      <h3 className={`text-xl font-semibold ${planDetails.textColor} mb-2`}>{planDetails.name}</h3>
                      <p className="text-gray-700 font-medium">{planDetails.price}</p>
                      <p className="text-sm text-green-600 font-medium">First 15 days free</p>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-800">Included Features:</h4>
                      <ul className="space-y-2">
                        {planDetails.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <Check className={`h-5 w-5 ${planDetails.textColor} mr-2 shrink-0`} />
                            <span className="text-gray-700">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {['basic', 'pro'].includes(plan) && (
                      <div className="mt-6">
                        <Button
                          onClick={() => setShowGS1Modal(true)}
                          className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl py-4 transition-all duration-300"
                        >
                          Request to Purchase GS1 Barcode
                        </Button>
                      </div>
                    )}

                    {/* Confirm GS1 Barcodes for Conditioned Plan */}
                    {plan === 'conditioned' && (
                      <div className="mt-6">
                        <Button
                          onClick={() => setShowGS1Modal(true)}
                          className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-xl py-4 transition-all duration-300"
                        >
                          Confirm your Current GS1 Standards Barcodes
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Billing form */}
                  <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
                    <h2 className="text-2xl font-bold mb-6">Start Your Free Trial</h2>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                      </div>
                    )}

                    <form onSubmit={handleBillingSubmit} className="space-y-6">
                      {['conditioned', 'pro', 'basic'].includes(plan) && (
                        <div className="space-y-4">
                          <Label className="text-gray-700 font-medium block">
                            {plan === 'pro' ? 'Confirm Billing Option' : 'Select Billing Option'}
                          </Label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* For Conditioned Plan */}
                            {plan === 'conditioned' && (
                              <>
                                <div 
                                  className={`border-2 ${billingOption === 'monthly' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} p-4 rounded-xl cursor-pointer`}
                                  onClick={() => setBillingOption('monthly')}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Monthly</span>
                                    {billingOption === 'monthly' && <Check className="h-5 w-5 text-purple-500" />}
                                  </div>
                                  <p className="text-2xl font-bold">$31<span className="text-sm font-normal text-gray-500">/mo</span></p>
                                  <p className="text-sm text-gray-500">Billed monthly</p>
                                </div>
                                <div 
                                  className={`border-2 ${billingOption === 'semiannual' ? 'border-purple-500 bg-purple-50' : 'border-gray-200'} p-4 rounded-xl cursor-pointer`}
                                  onClick={() => setBillingOption('semiannual')}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">6 Month</span>
                                    {billingOption === 'semiannual' && <Check className="h-5 w-5 text-purple-500" />}
                                  </div>
                                  <p className="text-2xl font-bold">$186<span className="text-sm font-normal text-gray-500">/mo</span></p>
                                  <p className="text-sm text-gray-500">6 month commitment</p>
                                </div>
                              </>
                            )}

                            {/* For Pro Plan */}
                            {plan === 'pro' && (
                              <>
                                <div 
                                  className={`border-2 ${billingOption === 'semiannual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} p-4 rounded-xl cursor-pointer`}
                                  onClick={() => setBillingOption('semiannual')}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">6 Month</span>
                                    {billingOption === 'semiannual' && <Check className="h-5 w-5 text-blue-500" />}
                                  </div>
                                  <p className="text-2xl font-bold">$186<span className="text-sm font-normal text-gray-500">/mo</span></p>
                                  <p className="text-sm text-gray-500">6 month commitment</p>
                                </div>
                                <div 
                                  className={`border-2 ${billingOption === 'annual' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'} p-4 rounded-xl cursor-pointer`}
                                  onClick={() => setBillingOption('annual')}
                                >
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">12 Month</span>
                                    {billingOption === 'annual' && <Check className="h-5 w-5 text-blue-500" />}
                                  </div>
                                  <p className="text-2xl font-bold">$372<span className="text-sm font-normal text-gray-500">/mo</span></p>
                                  <p className="text-sm text-gray-500">12 month commitment</p>
                                </div>
                              </>
                            )}

                            {/* For Basic Plan - show Pro options */}
                            {plan === 'basic' && (
                              <>
                                <div className="border-2 border-emerald-500 bg-emerald-50 p-4 rounded-xl cursor-pointer">
                                  <div className="flex justify-between items-center mb-2">
                                    <span className="font-medium">Basic</span>
                                    <Check className="h-5 w-5 text-emerald-500" />
                                  </div>
                                  <p className="text-2xl font-bold">$29<span className="text-sm font-normal text-gray-500">/mo</span></p>
                                  <p className="text-sm text-gray-500">Monthly billing</p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Guest user account creation form - hide if user is already authenticated */}
                      {isGuestUser && showCreateAccount && !isAuthenticated && (
                        <div className="mb-6 p-5 border-2 border-dashed border-gray-300 rounded-xl bg-white">
                          <h3 className="text-lg font-bold mb-4 text-center">Create Your Account</h3>
                          <p className="text-sm text-gray-600 mb-4 text-center">To start your free trial, please create your account</p>

                          <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                              <Label htmlFor="create-name" className="text-gray-700 font-medium mb-1 block">Full Name</Label>
                              <div className="relative mt-1">
                                <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                <Input
                                  id="create-name"
                                  type="text"
                                  value={name}
                                  onChange={(e) => setName(e.target.value)}
                                  className="pl-10 border-2 rounded-xl py-2"
                                  placeholder="John Doe"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="create-email" className="text-gray-700 font-medium mb-1 block">Email Address</Label>
                              <div className="relative mt-1">
                                <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                <Input
                                  id="create-email"
                                  type="email"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                  className="pl-10 border-2 rounded-xl py-2"
                                  placeholder="you@example.com"
                                  required
                                />
                              </div>
                            </div>

                            <div>
                              <Label htmlFor="create-password" className="text-gray-700 font-medium mb-1 block">Password</Label>
                              <div className="relative mt-1">
                                <Lock className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                                <Input
                                  id="create-password"
                                  type="password"
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                  className="pl-10 border-2 rounded-xl py-2"
                                  placeholder="••••••••••"
                                  required
                                />
                              </div>
                            </div>

                            <div className="flex justify-center">
                              <Button
                                type="submit"
                                className={`w-full ${planDetails.color} hover:opacity-90 text-white py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg`}
                                disabled={loading}
                              >
                                {loading ? 'Creating Account...' : 'Create Account'}
                              </Button>
                            </div>
                          </form>
                        </div>
                      )}

                      {/* Payment details - Now with additional benefits info */}
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <div className="flex items-center text-gray-700 mb-3">
                          <Shield className="h-5 w-5 mr-2 text-gray-500" />
                          <p className="text-sm">Your payment details will be collected after your free trial</p>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <p className="font-medium">15-day free trial</p>
                            <p className="text-sm text-gray-500">No payment required today</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">$0.00</p>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4 mt-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">Your brand will be able to use:</p>
                          <ul className="text-sm text-gray-600 space-y-1 pl-2">
                            <li className="flex items-start">
                              <div className="text-green-500 mr-2 mt-0.5"><Check className="h-4 w-4" /></div>
                              <span>Dynamic QR Code data</span>
                            </li>
                            <li className="flex items-start">
                              <div className="text-green-500 mr-2 mt-0.5"><Check className="h-4 w-4" /></div>
                              <span>Rewards Campaigns</span>
                            </li>
                            <li className="flex items-start">
                              <div className="text-green-500 mr-2 mt-0.5"><Check className="h-4 w-4" /></div>
                              <span>Product Polls</span>
                            </li>
                            <li className="flex items-start">
                              <div className="text-green-500 mr-2 mt-0.5"><Check className="h-4 w-4" /></div>
                              <span>AI Assisted Product Descriptions</span>
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="agreement" 
                          checked={isAgreementChecked}
                          onCheckedChange={(checked) => setIsAgreementChecked(checked as boolean)}
                          className="mt-1"
                        />
                        <Label 
                          htmlFor="agreement"
                          className="text-sm text-gray-700 mt-0.5"
                        >
                          I agree to the <a href="#" className={`${planDetails.textColor}`}>Terms of Service</a> and <a href="#" className={`${planDetails.textColor}`}>Privacy Policy</a>
                        </Label>
                      </div>

                        <Button
                          type="button"
                          onClick={handleStartFreeTrial}
                          className={`w-full ${planDetails.color} hover:opacity-90 text-white py-6 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-lg`}
                          disabled={loading || (plan === 'conditioned' && !billingOption) || !isAgreementChecked}
                        >
                          {loading ? (
                            <div className="flex items-center justify-center">
                              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
                              Processing...
                            </div>
                          ) : (
                            'Start Free Trial'
                          )}
                        </Button>
                    </form>
                  </div>
                </div>
                </div>
              )}

              {/* Step 4: Completion */}
              {step === 4 && (
                <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 text-center">
                  <div className={`w-20 h-20 ${planDetails.color} rounded-full mx-auto flex items-center justify-center text-white mb-6`}>
                    <Check className="w-10 h-10" />
                  </div>

                  <h2 className="text-2xl font-bold mb-4">Setup Complete!</h2>
                  <p className="text-gray-600 mb-8">
                    Your account has been successfully created and your free trial has started.
                  </p>

                  <Button
                    onClick={() => window.location.href = '/home'}
                    className={`px-8 ${planDetails.color} hover:opacity-90 text-white py-6 rounded-xl text-lg font-medium transition-all duration-300 hover:shadow-lg`}
                  >
                    Go to Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

      {/* GS1 Purchase/Confirm Modal */}
      <GS1PurchaseModal 
        isOpen={showGS1Modal} 
        onClose={() => setShowGS1Modal(false)} 
        isConditioned={plan === 'conditioned'}
      />

      {/* Countdown Modal */}
      <CountdownModal
        isOpen={showCountdownModal}
        onClose={() => setShowCountdownModal(false)}
        onComplete={handleCountdownComplete}
        isGuestUser={isGuestUser}
      />
              </div>
      )}
    </>
  );
}
