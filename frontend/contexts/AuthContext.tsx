import React, { createContext, useContext, useEffect, useState } from "react";
import { FIREBASE_AUTH, FIREBASE_DB } from "../FirebaseConfig";
import { User as FirebaseUser } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export type UserType = "seller" | "buyer" | "admin" | "agent";

interface UserData {
  uid: string;
  email: string;
  userType: UserType;
  displayName: string;
  location: string;
  photoURL?: string;
  subscriptionPlan?: "free" | "pro" | "business";
  subscriptionEndDate?: Date;
  phone?: string;
  listings?: string[];
  favorites?: string[];
  accountVerified?: boolean;
  lastActive?: Date;
}

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userData: UserData | null;
  loading: boolean;
  updateUserProfile: (data: Partial<UserData>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  userData: null,
  loading: true,
  updateUserProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(FIREBASE_DB, "users", user.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const updateUserProfile = async (data: Partial<UserData>) => {
    if (!FIREBASE_AUTH.currentUser) return;
    
    try {
      const userRef = doc(FIREBASE_DB, 'users', FIREBASE_AUTH.currentUser.uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date()
      });

      // Update local state
      setUserData(prevData => ({
        ...prevData,
        ...data
      }));
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    loading,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
