import React from 'react';
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserData } from "@/types/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";


interface UserProfileProps {
  userData: UserData;
}

const UserProfile: React.FC<UserProfileProps> = ({ userData }) => {
  if (!userData) return null;
  
  const isPremium = userData.subscriptionPlan === "Pro";
  const userTypeDisplay = {
    buyer: isPremium ? "Premium Buyer" : "Buyer",
    seller: isPremium ? "Premium Seller" : "Seller",
    agent: isPremium ? "Premium Agent" : "Agent",
    admin: "Admin"
  }[userData.userType] || "User";
  
  return (
    <Card className="flex items-center justify-between bg-white p-4 mb-9 rounded-3xl">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border-2 border-gray-200">
          <AvatarImage src={userData.photoURL} alt={userData.displayName} />
          <AvatarFallback><User size={24} /></AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{userData.displayName}</h2>
          <p className="text-gray-600">{userData.location}</p>
        </div>
      </div>
      <Badge className={`px-3 py-1 text-sm bg-[#FA2A55] rounded-2xl`}>
        {userTypeDisplay}
      </Badge>
    </Card>
  );
};

export default UserProfile;
