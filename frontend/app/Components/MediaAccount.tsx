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

// Updated TikTok icon with official logo design
const TikTok = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export function ConnectMedia({ logoOnly = false, socialAccounts  }) {

  // const socialCcounts = [
  //   {
  //     name: "Facebook",
  //     icon: Facebook,
      // color: "text-[#1877F2]",
  //     bgColor: "bg-[#1877F2]",
  //     hoverBg: "hover:bg-[#1877F2]/90",
  //     lightBg: "hover:bg-[#1877f2]/10",
  //     url: "https://facebook.com",
  //   },
  //   {
  //     name: "Twitter Profile",
  //     icon: Twitter,
      // color: "text-[#1DA1F2]",
      // bgColor: "bg-[#1DA1F2]",
      // hoverBg: "hover:bg-[#1DA1F2]/90",
      // lightBg: "hover:bg-[#1DA1F2]/10",
  //     url: "https://twitter.com",
  //   },

  //   {
  //     name: "Instagram Profile",
  //     icon: Instagram,
      // color: "text-[#E4405F]",
      // bgColor: "bg-[#E4405F]",
      // hoverBg: "hover:bg-[#E4405F]/90",
      // lightBg: "hover:bg-[#E4405F]/10",
  //     url: "https://instagram.com",
  //   },
  //   {
  //     name: "TikTok Profile",
  //     icon: TikTok,
  //     color: "text-[#000000]",
  //     bgColor: "bg-[#000000]",
  //     hoverBg: "hover:bg-[#000000]/90",
  //     lightBg: "hover:bg-[#000000]/10",
  //     url: "https://tiktok.com",
  //   },
  //   {
  //     name: "YouTube Channel",
  //     icon: Youtube,
      // color: "text-[#FF0000]",
      // bgColor: "bg-[#FF0000]",
      // hoverBg: "hover:bg-[#FF0000]/90",
      // lightBg: "hover:bg-[#FF0000]/10",
  //     url: "https://youtube.com",
  //   },
  // ]

  return (
    <div className={`w-full mt-4 ${logoOnly ? 'justify-center' : ''}`}>
      <div className="flex flex-wrap gap-6 justify-center">
        {socialAccounts && socialAccounts? (
          <>
          {socialAccounts.map((account) => (
            <>
          {account.name !== "Company Website" && (
            <a 
              key={account.name}
              href={`${account.url}/@${account.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
            >
              <Card className={`overflow-hidden group transition-all duration-200 hover:shadow-sm 
                ${account.lightBg} ${logoOnly ? '' : 'hover:scale-105'}`}>
                <CardContent className={`p-4 flex flex-col items-center justify-center h-full ${logoOnly ? '' : ''}`}>
                  <div className={`flex flex-col items-center space-y-2 ${logoOnly ? '' : 'gap-2 p-2 rounded-lg'}`}>
                    {account.icon === "TikTok" && (
                      <TikTok className={`w-8 h-8 ${account.color} group-hover:scale-110 transition-transform duration-200
                      ${logoOnly ? 'w-32 h-32' : ''}`} />
                    )}
                    {account.icon === "Facebook" && (
                      <Facebook className={`w-8 h-8 ${account.color} group-hover:scale-110 transition-transform duration-200
                      ${logoOnly ? 'w-32 h-32' : ''}`} />
                    )}
                    {account.icon === "Twitter" && (
                      <Twitter className={`w-8 h-8 ${account.color} group-hover:scale-110 transition-transform duration-200
                      ${logoOnly ? 'w-32 h-32' : ''}`} />
                    )}
                    {account.icon === "Instagram" && (
                      <Instagram className={`w-8 h-8 ${account.color} group-hover:scale-110 transition-transform duration-200
                      ${logoOnly ? 'w-32 h-32' : ''}`} />
                    )}
                    {account.icon === "Youtube" && (
                      <Youtube className={`w-8 h-8 ${account.color} group-hover:scale-110 transition-transform duration-200
                      ${logoOnly ? 'w-32 h-32' : ''}`} />
                    )}
                    {!logoOnly && <span className="text-sm text-center font-medium group-hover:text-black/70">{account.name}</span>}
                    {!logoOnly && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`mt-2 rounded-full text-white ${account.bgColor} ${account.hoverBg} 
                          transition-all duration-200 px-6 py-1 group-hover:shadow-sm`}
                      >
                        Connect
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </a>
          )}
          </>
        ))}
          </>
        )
        :
        (
          <div></div>
        )
      }

      </div>
    </div>
  )
}