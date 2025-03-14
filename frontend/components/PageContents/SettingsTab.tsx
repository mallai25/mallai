'use client'

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, PenIcon, Check, X, Facebook, Twitter, Instagram, Youtube, ArrowRight
  ,Mail , User, Building, Globe, UserIcon, Info, HomeIcon, Phone, Flag, MapPin } from "lucide-react";
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, updateDoc, collection, query, where, getDocs, writeBatch, getDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import Socials from './Components/Socials';
import BarcodeManager from './Components/BarcodeManager';
import { toast } from "@/components/ui/use-toast";

interface SettingsTabProps {
  brandName: string;
  setBrandName: (name: string) => void;
  accounteeName: string;
  setAccounteeName: (name: string) => void;
  website: string;
  setWebsite: (url: string) => void;
  userEmail: string;
}

export function SettingsTab({
  brandName,
  setBrandName,
  accounteeName,
  setAccounteeName,
  website,
  setWebsite,
  userEmail
}: SettingsTabProps) {
  const [brandImage, setBrandImage] = useState<string | null>(null);
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [activeImageTab, setActiveImageTab] = useState<'brand' | 'background'>('brand');
  const [founder, setFounder] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialValues, setInitialValues] = useState({
    brandName,
    accounteeName,
    website
  });
  const [isLoading, setIsLoading] = useState(true);
  const [socialAccounts, setSocialAccounts] = useState<any[]>([]);
  const [barcodes, setBarcodes] = useState<any[]>([]);
  const [plan, setPlan] = useState('');
  const [billingPeriod, setBillingPeriod] = useState('');
  const [companyInfo, setCompanyInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"account" | "company">("account");
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Set up auth state listener to get the current user
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        // Handle not logged in state
        setCurrentUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  useEffect(() => {
    // Fetch existing user data when component mounts or when currentUser changes
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const user = currentUser || getAuth().currentUser;
        if (user) {
          const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
          const companyDoc = await getDoc(doc(FIREBASE_DB, 'companies', user.uid));

          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Update state with user data
            setBrandName(userData.brandName || '');
            setAccounteeName(userData.displayName || '');
            setWebsite(userData.website || '');
            setBrandImage(userData.brandImageUrl || null);
            setBackgroundImage(userData.backgroundImageUrl || null);
            setFounder(userData.founder || '');
            setSocialAccounts(userData.socialAccounts || []);
            setBarcodes(userData.barcodes || []);
            setPlan(userData.plan || 'basic');
            setBillingPeriod(userData.billingPeriod || '');
            
            // Update initial values to match fetched data
            setInitialValues({
              brandName: userData.brandName || '',
              accounteeName: userData.displayName || '',
              website: userData.website || ''
            });
          } else {
            // If user document doesn't exist, create it with default values
            const defaultUserData = {
              brandName: '',
              displayName: user.displayName || '',
              email: user.email || '',
              website: '',
              brandImageUrl: null,
              backgroundImageUrl: null,
              founder: '',
              socialAccounts: [],
              barcodes: [],
              plan: 'basic',
              billingPeriod: 'monthly',
              createdAt: new Date()
            };
            
            await setDoc(doc(FIREBASE_DB, 'users', user.uid), defaultUserData);
            
            // Set state with default values
            setBrandName('');
            setAccounteeName(user.displayName || '');
            setWebsite('');
            setSocialAccounts([]);
            
            setInitialValues({
              brandName: '',
              accounteeName: user.displayName || '',
              website: ''
            });
          }

          if (companyDoc.exists()) {
            setCompanyInfo(companyDoc.data());
          } else {
            // Create default company document if it doesn't exist
            const defaultCompanyData = {
              companyName: '',
              registrationNumber: '',
              postalAddress: '',
              physicalAddress: '',
              country: '',
              province: '',
              city: '',
              zipCode: '',
              companyEmail: user.email || '',
              companyPhone: '',
              website: '',
              createdAt: new Date()
            };
            
            await setDoc(doc(FIREBASE_DB, 'companies', user.uid), defaultCompanyData);
            setCompanyInfo(defaultCompanyData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error",
          description: "Failed to load user data. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); // Only run once on mount

  useEffect(() => {
    // Check if any values have changed from their initial state
    setHasChanges(
      initialValues.brandName !== brandName ||
      initialValues.accounteeName !== accounteeName ||
      initialValues.website !== website
    );
  }, [brandName, accounteeName, website, initialValues]);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>, imageType: 'brand' | 'background') => {
    const file = e.target.files?.[0];
    if (file) {
      setActiveImageTab(imageType);
      setUploadingImage(true);
      try {
        const imageUrl = await uploadImage(file);
        if (imageUrl) {
          if (imageType === 'brand') {
            setBrandImage(imageUrl);
          } else {
            setBackgroundImage(imageUrl);
          }
          setHasChanges(true);
        }
      } catch (error) {
        console.error('Error handling image upload:', error);
      }
      setUploadingImage(false);
    }
  };

  const handleSocialAccountsUpdate = async (accounts: any[]) => {
    setIsLoading(true);
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        await updateDoc(userRef, {
          socialAccounts: accounts
        });
        setSocialAccounts(accounts);
        setHasChanges(true);
        
        toast({
          title: "Success",
          description: "Social accounts updated successfully",
          variant: "default"
        });

        // Fetch updated data
        const updatedDoc = await getDoc(userRef);
        if (updatedDoc.exists()) {
          setSocialAccounts(updatedDoc.data().socialAccounts || []);
        }
      }
    } catch (error) {
      console.error('Error updating social accounts:', error);
      toast({
        title: "Error",
        description: "Failed to update social accounts",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBarcodesUpdate = async (updatedBarcodes: any[]) => {
    setBarcodes(updatedBarcodes);
  };

  // Helper function to get plan display name
  const getPlanDisplayName = () => {
    switch(plan) {
      case 'pro':
        return 'Pro Plan';
      case 'conditioned':
        return 'Conditioned Plan';
      case 'enterprise':
        return 'Enterprise Plan';
      default:
        return 'Basic Plan';
    }
  };

  // Helper function to get billing period display text
  const getBillingPeriodText = () => {
    switch(billingPeriod) {
      case 'annual':
        return '12 Month Billing';
      case 'semiannual':
        return '6 Month Billing';
      case 'monthly':
        return 'Monthly Billing';
      default:
        return 'Monthly Billing';
    }
  };

  return (
    <div className="space-y-6">
      <div className="w-full">
        
        {activeTab === "account" && (
          <div className="px-4 sm:px-0 relative">
            {/* Account and Brand Information Combined */}
            <Card className="w-full mb-6">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                   <div></div>
                    <div className="flex space-x-2 top-6 right-6">
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full`}
                        onClick={() => setActiveTab("account")}
                      >
                        <User className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`rounded-full`}
                        onClick={() => setActiveTab("company")}
                      >
                        <Building className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label>Email</Label>
                        <div className="relative mt-1">
                          <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input 
                            value={userEmail}
                            disabled
                            className="pl-10 rounded-[12px] bg-gray-50 py-6" 
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Account Name</Label>
                        <div className="relative mt-1">
                          <User className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input 
                            value={accounteeName}
                            onChange={(e) => setAccounteeName(e.target.value)}
                            className="pl-10 rounded-[12px] py-6" 
                            name="accounteeName" 
                          />
                        </div>
                      </div>

                      {/* Plan Information */}
                      <div className="pt-2">
                        <div className="bg-gray-50 p-4 rounded-xl">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{getPlanDisplayName()}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              plan === 'pro' ? 'bg-blue-100 text-blue-700' : 
                              plan === 'conditioned' ? 'bg-purple-100 text-purple-700' :
                              plan === 'enterprise' ? 'bg-gray-100 text-gray-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              Active
                            </span>
                          </div>
                          <p className="text-sm text-gray-500">{getBillingPeriodText()}</p>
                        </div>
                      </div>

                      <div>
                <Socials 
                  initialAccounts={socialAccounts}
                  onUpdate={handleSocialAccountsUpdate}
                  setHasChanges={setHasChanges}
                />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label>Brand Name</Label>
                        <div className="relative mt-1">
                          <Building className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input 
                            value={brandName}
                            onChange={(e) => setBrandName(e.target.value)}
                            className="pl-10 rounded-[12px] py-6" 
                            name="brandName" 
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Founder / Creator</Label>
                        <div className="relative mt-1">
                          <UserIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                          <Input 
                            value={founder}
                            onChange={(e) => {
                              setFounder(e.target.value);
                              setHasChanges(true);
                            }}
                            className="pl-10 rounded-[12px] py-6" 
                            name="founder" 
                            placeholder="Enter name"
                          />
                        </div>
                      </div>

                      {/* Brand and Background Image Uploads - Side by Side */}
                      <div className="pt-2">
                        <div className="flex space-x-8">
                          <div className="flex-1 justify-center px-6">
                            <label className="flex flex-col items-center justify-center w-full h-32 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden border border-gray-200">
                              {uploadingImage && activeImageTab === 'brand' ? (
                                <div className="flex flex-col items-center justify-center">
                                  <p className="text-sm text-gray-500">Uploading...</p>
                                </div>
                              ) : brandImage ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <img 
                                    src={brandImage} 
                                    alt="Brand Logo" 
                                    className="min-w-full min-h-full object-cover" 
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center p-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                                    <path d="M12 12v9"/>
                                    <path d="m16 16-4-4-4 4"/>
                                  </svg>
                                  <p className="text-xs text-gray-500 mt-1">Upload Logo</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'brand')}
                              />
                            </label>
                            <p className="text-sm text-center text-gray-500 mb-2 mt-2">Logo </p>
                          </div>
                          
                          <div className="flex-1 justify-center px-6">
                            <label className="flex flex-col items-center justify-center w-full h-32 rounded-full cursor-pointer bg-gray-50 hover:bg-gray-100 overflow-hidden border border-gray-200">
                              {uploadingImage && activeImageTab === 'background' ? (
                                <div className="flex flex-col items-center justify-center">
                                  <p className="text-sm text-gray-500">Uploading...</p>
                                </div>
                              ) : backgroundImage ? (
                                <div className="w-full h-full flex items-center justify-center">
                                  <img 
                                    src={backgroundImage} 
                                    alt="Background" 
                                    className="min-w-full min-h-full object-cover" 
                                  />
                                </div>
                              ) : (
                                <div className="flex flex-col items-center justify-center p-4">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/>
                                    <path d="M12 12v9"/>
                                    <path d="m16 16-4-4-4 4"/>
                                  </svg>
                                  <p className="text-xs text-gray-500 mt-1">Upload Background</p>
                                </div>
                              )}
                              <input 
                                type="file" 
                                className="hidden" 
                                accept="image/*"
                                onChange={(e) => handleImageChange(e, 'background')}
                              />
                            </label>
                            <p className="text-sm text-gray-500 mb-2 text-center mt-2">Background </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

          <div className="space-y-4 pt-4">
            <Button 
              className={`w-full rounded-full ${
                hasChanges ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-600/90'
              }`}
              onClick={async () => {
                setIsUpdating(true);
                setSaveSuccess(false);
                try {
                  const user = getAuth().currentUser;
                  if (user) {
                    const userRef = doc(FIREBASE_DB, 'users', user.uid);
                    
                    // Filter out social accounts with empty usernames
                    const filteredSocialAccounts = socialAccounts
                      .filter(account => account.username?.trim())
                      .map(account => ({
                        name: account.name,
                        username: account.username?.trim(),
                        url: account.url,
                        icon: account.iconName || '',
                        iconName: account.iconName,
                        color: account.color,
                        bgColor: account.bgColor,
                        hoverBg: account.hoverBg,
                        lightBg: account.lightBg
                      }));
                    
                    await updateDoc(userRef, {
                      brandName,
                      displayName: accounteeName,
                      website,
                      brandImageUrl: brandImage,
                      backgroundImageUrl: backgroundImage,
                      founder,
                      socialAccounts: filteredSocialAccounts,
                      updatedAt: new Date()
                    });

                    // Update company info if on company tab
                    if (companyInfo) {
                      const companyRef = doc(FIREBASE_DB, 'companies', user.uid);
                      await updateDoc(companyRef, {
                        ...companyInfo,
                        updatedAt: new Date()
                      });
                    }

                    // Update products with new brand name and website
                    const productsRef = collection(FIREBASE_DB, 'products');
                    const q = query(productsRef, where('userId', '==', user.uid));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                      const batch = writeBatch(FIREBASE_DB);
                      querySnapshot.docs.forEach((doc) => {
                        batch.update(doc.ref, {
                          brand: brandName,
                          website: website
                        });
                      });
                      await batch.commit();
                    }

                    setInitialValues({
                      brandName,
                      accounteeName,
                      website
                    });
                    setHasChanges(false);
                    setSaveSuccess(true);
                    
                    toast({
                      title: "Success",
                      description: "Your information has been updated successfully",
                      variant: "default"
                    });
                  }
                } catch (error) {
                  console.error('Error updating information:', error);
                  toast({
                    title: "Error",
                    description: "Failed to update information. Please try again.",
                    variant: "destructive"
                  });
                }
                setIsUpdating(false);
              }}
              disabled={isUpdating || !hasChanges}
            >
              {isUpdating ? 'Updating...' : hasChanges ? 'Save Changes' : 'Save'}
            </Button>
            {saveSuccess && (
              <p className="text-sm text-green-600 mt-2 text-center">
                Information updated successfully!
              </p>
            )}
          </div>
           </div>
        )}

        {activeTab === "company" && (
          <div>
            {/* Company Information */}
            <Card className="w-full">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                <div></div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full`}
                      onClick={() => setActiveTab("account")}
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className={`rounded-full`}
                      onClick={() => setActiveTab("company")}
                    >
                      <Building className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company Name</Label>
                      <div className="relative mt-1">
                        <Building className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input 
                          value={companyInfo?.companyName || ''}
                          onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, companyName: e.target.value})}
                          className="pl-10 rounded-[12px] py-6"
                          placeholder="Company Name"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Registration Number</Label>
                      <div className="relative mt-1">
                        <Info className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input 
                          value={companyInfo?.registrationNumber || ''}
                          onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, registrationNumber: e.target.value})}
                          placeholder="Registration Number (optional)"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Postal Address</Label>
                    <div className="relative mt-1">
                      <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input 
                        value={companyInfo?.postalAddress || ''}
                        onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, postalAddress: e.target.value})}
                        placeholder="Postal Address"
                        className="pl-10 rounded-[12px] py-6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Physical Address</Label>
                    <div className="relative mt-1">
                      <HomeIcon className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input 
                        value={companyInfo?.physicalAddress || ''}
                        onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, physicalAddress: e.target.value})}
                        placeholder="Physical Address"
                        className="pl-10 rounded-[12px] py-6"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Country</Label>
                      <div className="relative mt-1">
                        <Flag className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input 
                          value={companyInfo?.country || ''}
                          onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, country: e.target.value})}
                          placeholder="Country"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Province/State</Label>
                      <div className="relative mt-1">
                        <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input 
                          value={companyInfo?.province || ''}
                          onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, province: e.target.value})}
                          placeholder="Province/State"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>City</Label>
                      <div className="relative mt-1">
                        <Building className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input 
                          value={companyInfo?.city || ''}
                          onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, city: e.target.value})}
                          placeholder="City"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Zip Code</Label>
                    <div className="relative mt-1">
                      <MapPin className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input 
                        value={companyInfo?.zipCode || ''}
                        onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, zipCode: e.target.value})}
                        placeholder="Zip Code (optional)"
                        className="pl-10 rounded-[12px] py-6"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Company Email</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input 
                          value={companyInfo?.companyEmail || ''}
                          onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, companyEmail: e.target.value})}
                          placeholder="company@example.com"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Company Phone Number</Label>
                      <div className="relative mt-1">
                        <Phone className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                        <Input 
                          value={companyInfo?.companyPhone || ''}
                          onChange={(e) => companyInfo && setCompanyInfo({...companyInfo, companyPhone: e.target.value})}
                          placeholder="Phone Number"
                          className="pl-10 rounded-[12px] py-6"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label>Website</Label>
                    <div className="relative mt-1">
                      <Globe className="absolute left-3 top-4 h-5 w-5 text-gray-400" />
                      <Input 
                        value={companyInfo?.website || ''}
                        onChange={(e) => {
                          let value = e.target.value;
                          if (value && !value.startsWith('http')) {
                            value = `https://${value}`;
                          }
                          companyInfo && setCompanyInfo({...companyInfo, website: value});
                        }}
                        placeholder="https://example.com"
                        className="pl-10 rounded-[12px] py-6"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            
          </div>
        )}

        {plan === 'conditioned' && (
          <div>
            <BarcodeManager 
              initialBarcodes={barcodes} 
              onUpdate={handleBarcodesUpdate}
              setHasChanges={setHasChanges}
            />
          </div>
        )}
      </div>
    </div>
  );
}