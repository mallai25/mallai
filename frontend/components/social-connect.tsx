'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Facebook, Instagram, Youtube, Globe, Plus, Twitter } from "lucide-react"

const iconMap = {
  Facebook,
  Instagram,
  Youtube,
  Globe,
  Twitter
}

interface SocialConnectProps {
  socialAccounts?: {
    name: string;
    icon: string;
    color: string;
    username: string;
  }[];
  variant?: 'default' | 'compact';
  showWebsite?: boolean;
}

export function SocialConnect({ 
  socialAccounts: productSocials,
  variant = 'default',
  showWebsite = true 
}: SocialConnectProps) {
  const defaultSocialAccounts = [
    {
      name: "Facebook",
      icon: "Facebook",
      color: "text-[#1877F2]",
      username: "JOYRIDESweets",
    },
    {
      name: "Instagram Profile",
      icon: "Instagram",
      color: "text-[#E4405F]",
      username: "joyridesweets",
    },
    {
      name: "Twitter",
      icon: "Twitter",
      color: "text-[#1DA1F2]",
      username: "joyridesweets",
    },
    {
      name: "YouTube Channel",
      icon: "Youtube",
      color: "text-[#FF0000]",
      username: "ryan",
    },
    {
      name: "Company Website",
      icon: "Globe",
      color: "text-[#2563EB]",
      username: "joyridesweets.com",
    },
  ]

  const getFullUrl = (account: typeof defaultSocialAccounts[0]) => {
    switch (account.name) {
      case "Facebook":
        return `https://www.facebook.com/${account.username.replace('@', '')}`;
      case "Instagram Profile":
        return `https://www.instagram.com/${account.username.replace('@', '')}`;
      case "Twitter":
        return `https://twitter.com/${account.username.replace('@', '')}`;
      case "YouTube Channel":
        return `https://www.youtube.com/@${account.username.replace('@', '')}`;
      case "Company Website":
        return account.username.startsWith('http') ? account.username : `https://${account.username}`;
      default:
        return '';
    }
  };

  // Filter out website and Twitter from cards
  const socialAccounts = (productSocials || []).filter(
    account => account.name !== "Company Website" && account.name !== "Twitter"
  );

  // Get website for separate display
  const websiteAccount = showWebsite ? (productSocials || []).find(
    account => account.name === "Company Website"
  ) : null;

  if (!productSocials || productSocials.length === 0) {
    return (
      <div className="w-full border border-dashed border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex flex-col pt-0.4 items-center justify-center space-y-4">
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 flex-1 md:flex-none"
              onClick={() => {
                // You can add navigation logic here if needed
              }}
            >
              <div className="bg-emerald-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
                <Plus className="w-2 h-2" />
              </div>
              Add Social Accounts
            </Button>
          </div>

        <a
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 w-fit py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm"
        >
          <span>Website</span>
        </a>
        </div>
    )
  }

  const onlyWebsitePresent = socialAccounts.length === 0 && websiteAccount;

  return (
    <div className="w-full space-y-4">
      {variant === 'default' && onlyWebsitePresent ? (
        <div className="w-full border border-dashed border-gray-200 rounded-lg p-6 space-y-4">
          <div className="flex flex-col pt-4 items-center justify-center space-y-4">
            <Button 
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-full px-4 flex-1 md:flex-none"
              onClick={() => {
                // You can add navigation logic here if needed
              }}
            >
              <div
               className="bg-emerald-400/50 text-white mr-1 flex justify-center items-center rounded-full p-1">
                <Plus className="w-2 h-2" />
              </div>
              Add Social Accounts
            </Button>
          </div>

          {websiteAccount && (
        <a
          href={getFullUrl(websiteAccount)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 w-fit py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm"
        >
          <span>Website</span>
        </a>
      )}
        </div>
      ) : (
        <ScrollArea className="w-full">
          <div className={`flex space-x-3 pb-3 ${variant === 'compact' ? 'justify-start' : ''}`}>
            {socialAccounts.map((account) => {
              const Icon = iconMap[account.icon as keyof typeof iconMap];
              const fullUrl = getFullUrl(account);
              return (
                <Card key={account.name} className={`flex-shrink-0 ${variant === 'compact' ? 'w-[120px]' : 'w-[140px] sm:w-[160px]'}`}>
                  <CardContent className="p-3 flex flex-col items-center justify-center h-full">
                    <div className="flex flex-col items-center space-y-1.5">
                      <Icon className={`${variant === 'compact' ? 'w-5 h-5' : 'w-6 h-6 sm:w-7 sm:h-7'} ${account.color}`} />
                      <span className={`${variant === 'compact' ? 'text-xs' : 'text-xs sm:text-sm'} text-center font-medium`}>
                        {account.name}
                      </span>
                    </div>
                    <a
                      href={fullUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`mt-2 rounded-full text-emerald-700 bg-emerald-50 px-3 py-0.5 ${variant === 'compact' ? 'text-xs' : 'text-xs sm:text-sm'} font-medium hover:bg-emerald-100 transition-colors`}
                    >
                      Active
                    </a>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      )}
      {websiteAccount && !onlyWebsitePresent && (
        <a
          href={getFullUrl(websiteAccount)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 w-fit py-1.5 px-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors text-sm"
        >
          <span>Website</span>
        </a>
      )}
    </div>
  )
}