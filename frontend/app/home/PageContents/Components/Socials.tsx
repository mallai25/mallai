'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Check,
  X,
  Save,
} from "lucide-react"
import { useState, useEffect } from "react"
import { getAuth } from "firebase/auth";
import { doc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../../../FirebaseConfig';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { toast } from "@/components/ui/use-toast"

interface SocialAccount {
  name: string;
  icon: any;  // Changed from string to any to accept React components
  iconName: string;
  color: string;
  username: string;
  bgColor: string;
  hoverBg: string;
  lightBg: string;
  url: string;
}

interface MediaTrueProps {
  onUpdate?: (accounts: SocialAccount[]) => void;
  initialAccounts?: SocialAccount[];
  setHasChanges?: (hasChanges: boolean) => void; // Add this prop
}

export default function Socials({ onUpdate, initialAccounts, setHasChanges }: MediaTrueProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [displayAccounts, setDisplayAccounts] = useState<SocialAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingSocial, setEditingSocial] = useState<string | null>(null);
  const [socialEditValue, setSocialEditValue] = useState("");
  const [pendingChanges, setPendingChanges] = useState<SocialAccount[]>([]);
  const [openSocial, setOpenSocial] = useState<string | null>(null);
  const [savingAccount, setSavingAccount] = useState<string | null>(null);

  
  const defaultAccounts = [
    {
      name: "Facebook",
      icon: Facebook,
      iconName: "Facebook",
      color: "text-[#1877F2]",
      username: "",
      bgColor: "bg-[#1877F2]",
      hoverBg: "hover:bg-[#1877F2]/90",
      lightBg: "hover:bg-[#1877f2]/10",
      url: "https://facebook.com",
      isOpen: false
    },
    {
      name: "Twitter",
      icon: Twitter,
      iconName: "Twitter",
      color: "text-[#1DA1F2]",
      username: "",
      bgColor: "bg-[#1DA1F2]",
      hoverBg: "hover:bg-[#1DA1F2]/90",
      lightBg: "hover:bg-[#1DA1F2]/10",
      url: "https://twitter.com",
      isOpen: false
    },
    {
      name: "Instagram Profile",
      icon: Instagram,
      iconName: "Instagram",
      color: "text-[#E4405F]",
      username: "",
      bgColor: "bg-[#E4405F]",
      hoverBg: "hover:bg-[#E4405F]/90",
      lightBg: "hover:bg-[#E4405F]/10",
      url: "https://instagram.com",
      isOpen: false
    },
    {
      name: "YouTube Channel",
      icon: Youtube,
      iconName: "YouTube",
      color: "text-[#FF0000]",
      username: "",
      bgColor: "bg-[#FF0000]",
      hoverBg: "hover:bg-[#FF0000]/90",
      lightBg: "hover:bg-[#FF0000]/10",
      url: "https://youtube.com",
      isOpen: false
    },
  ];

  useEffect(() => {
    if (initialAccounts && initialAccounts.length > 0) {
      // Create a complete set of accounts by merging initialAccounts with defaultAccounts
      const mergedAccounts = defaultAccounts.map(defaultAccount => {
        const matchingAccount = initialAccounts.find(account => account.name === defaultAccount.name);
        return matchingAccount ? { ...defaultAccount, ...matchingAccount } : defaultAccount;
      });
      
      setAccounts(mergedAccounts);
      setDisplayAccounts(mergedAccounts);
      setPendingChanges(mergedAccounts);
    } else {
      setAccounts(defaultAccounts);
      setDisplayAccounts(defaultAccounts);
      setPendingChanges(defaultAccounts);
    }
  }, [initialAccounts]);

  // Update parent component whenever accounts change
  useEffect(() => {
    if (accounts.length > 0) {
      onUpdate?.(accounts);
    }
  }, [accounts, onUpdate]);

  const handleSocialSave = async (name: string) => {
    setSavingAccount(name);
    setIsLoading(true);
    try {
      const account = accounts.find(acc => acc.name === name);
      if (!account) return;
      
      const validatedValue = validateUsername(name, account.username);
      if (validatedValue.trim()) {
        const updatedAccounts = [...accounts];
        const existingIndex = accounts.findIndex(acc => acc.name === name);
        
        if (existingIndex >= 0) {
          updatedAccounts[existingIndex] = {
            ...updatedAccounts[existingIndex],
            username: validatedValue
          };
        } else {
          const accountTemplate = defaultAccounts.find(acc => acc.name === name);
          if (accountTemplate) {
            updatedAccounts.push({
              ...accountTemplate,
              username: validatedValue
            });
          }
        }
        
        setAccounts(updatedAccounts);
        setDisplayAccounts(updatedAccounts);
        setPendingChanges(updatedAccounts);
        setHasChanges?.(true);
        
        // Save this specific account to Firebase
        const user = getAuth().currentUser;
        if (user) {
          const userRef = doc(FIREBASE_DB, 'users', user.uid);
          const accountsToSave = updatedAccounts
            .filter(acc => acc.username?.trim())
            .map(acc => ({
              name: acc.name,
              username: acc.username?.trim(),
              url: acc.url,
              icon: acc.iconName || '',
              iconName: acc.iconName,
              color: acc.color,
              bgColor: acc.bgColor,
              hoverBg: acc.hoverBg,
              lightBg: acc.lightBg
            }));

          await updateDoc(userRef, { 
            socialAccounts: accountsToSave
          });
          
          toast({
            title: "Success",
            description: `${name} account updated successfully`,
            variant: "default"
          });
        }
      }
    } catch (error) {
      console.error('Error updating social account:', error);
      toast({
        title: "Error",
        description: `Failed to update ${name} account`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setEditingSocial(null);
      setSocialEditValue("");
      setSavingAccount(null);
      setOpenSocial(null);
    }
  };

  const handleSaveAll = async () => {
    setIsLoading(true);
    try {
      const user = getAuth().currentUser;
      if (user) {
        const userRef = doc(FIREBASE_DB, 'users', user.uid);
        // Sanitize and validate the accounts data before saving
        const accountsToSave = pendingChanges
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

        if (accountsToSave.length > 0) {
          await updateDoc(userRef, { 
            socialAccounts: accountsToSave
          });
          onUpdate?.(accountsToSave);
          setHasChanges?.(false);
        }
      }
    } catch (error) {
      console.error('Error saving social accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const validateUsername = (name: string, value: string): string => {
    const cleanValue = value?.trim() || '';
    switch (name) {
      case "Facebook":
        return cleanValue.replace(/[^a-zA-Z0-9._-]/g, '');
      case "Twitter":
        return cleanValue.replace(/[^a-zA-Z0-9_]/g, '');
      case "Instagram Profile":
        return cleanValue.replace(/[^a-zA-Z0-9._]/g, '');
      case "YouTube Channel":
        return cleanValue.replace(/[^a-zA-Z0-9._-]/g, '');
      default:
        return cleanValue;
    }
  }

  const toggleSocialInput = (name: string) => {
    setOpenSocial(openSocial === name ? null : name);
  };

  const handleSocialInputChange = (name: string, value: string) => {
    const validatedValue = validateUsername(name, value);
    const updatedAccounts = [...accounts];
    const existingIndex = accounts.findIndex(acc => acc.name === name);
    
    if (existingIndex >= 0) {
      updatedAccounts[existingIndex] = {
        ...updatedAccounts[existingIndex],
        username: validatedValue
      };
    } else {
      const accountTemplate = defaultAccounts.find(acc => acc.name === name);
      if (accountTemplate) {
        updatedAccounts.push({
          ...accountTemplate,
          username: validatedValue
        });
      }
    }
    
    setAccounts(updatedAccounts);
    setDisplayAccounts(updatedAccounts);
    setPendingChanges(updatedAccounts);
    setHasChanges?.(true);
  };

  return (
    <div className="w-full pt-2 pr-2 pl-2 pb-0 justify-center">
      <div className="flex items-center justify-center space-x-4 mt-2">
        {defaultAccounts.map((account) => {
          const savedAccount = accounts.find(acc => acc.name === account.name);
          const isOpen = openSocial === account.name;
          const isSaving = savingAccount === account.name;

          return (
            <div
              key={account.name}
              className={`flex items-center transition-all duration-300 ease-in-out ${
                isOpen ? 'w-64' : 'w-10'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSocialInput(account.name)}
                className={`${account.bgColor} p-2.5 rounded-full text-white hover:opacity-90 transition-opacity relative flex items-center justify-center`}
              >
                <account.icon className="w-4 h-4" />
                {savedAccount?.username && !isOpen && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full" />
                )}
              </button>
              
              {isOpen && (
                <div className="ml-2 flex-1 flex items-center">
                  <Input
                    value={savedAccount?.username || ''}
                    onChange={(e) => handleSocialInputChange(account.name, e.target.value)}
                    placeholder="username"
                    className="w-full text-sm h-8 focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleSocialSave(account.name)}
                    disabled={isSaving}
                    className={`ml-1 p-1.5 rounded-full ${account.bgColor} text-white hover:opacity-90 transition-opacity`}
                  >
                    {isSaving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Check className="w-3 h-3" />
                    )}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}