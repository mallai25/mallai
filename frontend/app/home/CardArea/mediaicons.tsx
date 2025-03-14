'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  PenIcon,
  Check,
  X
} from "lucide-react"
import { useState, useEffect } from "react"

interface SocialAccount {
  name: string;
  icon: any;
  color: string;
  username: string;
  bgColor: string;
  hoverBg: string;
  lightBg: string;
  url: string;
}

const MediaFalse = ({ product }) => {
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

  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  // Load existing social accounts from product
  useEffect(() => {
    if (product?.socialAccounts) {
      const updatedAccounts = accounts.map(account => {
        const existingAccount = product.socialAccounts.find(
          sa => sa.name === account.name
        )
        return existingAccount ? { ...account, username: existingAccount.username } : account
      })
      setAccounts(updatedAccounts)
    }
  }, [product, accounts])

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

  const handleSave = (name: string) => {
    const validatedValue = validateUsername(name, editValue);
    setAccounts(prev => prev.map(account =>
      account.name === name ? { ...account, username: validatedValue } : account
    ))
    setIsEditing(null)
    setEditValue("")
  }

  return (
    <div className="w-full p-2">
      <div className="text-center mb-6">
        <h3 className="text-lg font-medium">Edit Social Media Accounts</h3>
        <p className="text-sm text-gray-500 mt-1">Update your brand's social media connections</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <Card key={account.name} className="overflow-hidden group hover:shadow-md transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${account.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                  <account.icon className={`w-5 h-5 ${account.color}`} />
                </div>
                {isEditing === account.name ? (
                  <div className="flex-1 flex gap-2">
                    <Input
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border-gray-200 rounded-[12px] focus:border-emerald-500 focus:ring-emerald-500"
                      autoFocus
                    />
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-green-500 hover:text-green-600 p-2"
                        onClick={() => handleSave(account.name)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-gray-400 hover:text-gray-500 p-2"
                        onClick={() => {
                          setIsEditing(null)
                          setEditValue("")
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-between">
                    <span className="text-gray-600">
                      {account.username || `No ${account.name} connected`}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-gray-600 p-2"
                      onClick={() => {
                        setIsEditing(account.name)
                        setEditValue(account.username)
                      }}
                    >
                      <PenIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MediaFalse;