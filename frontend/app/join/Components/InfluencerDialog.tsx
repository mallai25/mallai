'use client';

import { useState } from "react";
import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";

// TikTok icon component
const TikTok = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

interface SocialAccount {
  name: string;
  icon: string;
  color: string;
  bgColor: string;
  hoverBg: string;
  lightBg: string;
  url: string;
  username?: string;
}

interface InfluencerInfo {
  id: string;
  name: string;
  image: any;
  bio: string;
  brand: string;
  socialAccounts: SocialAccount[];
}

interface InfluencerDialogProps {
  influencer?: InfluencerInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InfluencerDialog({ influencer, open, onOpenChange }: InfluencerDialogProps) {
  if (!influencer) return null;

  const getCampaignRoute = () => {
    if (influencer.brand === "JOYRIDE") return "/joyride";
    if (influencer.brand === "NUTCASE") return "/Nutcase";
    if (influencer.brand === "Ketone-IQ") return "/ketone";
    if (influencer.brand === "ItsCalledW") return "/itscalledw";
    return "/";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[90vh] p-3 sm:p-6 rounded-2xl sm:rounded-2xl">
        <DialogHeader className="mb-3 sm:mb-6">
          <DialogTitle className="text-lg sm:text-2xl">Brand Influencer</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col md:flex-row gap-3 sm:gap-6">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="relative w-32 h-32 sm:w-32 sm:h-32 md:w-full md:h-48 rounded-full overflow-hidden border-4 border-white shadow-xl mb-3">
              <Image
                src={influencer.image}
                alt={influencer.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 128px, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-center">{influencer.name}</h3>
            <p className="text-xs sm:text-sm text-gray-500 text-center">{influencer.brand}</p>
          </div>
          
          <div className="w-full md:w-2/3 space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base text-gray-700">{influencer.bio}</p>
            
            <div>
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                {influencer.socialAccounts.map((account) => (
                  <a 
                    key={account.name}
                    href={account.username ? `${account.url}/${account.username}` : account.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline w-full sm:w-auto"
                  >
                    <Card className={`overflow-hidden group transition-all duration-200 hover:shadow-sm ${account.lightBg} hover:scale-105`}>
                      <CardContent className="p-2 sm:p-3 flex items-center justify-center">
                        <div className="flex items-center space-x-2">
                          {account.icon === "Facebook" && (
                            <Facebook className={`w-5 h-5 ${account.color} group-hover:scale-110 transition-transform duration-200`} />
                          )}
                          {account.icon === "Twitter" && (
                            <Twitter className={`w-5 h-5 ${account.color} group-hover:scale-110 transition-transform duration-200`} />
                          )}
                          {account.icon === "Instagram" && (
                            <Instagram className={`w-5 h-5 ${account.color} group-hover:scale-110 transition-transform duration-200`} />
                          )}
                          {account.icon === "TikTok" && (
                            <TikTok className={`w-5 h-5 ${account.color} group-hover:scale-110 transition-transform duration-200`} />
                          )}
                          {account.icon === "Youtube" && (
                            <Youtube className={`w-5 h-5 ${account.color} group-hover:scale-110 transition-transform duration-200`} />
                          )}
                          {account.icon === "Website" && (
                            <Globe className={`w-5 h-5 ${account.color} group-hover:scale-110 transition-transform duration-200`} />
                          )}
                          <span className="text-xs sm:text-sm font-medium">{account.name.replace(" Profile", "").replace(" Channel", "")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 sm:absolute sm:bottom-8 sm:right-8 flex justify-end">
          <Button 
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-base flex items-center gap-1.5 sm:gap-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
            onClick={() => window.open(getCampaignRoute(), '_blank')}
          >
            <span>Brand</span>
            <div className="bg-emerald-400/50 text-white flex justify-center items-center rounded-full p-1 sm:p-1.5">
              <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
