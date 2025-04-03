'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Facebook,
  Twitter,
  // Linkedin,
  Instagram,
  Youtube,
} from "lucide-react"

export function ConnectMedia() {
  const socialAccounts = [
    {
      name: "Facebook",
      icon: Facebook,
      color: "text-[#1877F2]",
      onClick: () => console.log("Connect Facebook"),
    },
    {
      name: "Twitter Profile",
      icon: Twitter,
      color: "text-[#1DA1F2]",
      onClick: () => console.log("Connect Twitter"),
    },
    // {
    //   name: "LinkedIn Page",
    //   icon: Linkedin,
    //   color: "text-[#0A66C2]",
    //   onClick: () => console.log("Connect LinkedIn"),
    // },
    {
      name: "Instagram Profile",
      icon: Instagram,
      color: "text-[#E4405F]",
      onClick: () => console.log("Connect Instagram"),
    },
    {
      name: "YouTube Channel",
      icon: Youtube,
      color: "text-[#FF0000]",
      onClick: () => console.log("Connect YouTube"),
    },
  ]

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {socialAccounts.map((account) => (
          <Card key={account.name} className="overflow-hidden">
            <CardContent className="p-4 flex flex-col items-center justify-center h-full">
              <div className="flex flex-col items-center space-y-2">
                <account.icon className={`w-8 h-8 ${account.color}`} />
                <span className="text-sm text-center font-medium">{account.name}</span>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 rounded-full text-emerald-700 bg-emerald-50 pr-4 pl-4"
              >
                Connect
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}