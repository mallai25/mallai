'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react"
import { useState, useEffect } from "react"

interface SocialAccount {
  name: string;
  icon: any;
  color: string;
  username: string;
  bgColor: string,
  hoverBg: string,
  lightBg: string,
  url: string;
}

interface ListingSocialProps {
  onChange?: (accounts: SocialAccount[]) => void;
}

export function ListingSocial({ onChange }: ListingSocialProps) {
  const [accounts, setAccounts] = useState<SocialAccount[]>([
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-[#1877F2]",
      username: "",
      bgColor: "bg-[#1877F2]",
      hoverBg: "hover:bg-[#1877F2]/90",
      lightBg: "hover:bg-[#1877f2]/10",
      url: "https://facebook.com",
    },
    {
      name: "Twitter",
      icon: Twitter,
      color: "text-[#1DA1F2]",
      username: "",
      bgColor: "bg-[#1DA1F2]",
        hoverBg: "hover:bg-[#1DA1F2]/90",
        lightBg: "hover:bg-[#1DA1F2]/10",
        url: "https://twitter.com",
    },
    {
      name: "Instagram Profile",
      icon: Instagram,
      color: "text-[#E4405F]",
      username: "",
      bgColor: "bg-[#E4405F]",
      hoverBg: "hover:bg-[#E4405F]/90",
      lightBg: "hover:bg-[#E4405F]/10",
      url: "https://instagram.com",
    },
    {
      name: "YouTube Channel",
      icon: Youtube,
      color: "text-[#FF0000]",
      username: "",
      bgColor: "bg-[#FF0000]",
        hoverBg: "hover:bg-[#FF0000]/90",
        lightBg: "hover:bg-[#FF0000]/10",
        url: "https://youtube.com",
    },
  ])

  const validateUsername = (name: string, value: string): string => {
    const cleanValue = value.trim();
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

  const handleInputChange = (name: string, value: string) => {
    const validatedValue = validateUsername(name, value);
    const newAccounts = accounts.map(account => 
      account.name === name ? { ...account, username: validatedValue } : account
    );
    setAccounts(newAccounts);
    
    // Convert to the format expected by dashboard
    const formattedAccounts = newAccounts
      .filter(account => account.username)
      .map(account => {
        const iconName = account.name === "Instagram Profile" ? "Instagram" :
                        account.name === "YouTube Channel" ? "Youtube" :
                        account.name.split(' ')[0];
        
        return {
          name: account.name,
          icon: iconName,
          color: account.color,
          username: validatedValue,
          bgColor: account.bgColor,
          hoverBg: account.hoverBg,
          lightBg: account.lightBg,
          url: account.url,
        };
      });
    
    onChange?.(formattedAccounts);
  }

  return (
    <div className="w-full p-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <Card key={account.name} className="overflow-hidden group hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${account.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                  <account.icon className={`w-5 h-5 ${account.color}`} />
                </div>
                <Input
                  placeholder={account.name === "YouTube Channel" ? "@channel" : account.name === "Instagram Profile" ? "@username" : account.name === "Twitter" ? "@handle" : "username"}
                  value={account.username}
                  onChange={(e) => handleInputChange(account.name, e.target.value)}
                  className="border-gray-200 rounded-[12px] focus:border-emerald-500 focus:ring-emerald-500 transition-colors"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}